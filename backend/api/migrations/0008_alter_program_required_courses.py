# Generated by Django 5.1.1 on 2024-10-10 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0007_alter_program_required_courses"),
    ]

    operations = [
        migrations.AlterField(
            model_name="program",
            name="required_courses",
            field=models.ManyToManyField(blank=True, null=True, to="api.course"),
        ),
    ]