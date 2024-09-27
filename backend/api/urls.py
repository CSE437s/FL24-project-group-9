from django.urls import path
from . import views

urlpatterns = [
    path("", views.ApiOverview.as_view(), name="api-overview"),
    path("students/", views.StudentAPI.as_view(), name="student-list-create"),
    path("student/<str:pk>/", views.StudentDetailAPI.as_view(), name="student-detail"),
    path("courses/", views.CourseAPI.as_view(), name="course-list-create"),
    path("course/<str:pk>/", views.CourseDetailAPI.as_view(), name="course-detail"),
    path("departments/", views.DepartmentAPI.as_view(), name="department-list-create"),
    path(
        "department/<str:pk>/",
        views.DepartmentDetailAPI.as_view(),
        name="department-detail",
    ),
    path("majors/", views.MajorAPI.as_view(), name="major-list-create"),
    path("major/<str:pk>/", views.MajorDetailAPI.as_view(), name="major-detail"),
    path("minors/", views.MinorAPI.as_view(), name="minor-list-create"),
    path("minor/<str:pk>/", views.MinorDetailAPI.as_view(), name="minor-detail"),
    path("semesters/", views.SemesterAPI.as_view(), name="semester-list-create"),
    path(
        "semester/<str:pk>/",
        views.SemesterDetailAPI.as_view(),
        name="semester-detail-update",
    ),
]
