from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views import (
    CourseViewSet,
    DepartmentViewSet,
    ProgramViewSet,
    SemesterViewSet,
    StudentViewSet,
)

router = DefaultRouter()
router.register("student", StudentViewSet, basename="student")
router.register("courses", CourseViewSet, basename="course")
router.register("departments", DepartmentViewSet, basename="department")
router.register("semesters", SemesterViewSet, basename="semester")
router.register("programs", ProgramViewSet, basename="program")

urlpatterns = [
    path("", include(router.urls)),
]
