from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views import (
    CourseViewSet,
    DepartmentViewSet,
    ProgramViewSet,
    ReviewViewSet,
    SemesterViewSet,
    StudentViewSet,
    get_chat_response,
)

router = DefaultRouter()
router.register("student", StudentViewSet, basename="student")
router.register("courses", CourseViewSet, basename="course")
router.register("departments", DepartmentViewSet, basename="department")
router.register("semesters", SemesterViewSet, basename="semester")
router.register("programs", ProgramViewSet, basename="program")
router.register("reviews", ReviewViewSet, basename="review")

urlpatterns = [
    path("", include(router.urls)),
    path("chat/", get_chat_response, name="chatbot-response"),
]

for url_pattern in urlpatterns:
    print(url_pattern)
