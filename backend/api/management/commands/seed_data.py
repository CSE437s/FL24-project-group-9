import json

from django.core.management.base import BaseCommand

from api.models import Course, Department, DepCourse, Program, Review, Semester, Student


class Command(BaseCommand):
    help = "Seed data from JSON file into the database"

    def handle(self, *args, **kwargs):
        self.clear_data()
        self.seed_data()

    def clear_data(self):
        """Deletes all the table data"""
        Course.objects.all().delete()
        Department.objects.all().delete()
        DepCourse.objects.all().delete()
        Program.objects.all().delete()
        Student.objects.all().delete()
        Semester.objects.all().delete()
        Review.objects.all().delete()
        self.stdout.write(
            self.style.SUCCESS(
                "Deleted Course, Department, DepCourse, Program, Student, Semester, Review successfully."
            )
        )

    def seed_data(self):
        """Seed data into the database"""
        self.stdout.write(self.style.SUCCESS("Seeding data into the database"))
        # Seed Department Data
        department_path = "data-scraper/departments_data.json"
        with open(department_path, "r") as file:
            data = json.load(file)

        for item in data:
            Department.objects.create(
                name=item.get("department"),
                url=item.get("url"),
            )
        self.stdout.write(
            self.style.SUCCESS("Department Database seeded successfully.")
        )

        # Seed Course Data and DepCourse Data (Only CS for now)
        course_path = "data-scraper/courses_data.json"
        embedding_path = "openai_integration/course_embeddings_data.json"
        with open(course_path, "r") as file:
            data = json.load(file)

        with open(embedding_path, "r") as file:
            embed_data = json.load(file)

        embedding_idx = 0
        for item in data:
            created_course = Course.objects.create(
                title=item.get("title"),
                code=item.get("code"),
                description=item.get("description"),
                units=item.get("units"),
                url=item.get("url"),
                prerequisites=item.get("prerequisites"),
                embedding=embed_data[embedding_idx],
            )
            embedding_idx += 1

            DepCourse.objects.create(
                course=created_course,
                department=Department.objects.get(
                    name="Computer Science & Engineering"
                ),
            )

        course_path = "data-scraper/fixed_courses_data.json"
        with open(course_path, "r") as file:
            data = json.load(file)

        for item in data:
            Course.objects.create(
                title=item.get("title"),
                code=item.get("code"),
                description=item.get("description"),
                units=item.get("units"),
                url=item.get("url"),
                prerequisites=item.get("prerequisites"),
                embedding=embed_data[embedding_idx],
            )
            embedding_idx += 1
        self.stdout.write(self.style.SUCCESS("Course Database seeded successfully."))

        # Seed Program Data
        program_path = "data-scraper/programs_data.json"
        with open(program_path, "r") as file:
            data = json.load(file)

        for item in data:
            Program.objects.create(
                name=item.get("program"),
                schools=item.get("schools"),
                types=item.get("type"),
                url=item.get("url"),
            )
        self.stdout.write(self.style.SUCCESS("Program Database seeded successfully."))

        # Seed Student Data
        student = Student.objects.create(
            first_name="John",
            last_name="Doe",
            email="john.doe@wustl.edu",
            grad=2024,
            career="Software Engineer",
            required_units=120,
            interests="Machine Learning, AI",
        )
        student.set_password("12345678")
        student.programs.set(Program.objects.filter(name__in=["Computer Science"]))
        student.save()
        self.stdout.write(self.style.SUCCESS("Student Database seeded successfully."))

        # Seed Superuser Data
        superuser = Student(
            email="dbadmin@wustl.edu",
            first_name="Admin",
            last_name="User",
            username="dbadmin@wustl.edu",
        )
        superuser.set_password("admin")
        superuser.is_superuser = True
        superuser.is_staff = True
        superuser.save()
        self.stdout.write(self.style.SUCCESS(f"superuser is seeded successfully."))

        # Seed Semester Data
        semester_path = "data-scraper/sample_semester.json"
        with open(semester_path, "r") as file:
            data = json.load(file)

        for item in data:
            created_semester = Semester.objects.create(
                student=Student.objects.get(first_name="John"),
                name=item.get("name"),
                isCompleted=item.get("isCompleted"),
            )
            created_semester.planned_courses.set(
                Course.objects.filter(title__in=item.get("planned_courses"))
            )

        self.stdout.write(self.style.SUCCESS("Semester Database seeded successfully."))

        # Seed Review Data
        review = {"rating": 4, "comments": "Very informative but quite challenging."}

        for course in Course.objects.all():
            Review.objects.create(
                course=course,
                student=student,
                rating=review["rating"],
                comments=review["comments"],
            )

        self.stdout.write(self.style.SUCCESS("Review Database seeded successfully."))
