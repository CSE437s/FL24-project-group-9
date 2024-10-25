from django.contrib import admin
from django.contrib.auth.models import Group

from .models import Course, Department, DepCourse, Program, Semester, Student

admin.site.register(Department)
admin.site.register(Course)
admin.site.register(DepCourse)
admin.site.register(Program)
admin.site.register(Semester)
admin.site.register(Student)

admin.site.unregister(Group)

admin.site.site_header = "Courses Scheduler Review"
