import json
from datetime import date

from django.db.models import Q
from rest_framework import permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet, ViewSet

from api.models import Course, Department, Program, Review, Semester, Student
from openai_integration.utils import OpenAIUltils

from .serializers import (
    CourseSerializer,
    DepartmentSerializer,
    ProgramSerializer,
    ReviewSerializer,
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
        "[POST   ] Generate New schedule": "/semesters/generate/",
        # Program Endpoints
        "[GET   ] List All Programs": "/programs/",
        "[GET   ] Program Detail": "/programs/<str:pk>",
        # Review Endpoints
        "[GET   ] List All Reviews": "/reviews/?course_id=<course_id>",
        "[GET   ] Get Review Detail": "/reviews/<str:pk>",
        "[POST  ] Create Review": "/reviews",
        "[PUT   ] Update Review Detail": "/reviews/<str:pk>",
        "[DELETE] Delete Review": "/reviews/<str:pk>",
    }
    return Response(api_urls)


def generate_schedule_helper(student):
    try:
        student_embed = student.embedding
        relevant_courses = OpenAIUltils.filter_courses_by_similarity(student_embed)
        completed_semesters = Semester.objects.filter(student=student, isCompleted=True)
        completed_courses = []
        for semester in completed_semesters:
            completed_courses.extend(semester.planned_courses.all())
        completed_courses = [course.code for course in completed_courses]
        relevant_courses = [
            course for course in relevant_courses if course not in completed_courses
        ]
        required_courses = [
            "E81 CSE 131",
            "E81 CSE 132",
            "E81 CSE 240",
            "E81 CSE 247",
            "E81 CSE 332S",
            "E81 CSE 347",
            "E81 CSE 361S",
            "L24 Math 131",
            "L24 Math 132",
            "L24 Math 233",
            "L24 Math 309",
            "E35 ESE 326",
            "L59 CWP 100",
            "E60 Engr 310",
        ]
        required_courses = [
            course for course in required_courses if course not in completed_courses
        ]

        upcoming_semesters = Semester.objects.filter(student=student, isCompleted=False)
        student_semester_text = ",".join(
            semester.name for semester in upcoming_semesters
        )
        student_profile_text = f"{student.interests};{student.career}"

        generated_courses = OpenAIUltils.generate_course_plan(
            required_courses,
            student_semester_text,
            student_profile_text,
            relevant_courses,
        )

        generated_courses = json.loads(generated_courses)
        for semester in upcoming_semesters:
            code_list = generated_courses.get(semester.name, [])
            if code_list:
                query = Q()
                for code in code_list:
                    query |= Q(code__icontains=code)
                semester.planned_courses.set(Course.objects.filter(query))

        generated_semesters = Semester.objects.filter(student=student)
        serialized_semesters = SemesterSerializer(generated_semesters, many=True).data

        return Response(serialized_semesters, status=200)
    except ValueError:
        return Response({"Error": "Failed to generate"}, status=400)


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
                    student.save()

                    Semester.objects.filter(student=student).delete()
                    for year in range(grad_year - 4, grad_year):
                        fall_name = f"Fall {year}"
                        spring_name = f"Spring {year + 1}"

                        Semester.objects.create(
                            student=student,
                            name=fall_name,
                            isCompleted=self.is_completed("Fall", year),
                        )

                        Semester.objects.create(
                            student=student,
                            name=spring_name,
                            isCompleted=self.is_completed("Spring", year + 1),
                        )

            except ValueError:
                raise ValidationError(
                    {"grad": "Graduation year must be a valid integer."}
                )

        if "interests" in request.data or "career" in request.data:
            interests = request.data.get("interests", "").strip()
            career = request.data.get("career", "").strip()
            if interests != student.interests or career != student.career:
                student_profile_text = interests + " " + career
                student_embeding = OpenAIUltils.generate_student_embedding(
                    student_profile_text
                )
                student.embedding = student_embeding
                student.save()

        if serializer.is_valid():
            serializer.save(embedding=student.embedding)
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
        try:
            semesters = self.queryset.filter(student=authenticated_student).get(pk=pk)
        except Semester.DoesNotExist:
            raise NotFound(detail="Semester matching query does not exist.")

        serializer = SemesterSerializer(semesters, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="generate")
    def generate_schedule(self, request):
        authenticated_student = self.request.user
        schedule = generate_schedule_helper(authenticated_student)
        return schedule


class ReviewViewSet(ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = Review.objects.all()
        course_id = self.request.query_params.get("course_id")
        if course_id is not None:
            queryset = queryset.filter(course_id=course_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
