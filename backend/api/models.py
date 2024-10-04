from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Department(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255, unique=True)
    url = models.URLField()

    def __str__(self):
        return self.code + " " + self.name


class Course(models.Model):
    title = models.CharField(max_length=255)
    code = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    units = models.PositiveIntegerField()
    url = models.URLField()
    prerequisites = models.ManyToManyField(
        "self", blank=True, related_name="prerequisite_for", symmetrical=False
    )

    def __str__(self):
        return self.code + " " + self.title


class DepCourse(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.course.title} - {self.department.name}"

    class Meta:
        unique_together = ("course", "department")


class Major(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255, unique=True)
    required_courses = models.ManyToManyField(Course, blank=True)
    required_units = models.PositiveIntegerField()

    def __str__(self):
        return self.name


class Minor(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255, unique=True)
    required_courses = models.ManyToManyField(Course, blank=True)
    required_units = models.PositiveIntegerField()

    def __str__(self):
        return self.name


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    email = models.EmailField()
    joined = models.DateField(null=True, blank=True)
    grad = models.DateField(null=True, blank=True)
    majors = models.ManyToManyField(Major, blank=True)
    minors = models.ManyToManyField(Minor, blank=True)
    career = models.CharField(max_length=255)
    required_units = models.IntegerField()
    interests = models.TextField()

    def __str__(self):
        return self.firstname + " " + self.lastname


class Semester(models.Model):
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    planned_courses = models.ManyToManyField(Course)
    isCompleted = models.BooleanField()

    def __str__(self):
        return self.name
