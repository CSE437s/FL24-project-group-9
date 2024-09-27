# Generated by Django 5.1.1 on 2024-09-27 16:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Department",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=255)),
                ("code", models.CharField(max_length=255, unique=True)),
                ("url", models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name="Course",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("title", models.CharField(max_length=255)),
                ("code", models.CharField(max_length=255, unique=True)),
                ("description", models.TextField()),
                ("units", models.PositiveIntegerField()),
                ("url", models.URLField()),
                (
                    "prerequisites",
                    models.ManyToManyField(
                        blank=True,
                        related_name="prerequisite_for",
                        to="database.course",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Major",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=255)),
                ("code", models.CharField(max_length=255, unique=True)),
                ("required_units", models.PositiveIntegerField()),
                (
                    "required_courses",
                    models.ManyToManyField(blank=True, to="database.course"),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Minor",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=255)),
                ("code", models.CharField(max_length=255, unique=True)),
                ("required_units", models.PositiveIntegerField()),
                (
                    "required_courses",
                    models.ManyToManyField(blank=True, to="database.course"),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Student",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("firstname", models.CharField(max_length=255)),
                ("lastname", models.CharField(max_length=255)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("email", models.EmailField(max_length=254)),
                (
                    "class_year",
                    models.CharField(
                        choices=[
                            ("FR", "Freshman"),
                            ("SO", "Sophomore"),
                            ("JR", "Junior"),
                            ("SR", "Senior"),
                            ("GR", "Graduate"),
                        ],
                        max_length=2,
                    ),
                ),
                ("career", models.CharField(max_length=255)),
                ("required_units", models.IntegerField()),
                ("interests", models.TextField()),
                ("majors", models.ManyToManyField(blank=True, to="database.major")),
                ("minors", models.ManyToManyField(blank=True, to="database.minor")),
            ],
        ),
        migrations.CreateModel(
            name="Semester",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=255)),
                ("isCompleted", models.BooleanField()),
                ("courses", models.ManyToManyField(to="database.course")),
                (
                    "student",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="database.student",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="DepCourse",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="database.course",
                    ),
                ),
                (
                    "department",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="database.department",
                    ),
                ),
            ],
            options={
                "unique_together": {("course", "department")},
            },
        ),
    ]
