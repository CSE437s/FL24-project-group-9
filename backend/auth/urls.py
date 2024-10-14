from django.urls import path
from auth.views import (
    ResetPasswordConfirmView,
    RegisterView,
    ChangePasswordView,
    LogoutView,
    CustomTokenObtainPairView,
    ResetPasswordView,
    ValidateTokenView,
    CheckUserExistView,
    VerifyEmailView,
)
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterView.as_view(), name="auth_register"),
    path("change_password/", ChangePasswordView.as_view(), name="auth_change_password"),
    path("logout/", LogoutView.as_view(), name="auth_logout"),
    path("validate_token/", ValidateTokenView.as_view(), name="auth_validate_token"),
    path("user_exist/", CheckUserExistView.as_view(), name="auth_user_exist"),
    path('verify_email/<int:uid>/<str:token>/', VerifyEmailView.as_view(), name='verify_email'),
    path('reset_password/', ResetPasswordView.as_view(), name='password_reset'),
    path('reset_password_confirm/<int:uid>/<token>/', ResetPasswordConfirmView.as_view(), name='password_reset_confirm'),
]
