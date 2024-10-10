from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.models import Student, Course, Department, Semester, Program
from .serializers import (
    StudentSerializer,
    CourseSerializer,
    DepartmentSerializer,
    SemesterSerializer,
    ProgramSerializer,
)


@api_view(["GET"])
def api_overview(request):
    api_urls = {
        # Auth Endpoints
        "Login": "/auth/login/",
        "Token Refresh": "/auth/login/refresh/",
        "Register": "/auth/register/",
        "Change Password": "/auth/change_password/<int:pk>/",
        "Update Profile": "/auth/update_profile/<int:pk>/",
        "Logout": "/auth/logout/",
        # Student Endpoints
        "GET Student": "/student/<str:pk>/",
        "CREATE Student": "/student/",
        "UPDATE Student": "/student/<str:pk>/",
        "DELETE Student": "/student/<str:pk>/",
        # Course Endpoints
        "GET All Courses": "/courses/",
        "GET Course Detail": "/courses/<str:pk>/",
        # Department Endpoints
        "GET All Departments": "/departments/",
        "GET Department Detail": "/departments/<str:pk>/",
        # Semester Endpoints
        "GET All Semesters": "/semesters/",
        "UPDATE Semester": "/semesters/<str:pk>/",
        # Major Endpoints
        "GET All Majors": "/majors/",
        "GET Major Detail": "/majors/<str:pk>/",
        # Minor Endpoints
        "GET All Minors": "/minors/",
        "GET Minor Detail": "/minors/<str:pk>/",
    }
    return Response(api_urls)


class StudentViewSet(ModelViewSet):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()
    permission_classes = (IsAuthenticated,)


class CourseViewSet(ReadOnlyModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()
    permission_classes = (IsAuthenticated,)


class DepartmentViewSet(ReadOnlyModelViewSet):
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()
    permission_classes = (IsAuthenticated,)


class ProgramViewSet(ReadOnlyModelViewSet):
    serializer_class = ProgramSerializer
    queryset = Program.objects.all()
    permission_classes = (IsAuthenticated,)


class SemesterViewSet(ModelViewSet):
    serializer_class = SemesterSerializer
    queryset = Semester.objects.all()
    permission_classes = (IsAuthenticated,)
