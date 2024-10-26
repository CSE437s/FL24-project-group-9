from datetime import timedelta
from http import HTTPStatus
from unittest.mock import patch

from django.contrib.auth.tokens import default_token_generator
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from api.models import Student


class LoginViewTests(TestCase):
    def setUp(self):
        self.url = reverse("token_obtain_pair")

    def test_login_failure(self):
        data = {
            "email": "test@wustl.edu",
            "password": "testpassword123",
        }

        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_login_success(self):
        data = {
            "email": "test@wustl.edu",
            "password": "testpassword123",
        }

        Student.objects.create_user(
            username=data["email"], email=data["email"], password=data["password"]
        )

        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)


class RegisterViewTests(TestCase):
    def setUp(self):
        self.url = reverse("auth_register")

    @patch("auth.views.send_mail")
    def test_register_success(self, mock_send_mail):
        data = {
            "email": "test@wustl.edu",
            "password": "testpassword123",
            "password2": "testpassword123",
            "first_name": "Test",
            "last_name": "User",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertIn("success", response.data)
        self.assertTrue(Student.objects.filter(email=data["email"]).exists())
        mock_send_mail.assert_called_once()

    def test_register_invalid_data(self):
        data = {
            "email": "invalid-email",
            "password": "short",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertIn("password2", response.data)

    def test_register_user_existed(self):
        data = {
            "email": "test@wustl.edu",
            "password": "testpassword123",
            "password2": "testpassword123",
            "first_name": "Test",
            "last_name": "User",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertTrue(Student.objects.filter(email=data["email"]).exists())

        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)


class VerifyEmailViewTest(TestCase):
    def setUp(self):
        self.user = Student.objects.create_user(
            username="test@wustl.edu",
            email="test@wustl.edu",
            password="testpassword123",
        )
        self.user.is_active = False
        self.user.save()

        self.token = default_token_generator.make_token(self.user)
        self.uid = self.user.id

        self.verify_url = reverse(
            "verify_email", kwargs={"uid": self.uid, "token": self.token}
        )

    def test_verify_email_success(self):
        response = self.client.get(self.verify_url)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data, {"success": "Email verified successfully"})

        # Check if the user is now active
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)

    def test_verify_email_invalid_uid(self):
        invalid_uid = self.uid + 1  # Use an ID that does not exist
        verify_url_invalid_uid = reverse(
            "verify_email", kwargs={"uid": invalid_uid, "token": self.token}
        )

        response = self.client.get(verify_url_invalid_uid)
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Invalid user ID"})

    def test_verify_email_invalid_token(self):
        invalid_token = "invalid_token_string"  # Use an invalid token
        verify_url_invalid_token = reverse(
            "verify_email", kwargs={"uid": self.uid, "token": invalid_token}
        )

        response = self.client.get(verify_url_invalid_token)
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Invalid token"})

    def test_verify_email_user_already_active(self):
        self.user.is_active = True
        self.user.save()

        response = self.client.get(self.verify_url)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data, {"success": "Email verified successfully"})

        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)


class LogoutViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.email = "test@wustl.edu"
        self.password = "testpassword123"
        self.user = Student.objects.create_user(
            username=self.email, email=self.email, password=self.password
        )
        self.token_url = reverse("token_obtain_pair")
        self.url = reverse("auth_logout")

        response = self.client.post(
            self.token_url,
            {"email": self.email, "password": self.password},
            format="json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token)

    def test_logout_success(self):
        response = self.client.post(self.url)
        self.assertNotIn("_auth_user_id", self.client.session)
        self.assertEqual(response.status_code, HTTPStatus.OK)

    def test_logout_not_authenticated(self):
        self.client.logout()
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)


