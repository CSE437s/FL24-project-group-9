from rest_framework.permissions import AllowAny
from api.models import Student
from auth.serializers import (
    RegisterSerializer,
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer,
)
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import AccessToken, TokenError
from rest_framework import serializers
from django.contrib.auth import logout
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        if not user.is_active:
            raise serializers.ValidationError('Email not verified.')

        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        user.is_active = False
        user.save()

        token = default_token_generator.make_token(user)
        uid = user.pk

        # Create verification URL
        verification_url = f"http://localhost:5173/verify_email/{uid}/{token}/"

        send_mail(
            'Verify your email',
            f'Please click the link to verify your email: {verification_url}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

        return Response(
            {
                "success": "Registration successful. Please check your email to confirm your account."
            },
            status=status.HTTP_201_CREATED,
        )
    

class VerifyEmailView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, uid, token, *args, **kwargs):
        try:
            user = Student.objects.get(pk=uid)
        except Student.DoesNotExist:
            return Response({"error": "Invalid user ID"}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"success": "Email verified successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(generics.UpdateAPIView):
    queryset = Student.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        logout(request)
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)


class ValidateTokenView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response(
                {"error": "Token is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            access_token = AccessToken(token)
            user_id = access_token["user_id"]
            Student.objects.get(id=user_id)
            return Response(
                {"valid": True, "message": "Token is valid."}, status=status.HTTP_200_OK
            )
        except TokenError:
            return Response(
                {"valid": False, "message": "Token is invalid or has expired."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class CheckUserExistView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = Student.objects.get(email=email)
            if user.is_active:
                return Response(
                    {"exist": True, "active": True, "message": "User with this email exists."},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"exist": True, "active": False, "message": "User with this email exists but inactive"},
                status=status.HTTP_200_OK,
            )
        except Student.DoesNotExist:
            return Response(
                {"exist": False, "active": False, "message": "User with this email does not exist."},
                status=status.HTTP_200_OK,
            )


class ResetPasswordView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Student.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = user.pk
            reset_url = f"http://localhost:5173/reset_password/{uid}/{token}/"
            send_mail(
                'Reset your password',
                f'Please click the link to reset your password: {reset_url}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            return Response({"success": "Password reset email sent."}, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordConfirmView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, uid, token, *args, **kwargs):
        password = request.data.get('password')
        if not password:
            return Response({"error": "Password is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Student.objects.get(pk=uid)
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({"success": "Password has been reset."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        except Student.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)