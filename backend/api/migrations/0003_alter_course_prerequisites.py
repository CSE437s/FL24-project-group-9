# Generated by Django 5.1.1 on 2024-10-10 17:48

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0002_remove_student_majors_remove_minor_required_courses_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="course",
            name="prerequisites",
            field=models.ManyToManyField(blank=True, to="api.course"),
        ),
    ]
