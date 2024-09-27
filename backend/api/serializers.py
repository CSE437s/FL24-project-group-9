from rest_framework import serializers
from database.models import Student
from database.models import Course
from database.models import Department
from database.models import Semester
from database.models import Major
from database.models import Minor


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = "__all__"


class MajorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Major
        fields = "__all__"


class MinorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Minor
        fields = "__all__"
