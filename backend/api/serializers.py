from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer
from api.models import Student, Course, Department, Semester, Major, Minor


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"
        expandable_fields = {
            "prerequisites": ("api.CourseSerializer", {"many": True}),
        }


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = "__all__"
        expandable_fields = {
            "planned_courses": ("api.CourseSerializer", {"many": True}),
        }


class MajorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Major
        fields = "__all__"
        expandable_fields = {
            "required_courses": ("api.CourseSerializer", {"many": True}),
        }


class MinorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Minor
        fields = "__all__"
        expandable_fields = {
            "required_courses": ("api.CourseSerializer", {"many": True}),
        }


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"
        expandable_fields = {
            "major": ("api.MajorSerializer", {"many": True}),
            "minor": ("api.MinorSerializer", {"many": True}),
        }
