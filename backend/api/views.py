from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ViewSet
from api.models import Student, Course, Department, Semester, Program
from .serializers import (
    StudentSerializer,
    CourseSerializer,
    DepartmentSerializer,
    SemesterSerializer,
    ProgramSerializer,
)


@api_view(["GET"])
@permission_classes([AllowAny])
def api_overview(request):
    api_urls = {
        # Auth Endpoints
        "[POST  ] Login": "/auth/login",
        "[POST  ] Refresh Token": "/auth/login/refresh",
        "[POST  ] Register": "/auth/register",
        "[PUT   ] Change Password": "/auth/change_password",
        "[GET  ] Validate Token": "/auth/validate_token",
        "[POST  ] Logout": "/auth/logout",
        "[GET  ] Check User Exists": "/auth/user_exist",
        # Student Endpoints
        "[GET   ] Get Authenticated Student Info": "/student/",
        "[PUT   ] Update Authenticated Student Info": "/student/0/",
        "[DELETE] Delete Student": "/student/0/",
        # Course Endpoints
        "[GET   ] List All Courses": "/courses/",
        "[GET   ] Get Course Detail": "/courses/<str:pk>",
        # Department Endpoints
        "[GET   ] List All Departments": "/departments/",
        "[GET   ] Get Department Detail": "/departments/<str:pk>",
        # Semester Endpoints
        "[GET   ] List All Semesters": "/semesters/",
        "[PUT   ] Update Semester Detail": "/semesters/<str:pk>",
        # Program Endpoints
        "[GET   ] List All Programs": "/programs/",
        "[GET   ] Program Detail": "/programs/<str:pk>",
    }
    return Response(api_urls)


class StudentViewSet(ViewSet):
    serializer_class = StudentSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def list(self, request, *args, **kwargs):
        student = self.get_object()
        serializer = StudentSerializer(student, many=False)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        student = self.get_object()
        serializer = StudentSerializer(student)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        student = self.get_object()
        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        student = self.get_object()
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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


class SemesterViewSet(ViewSet):
    serializer_class = SemesterSerializer
    queryset = Semester.objects.all()
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def list(self, request):
        authenticated_student = self.request.user
        semesters = self.queryset.filter(student=authenticated_student)

        def semester_sorter(semester):
            season, year = semester.name.split()
            return (year, 0 if season == "Spring" else 1)

        semesters = sorted(semesters, key=semester_sorter)
        serializer = SemesterSerializer(
            semesters,
            many=True,
        )
        return Response(serializer.data)

    def update(self, request, pk=None):
        authenticated_student = self.request.user
        semesters = self.queryset.filter(student=authenticated_student).get(pk=pk)
        serializer = SemesterSerializer(semesters, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
