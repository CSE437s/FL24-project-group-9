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
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import AccessToken, TokenError
from django.contrib.auth import logout


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

        serializer.save()

        return Response(
            {
                "success": "Registration successful. Please check your email to confirm your account."
            },
            status=status.HTTP_201_CREATED,
        )


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

        is_user_exist = Student.objects.filter(email=email).exists()
        if is_user_exist:
            return Response(
                {"exist": True, "message": "User with this email exists."},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"exist": False, "message": "User with this email does not exist."},
                status=status.HTTP_200_OK,
            )
