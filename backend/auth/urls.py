from django.urls import path
from auth.views import (
    RegisterView,
    ChangePasswordView,
    LogoutView,
    CustomTokenObtainPairView,
    ValidateTokenView,
)
from rest_framework_simplejwt.views import TokenRefreshView
from django.views.generic.base import RedirectView


urlpatterns = [
    path("login", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("login/", RedirectView.as_view(url="login", permanent=True)),
    path("login/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("login/refresh/", RedirectView.as_view(url="login/refresh", permanent=True)),
    path("register", RegisterView.as_view(), name="auth_register"),
    path("register/", RedirectView.as_view(url="register", permanent=True)),
    path(
        "change_password",
        ChangePasswordView.as_view(),
        name="auth_change_password",
    ),
    path(
        "change_password/", RedirectView.as_view(url="change_password", permanent=True)
    ),
    path("logout", LogoutView.as_view(), name="auth_logout"),
    path("logout/", RedirectView.as_view(url="logout", permanent=True)),
    path("validate_token", ValidateTokenView.as_view(), name="auth_validate_token"),
    path(
        "validate_token/",
        RedirectView.as_view(url="validate_token", permanent=True),
    ),
]
