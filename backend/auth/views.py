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
from api.serializers import StudentSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import AccessToken, TokenError


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

    def get_bearer_token(self, request):
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            return auth_header.split(" ")[1]
        return None

    def post(self, request):
        token = self.get_bearer_token(request)
        if not token:
            return Response(
                {"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(token)
            token.blacklist()

            return Response(
                {"detail": "Successfully logged out."},
                status=status.HTTP_205_RESET_CONTENT,
            )
        except Exception as e:
            return Response(
                {"detail": "An error occurred during logout: {}".format(str(e))},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ValidateTokenView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        token = request.data.get("token")
        if not token:
            return Response(
                {"error": "Token is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            AccessToken(token)
            return Response(
                {"valid": True, "message": "Token is valid."}, status=status.HTTP_200_OK
            )
        except TokenError:
            return Response(
                {"valid": False, "message": "Token is invalid or has expired."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
