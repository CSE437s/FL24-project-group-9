from http import HTTPStatus

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from api.models import Course, Department, Program, Semester, Student


class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.user = Student.objects.create_user(
            username="test@wustl.edu",
            email="test@wustl.edu",
            password="testpassword123",
            grad=2025,
        )
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(self.token)}")


class StudentViewSetTest(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        # Create example semesters for the student
        self.semester1 = Semester.objects.create(
            student=self.user, name="Fall 2023", isCompleted=False
        )
        self.semester2 = Semester.objects.create(
            student=self.user, name="Spring 2024", isCompleted=False
        )

        # Define the URL for student endpoints
        self.url_list = reverse("student-list")
        self.url_detail = reverse("student-detail", kwargs={"pk": self.user.pk})

    def test_list_authenticated_student_info(self):
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data["username"], self.user.username)

    def test_retrieve_authenticated_student_info(self):
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data["username"], self.user.username)

    def test_update_student_info(self):
        updated_data = {"grad": 2026}  # Updating graduation year
        response = self.client.put(self.url_detail, updated_data)
        self.user.refresh_from_db()  # Refresh user instance from database
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(self.user.grad, 2026)
        self.assertTrue(Semester.objects.filter(pk=self.semester1.pk).exists())

    def test_update_student_info_with_invalid_data(self):
        updated_data = {"grad": "not_a_number"}  # Invalid data
        response = self.client.put(self.url_detail, updated_data)
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)

    def test_delete_student(self):
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)
        self.assertFalse(Student.objects.filter(pk=self.user.pk).exists())

    def test_delete_student_without_authentication(self):
        self.client.credentials()  # Clear the token
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)


class CourseViewSetTest(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        # Create test courses
        self.course1 = Course.objects.create(
            title="Course 1", description="Description 1", units=3, code="CSE 123"
        )
        self.course2 = Course.objects.create(
            title="Course 2", description="Description 2", units=4, code="CSE 124"
        )

        # Define the URLs
        self.url_list = reverse("course-list")
        self.url_detail1 = reverse("course-detail", kwargs={"pk": self.course1.pk})
        self.url_detail2 = reverse("course-detail", kwargs={"pk": self.course2.pk})

    def test_list_courses(self):
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(len(response.data), 2)

    def test_get_course_detail(self):
        response = self.client.get(self.url_detail1)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data["title"], self.course1.title)
        self.assertEqual(response.data["description"], self.course1.description)

    def test_get_course_detail_not_found(self):
        response = self.client.get(reverse("course-detail", kwargs={"pk": 999}))
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_list_course_unauthenticated(self):
        self.client.credentials()  # Clear the token
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_get_course_detail_unauthenticated(self):
        self.client.credentials()  # Clear the token
        response = self.client.get(self.url_detail1)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)


class DepartmentViewSetTest(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        # Create a test department
        self.department1 = Department.objects.create(name="Computer Science")
        self.department2 = Department.objects.create(name="Mathematics")

        # Define URLs
        self.url_list = reverse("department-list")
        self.url_detail = reverse(
            "department-detail", kwargs={"pk": self.department1.pk}
        )

    def test_list_all_departments(self):
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(len(response.data), 2)

    def test_get_department_detail(self):
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data["name"], self.department1.name)

    def test_get_department_detail_not_found(self):
        response = self.client.get(
            reverse("department-detail", kwargs={"pk": 999})
        )  # Non-existent ID
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_list_departments_unauthenticated(self):
        self.client.credentials()  # Clear the token
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_get_department_detail_unauthenticated(self):
        self.client.credentials()  # Clear the token
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)


class ProgramViewSetTest(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        # Create test programs
        self.program1 = Program.objects.create(name="Accounting")
        self.program2 = Program.objects.create(name="Data Science")

        # Define URLs
        self.url_list = reverse("program-list")
        self.url_detail = reverse("program-detail", kwargs={"pk": self.program1.pk})

    def test_list_all_programs(self):
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(len(response.data), 2)

    def test_get_program_detail(self):
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data["name"], self.program1.name)

    def test_get_program_detail_not_found(self):
        response = self.client.get(reverse("program-detail", kwargs={"pk": 999}))
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_list_programs_unauthenticated(self):
        self.client.credentials()  # Clear the token
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_get_program_detail_unauthenticated(self):
        self.client.credentials()  # Clear the token
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)
