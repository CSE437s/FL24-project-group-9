from django.urls import path
from . import views

urlpatterns = [
    path("students/", views.getStudents),
    path("add-student/", views.addStudent),
]