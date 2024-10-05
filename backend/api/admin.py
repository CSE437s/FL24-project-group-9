from django.contrib import admin
from .models import Department, Course, DepCourse, Major, Minor, Semester, Student
from django.contrib.auth.models import Group

admin.site.register(Department)
admin.site.register(Course)
admin.site.register(DepCourse)
admin.site.register(Major)
admin.site.register(Minor)
admin.site.register(Semester)
admin.site.register(Student)

admin.site.unregister(Group)

admin.site.site_header = "Courses Scheduler Review Admin"
