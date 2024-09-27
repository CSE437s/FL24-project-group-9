from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from database.models import Student, Course, Department, Semester, Major, Minor
from .serializers import (
    StudentSerializer,
    CourseSerializer,
    DepartmentSerializer,
    SemesterSerializer,
    MajorSerializer,
    MinorSerializer,
)


# CBV for API Overview
class ApiOverview(APIView):
    def get(self, request):
        api_urls = {
            "GET Student": "/student/<str:pk>/",
            "CREATE Student": "/student/",
            "UPDATE Student": "/student/<str:pk>/",
            "DELETE Student": "/student/<str:pk>/",
            "GET All Courses": "/courses/",
            "GET Course Detail": "/course/<str:pk>/",
            "GET All Departments": "/departments/",
            "GET Department Detail": "/department/<str:pk>/",
            "GET Semesters": "/semesters/",
            "UPDATE Semester": "/semester/<str:pk>/",
            "GET All Majors": "/majors/",
            "GET Major Detail": "/major/<str:pk>/",
            "GET All Minors": "/minors/",
            "GET Minor Detail": "/minor/<str:pk>/",
        }
        return Response(api_urls)


# Students API (List and Retrieve)
class StudentAPI(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StudentDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


# Courses API (List and Retrieve)
class CourseAPI(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class CourseDetailAPI(APIView):
    def get(self, request, pk):
        course = Course.objects.get(pk=pk)
        serializer = CourseSerializer(course, many=False)
        return Response(serializer.data)


# Departments API (List and Retrieve)
class DepartmentAPI(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class DepartmentDetailAPI(APIView):
    def get(self, request, pk):
        department = Department.objects.get(pk=pk)
        serializer = DepartmentSerializer(department, many=False)
        return Response(serializer.data)


# Semesters API (List, Retrieve, and Update)
class SemesterAPI(generics.ListCreateAPIView):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer


class SemesterDetailAPI(APIView):
    def get(self, request, pk):
        semester = Semester.objects.get(pk=pk)
        serializer = SemesterSerializer(semester, many=False)
        return Response(serializer.data)

    def put(self, request, pk):
        semester = Semester.objects.get(pk=pk)
        serializer = SemesterSerializer(instance=semester, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Majors API (List and Retrieve)
class MajorAPI(generics.ListCreateAPIView):
    queryset = Major.objects.all()
    serializer_class = MajorSerializer


class MajorDetailAPI(APIView):
    def get(self, request, pk):
        major = Major.objects.get(pk=pk)
        serializer = MajorSerializer(major, many=False)
        return Response(serializer.data)


# Minors API (List and Retrieve)
class MinorAPI(generics.ListCreateAPIView):
    queryset = Minor.objects.all()
    serializer_class = MinorSerializer


class MinorDetailAPI(APIView):
    def get(self, request, pk):
        minor = Minor.objects.get(pk=pk)
        serializer = MinorSerializer(minor, many=False)
        return Response(serializer.data)
