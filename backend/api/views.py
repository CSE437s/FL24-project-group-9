from datetime import date

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet, ViewSet

from api.models import Course, Department, Program, Semester, Student

from .serializers import (
    CourseSerializer,
    DepartmentSerializer,
    ProgramSerializer,
    SemesterSerializer,
    StudentSerializer,
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

    def is_completed(self, semester, year):
        today_year = date.today().year
        today_month = date.today().month
        return (
            year < today_year
            or (year == today_year and semester == "Fall" and today_month > 11)
            or (year == today_year and semester == "Spring" and today_month > 4)
        )

    def update(self, request, *args, **kwargs):
        student = self.get_object()
        serializer = StudentSerializer(student, data=request.data, partial=True)

        if "grad" in request.data:
            grad_year = int(request.data["grad"])
            joined_year = grad_year - 4
            Semester.objects.filter(student=student).delete()
            for year in range(joined_year, grad_year + 1):
                if year == joined_year:
                    Semester.objects.create(
                        student=student,
                        name=f"Fall {year}",
                        isCompleted=self.is_completed("Fall", year),
                    )
                elif year == grad_year:
                    Semester.objects.create(
                        student=student,
                        name=f"Spring {year}",
                        isCompleted=self.is_completed("Spring", year),
                    )
                else:
                    Semester.objects.create(
                        student=student,
                        name=f"Spring {year}",
                        isCompleted=self.is_completed("Spring", year),
                    )
                    Semester.objects.create(
                        student=student,
                        name=f"Fall {year}",
                        isCompleted=self.is_completed("Fall", year),
                    )

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
