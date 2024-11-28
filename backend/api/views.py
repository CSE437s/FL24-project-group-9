import json
from datetime import date

from django.conf import settings
from django.core.cache import cache
from django.core.cache.backends.base import DEFAULT_TIMEOUT
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

CACHE_TTL = getattr(settings, "CACHE_TTL", DEFAULT_TIMEOUT)


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
        "[GET   ] Get Authenticated Student Info": "/api/student/",
        "[PUT   ] Update Authenticated Student Info": "/api/student/0/",
        "[DELETE] Delete Student": "/api/student/0/",
        # Course Endpoints
        "[GET   ] List All Courses": "/api/courses/",
        "[GET   ] Get Course Detail": "/api/courses/<str:pk>",
        # Department Endpoints
        "[GET   ] List All Departments": "/api/departments/",
        "[GET   ] Get Department Detail": "/api/departments/<str:pk>",
        # Semester Endpoints
        "[GET   ] List All Semesters": "/api/semesters/",
        "[PUT   ] Update Semester Detail": "/api/semesters/<str:pk>",
        "[POST   ] Generate New schedule": "/api/semesters/generate/",
        # Program Endpoints
        "[GET   ] List All Programs": "/api/programs/",
        "[GET   ] Program Detail": "/api/programs/<str:pk>",
        # Review Endpoints
        "[GET   ] List All Reviews": "/api/reviews/?course_id=<course_id>",
        "[GET   ] Get Review Detail": "/api/reviews/<str:pk>",
        "[POST  ] Create Review": "/api/reviews",
        "[PUT   ] Update Review Detail": "/api/reviews/<str:pk>",
        "[DELETE] Delete Review": "/api/reviews/<str:pk>",
        # Chatbot Endpoints
        "[POST  ] Get Chat Response": "/api/chat/",
    }
    return Response(api_urls)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_chat_response(request):
    try:
        message = request.data.get("message", "")
        response = OpenAIUltils.generate_chat_response(message)
        response = json.loads(response)
        message = response.get("message", "")
        course_code = response.get("course", "")
        if not course_code:
            return Response({"message": message}, status=200)
        course = Course.objects.filter(code__icontains=course_code).first()
        return Response(
            {"message": message, "course": CourseSerializer(course).data}, status=200
        )
    except ValueError:
        return Response({"Error": "Failed to generate"}, status=400)


def validate_schedule_helper(generated_courses):
    seen_course_codes = set()
    seen_course_titles = set()
    validated_courses = {}
    for semester_name, course_codes in generated_courses.items():
        validated_code = []
        for course_code in course_codes:
            if len(course_code.split()) != 3:
                continue

            if not Course.objects.filter(code__icontains=course_code).exists():
                continue

            if Course.objects.filter(code__icontains=course_code)[0].units == 0:
                continue

            course_title = Course.objects.filter(code__icontains=course_code)[0].title
            if course_code in seen_course_codes or course_title in seen_course_titles:
                continue

            validated_code.append(course_code)
            seen_course_codes.add(course_code)
            seen_course_titles.add(course_title)

        validated_courses[semester_name] = validated_code

    return validated_courses


