from datetime import date

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet, ViewSet
from rest_framework.exceptions import ValidationError

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
            try:
                grad_year = int(request.data["grad"])
                if grad_year != student.grad:
                    student.grad = grad_year
            except ValueError:
                raise ValidationError({"grad": "Graduation year must be a valid integer."})

            existing_semesters = {
                semester.name: semester
                for semester in Semester.objects.filter(student=student)
            }
            new_semesters = []

            for year in range(grad_year - 4, grad_year):
                fall_name = f"Fall {year}"
                spring_name = f"Spring {year + 1}"

                if fall_name in existing_semesters:
                    fall_semester = existing_semesters[fall_name]
                    fall_semester.isCompleted = self.is_completed("Fall", year)
                else:
                    fall_semester = Semester(
                        student=student,
                        name=fall_name,
                        isCompleted=self.is_completed("Fall", year),
                    )
                new_semesters.append(fall_semester)

                if spring_name in existing_semesters:
                    spring_semester = existing_semesters[spring_name]
                    spring_semester.isCompleted = self.is_completed("Spring", year + 1)
                else:
                    spring_semester = Semester(
                        student=student,
                        name=spring_name,
                        isCompleted=self.is_completed("Spring", year + 1),
                    )
                new_semesters.append(spring_semester)

        Semester.objects.filter(student=student).exclude(
            name__in=[semester.name for semester in new_semesters]
        ).delete()
        for semester in new_semesters:
            semester.save()

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
