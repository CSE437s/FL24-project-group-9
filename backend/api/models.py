from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class Department(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()

    def __str__(self):
        return self.name


class Course(models.Model):
    title = models.CharField(max_length=255)
    code = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    units = models.PositiveIntegerField()
    url = models.URLField()
    prerequisites = models.TextField(blank=True)

    def __str__(self):
        return self.code + " " + self.title


class DepCourse(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.course.title} - {self.department.name}"

    class Meta:
        unique_together = ("course", "department")


class Program(models.Model):
    name = models.CharField(max_length=255)
    schools = models.TextField(blank=True)
    types = models.TextField(blank=True)
    url = models.URLField()
    required_courses = models.ManyToManyField(blank=True, to=Course)
    required_units = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return self.name


class Student(AbstractUser):
    joined = models.DateField(null=True, blank=True)
    grad = models.DateField(null=True, blank=True)
    programs = models.ManyToManyField(Program, blank=True)
    career = models.CharField(max_length=255, blank=True)
    required_units = models.PositiveIntegerField(blank=True, null=True)
    interests = models.TextField(blank=True)
    password = models.CharField(max_length=128, blank=True, null=True)
    username = models.CharField(max_length=255, unique=True, null=True)

    def __str__(self):
        return self.email


class Semester(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    planned_credits = models.PositiveIntegerField(default=15)
    planned_courses = models.ManyToManyField(Course, blank=True)
    isCompleted = models.BooleanField()

    def __str__(self):
        return self.name