def generate_schedule_helper(student):
    try:
        student_embed = student.embedding
        relevant_courses = OpenAIUltils.filter_courses_by_similarity(student_embed)

        completed_semesters = cache.get(f"completed_semesters_{student.id}")
        if not completed_semesters:
            completed_semesters = Semester.objects.filter(
                student=student, isCompleted=True
            )
            cache.set(
                f"completed_semesters_{student.id}",
                completed_semesters,
                timeout=CACHE_TTL,
            )

        completed_courses = cache.get(f"completed_courses_{student.id}")
        if not completed_courses:
            completed_courses = []
            for semester in completed_semesters:
                completed_courses.extend(semester.planned_courses.all())
            completed_courses = [course.code for course in completed_courses]
            cache.set(
                f"completed_courses_{student.id}", completed_courses, timeout=CACHE_TTL
            )

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

        upcoming_semesters = cache.get(f"upcoming_semesters_{student.id}")
        if not upcoming_semesters:
            upcoming_semesters = Semester.objects.filter(
                student=student, isCompleted=False
            )
            cache.set(
                f"upcoming_semesters_{student.id}",
                upcoming_semesters,
                timeout=CACHE_TTL,
            )
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
        validated_courses = validate_schedule_helper(generated_courses)
        for semester in upcoming_semesters:
            code_list = validated_courses.get(semester.name, [])
            if code_list:
                semester.planned_courses.set(Course.objects.filter(code__in=code_list))

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
        cached_data = cache.get(f"student_list_{student.id}")

        if cached_data:
            return Response(cached_data)

        serializer = StudentSerializer(student, many=False)
        response_data = serializer.data
        cache.set(f"student_list_{student.id}", response_data, timeout=CACHE_TTL)
        return Response(response_data)

    def retrieve(self, request, *args, **kwargs):
        student = self.get_object()

        cached_data = cache.get(f"student_retrieve_{student.id}")

        if cached_data:
            return Response(cached_data)

        serializer = StudentSerializer(student)
        response_data = serializer.data
        cache.set(f"student_retrieve_{student.id}", response_data, timeout=CACHE_TTL)
        return Response(response_data)

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
        cache.delete(f"student_list_{student.id}")
        cache.delete(f"student_retrieve_{student.id}")

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
                cache.delete(f"semesters_{student.id}")

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
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        cache_key = "course_queryset"
        cached_data = cache.get(cache_key)

        if cached_data:
            return cached_data

        queryset = Course.objects.all()
        cache.set(cache_key, queryset, timeout=CACHE_TTL)
        return queryset


class DepartmentViewSet(ReadOnlyModelViewSet):
    serializer_class = DepartmentSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        cache_key = "department_queryset"
        cached_data = cache.get(cache_key)

        if cached_data:
            return cached_data

        queryset = Department.objects.all()
        cache.set(cache_key, queryset, timeout=CACHE_TTL)
        return queryset


class ProgramViewSet(ReadOnlyModelViewSet):
    serializer_class = ProgramSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        cache_key = "program_queryset"
        cached_data = cache.get(cache_key)

        if cached_data:
            return cached_data

        queryset = Program.objects.all()
        cache.set(cache_key, queryset, timeout=CACHE_TTL)
        return queryset


class SemesterViewSet(ViewSet):
    serializer_class = SemesterSerializer
    queryset = Semester.objects.all()
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def list(self, request):
        authenticated_student = self.get_object()
        cache_key = f"semesters_{authenticated_student.id}"
        semesters = cache.get(cache_key)
        if not semesters:
            semesters = self.queryset.filter(student=authenticated_student)

            def semester_sorter(semester):
                season, year = semester.name.split()
                return (year, 0 if season == "Spring" else 1)

            semesters = sorted(semesters, key=semester_sorter)
            cache.set(cache_key, semesters, timeout=CACHE_TTL)

        serializer = SemesterSerializer(
            semesters,
            many=True,
        )
        return Response(serializer.data)

    def update(self, request, pk=None):
        authenticated_student = self.get_object()
        try:
            semesters = self.queryset.filter(student=authenticated_student).get(pk=pk)
        except Semester.DoesNotExist:
            raise NotFound(detail="Semester matching query does not exist.")

        serializer = SemesterSerializer(semesters, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            cache.delete(f"semesters_{authenticated_student.id}")
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="generate")
    def generate_schedule(self, request):
        authenticated_student = self.get_object()
        schedule = generate_schedule_helper(authenticated_student)
        return schedule


class ReviewViewSet(ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        cache_key = "review_queryset"
        queryset = cache.get(cache_key)

        if not queryset:
            queryset = Review.objects.all()
            cache.set(cache_key, queryset, timeout=CACHE_TTL)

        course_id = self.request.query_params.get("course_id")
        if course_id is not None:
            queryset = queryset.filter(course_id=course_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