class ValidateTokenViewTest(TestCase):
    def setUp(self):
        self.user = Student.objects.create_user(
            username="test@wustl.edu",
            email="test@wustl.edu",
            password="testpassword123",
        )
        self.valid_token = AccessToken.for_user(self.user)
        self.url = reverse("auth_validate_token")

    def test_validate_token_success(self):
        response = self.client.post(self.url, {"token": str(self.valid_token)})
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data, {"valid": True, "message": "Token is valid."})

    def test_validate_token_missing(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Token is required."})

    def test_validate_token_invalid(self):
        # Create an invalid token
        invalid_token = "invalid_token_string"
        response = self.client.post(self.url, {"token": invalid_token})
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)
        self.assertEqual(
            response.data,
            {"valid": False, "message": "Token is invalid or has expired."},
        )

    def test_validate_token_expired(self):
        # Create an expired token by modifying the payload
        token = AccessToken.for_user(self.user)
        token.payload["exp"] = timezone.now() - timedelta(seconds=1)
        response = self.client.post(self.url, {"token": str(token)})
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)
        self.assertEqual(
            response.data,
            {"valid": False, "message": "Token is invalid or has expired."},
        )


class CheckUserExistViewTest(TestCase):
    def setUp(self):
        self.url = reverse("auth_user_exist")

    def test_user_exists_and_active(self):
        # Create an active user
        active_user = Student.objects.create_user(
            username="test@wustl.edu",
            email="test@wustl.edu",
            password="testpassword123",
        )
        active_user.is_active = True
        active_user.save()

        response = self.client.post(self.url, {"email": "test@wustl.edu"})
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(
            response.data,
            {
                "exist": True,
                "active": True,
                "message": "User with this email exists.",
            },
        )

    def test_user_exists_and_inactive(self):
        # Create an inactive user
        inactive_user = Student.objects.create_user(
            username="test@wustl.edu",
            email="test@wustl.edu",
            password="testpassword123",
        )
        inactive_user.is_active = False
        inactive_user.save()

        response = self.client.post(self.url, {"email": "test@wustl.edu"})
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(
            response.data,
            {
                "exist": True,
                "active": False,
                "message": "User with this email exists but inactive",
            },
        )

    def test_user_does_not_exist(self):
        response = self.client.post(self.url, {"email": "test@wustl.edu"})
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(
            response.data,
            {
                "exist": False,
                "active": False,
                "message": "User with this email does not exist.",
            },
        )

    def test_missing_email(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Email is required."})


class ResetPasswordViewTest(TestCase):
    def setUp(self):
        self.url = reverse("reset_password")

    @patch("auth.views.send_mail")
    def test_reset_password_email_sent(self, mock_send_mail):
        Student.objects.create_user(
            username="test@wustl.edu",
            email="test@wustl.edu",
            password="testpassword123",
        )

        response = self.client.post(self.url, {"email": "test@wustl.edu"})
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data, {"success": "Password reset email sent."})
        mock_send_mail.assert_called_once()

    def test_reset_password_email_missing(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Email is required"})

    def test_reset_password_user_does_not_exist(self):
        response = self.client.post(self.url, {"email": "test@wustl.edu"})
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(
            response.data, {"error": "User with this email does not exist."}
        )


class ResetPasswordConfirmViewTest(TestCase):
    def setUp(self):
        self.user = Student.objects.create_user(
            username="test@wustl.edu",
            email="test@wustl.edu",
            password="testpassword123",
        )
        self.uid = self.user.pk
        self.token = default_token_generator.make_token(self.user)
        self.url = reverse(
            "reset_password_confirm", kwargs={"uid": self.uid, "token": self.token}
        )  # Adjust with your URL name

    def test_reset_password_success(self):
        new_password = "newtestpass"
        response = self.client.post(self.url, {"password": new_password})
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data, {"success": "Password has been reset."})

        # Verify that the password has been updated
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(new_password))

    def test_reset_password_missing(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Password is required."})

    def test_reset_password_invalid_token(self):
        invalid_token = "invalid_token"
        url_with_invalid_token = reverse(
            "reset_password_confirm", kwargs={"uid": self.uid, "token": invalid_token}
        )

        response = self.client.post(url_with_invalid_token, {"password": "newtestpass"})
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Invalid token."})

    def test_reset_password_user_does_not_exist(self):
        invalid_uid = self.uid + 1  # Use an ID that does not exist
        url_with_invalid_uid = reverse(
            "reset_password_confirm", kwargs={"uid": invalid_uid, "token": self.token}
        )

        response = self.client.post(url_with_invalid_uid, {"password": "newtestpass"})
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(
            response.data, {"error": "User with this email does not exist."}
        )
