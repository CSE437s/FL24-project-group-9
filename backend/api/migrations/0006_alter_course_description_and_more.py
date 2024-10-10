# Generated by Django 5.1.1 on 2024-10-10 17:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0005_alter_student_career_alter_student_interests_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="course",
            name="description",
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name="program",
            name="required_courses",
            field=models.ManyToManyField(blank=True, null=True, to="api.course"),
        ),
        migrations.AlterField(
            model_name="program",
            name="required_units",
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="student",
            name="required_units",
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
