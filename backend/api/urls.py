from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    StudentViewSet,
    CourseViewSet,
    DepartmentViewSet,
    SemesterViewSet,
    ProgramViewSet,
)

router = DefaultRouter()
router.register("student", StudentViewSet, basename="Student")
router.register("courses", CourseViewSet, basename="Course")
router.register("departments", DepartmentViewSet, basename="Department")
router.register("semesters", SemesterViewSet, basename="Semester")
router.register("programs", ProgramViewSet, basename="Program")

urlpatterns = [
    path("", include(router.urls)),
]
