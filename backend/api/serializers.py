from rest_framework import serializers
from api.models import Student, Course, Department, Semester, Program


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        read_only_fields = "__all__"


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        read_only_fields = "__all__"


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = "__all__"
        read_only_fields = ["student", "name"]


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        read_only_fields = "__all__"


class StudentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = Student
        fields = "__all__"
        extra_kwargs = {"password": {"write_only": True}}
