from http import HTTPStatus

from django.core.cache import cache
from django.http import JsonResponse
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from api.models import Course, Department, Program, Review, Semester, Student


class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.user = Student.objects.create_user(
            username="test@wustl.edu",
            email="test@wustl.edu",
            password="testpassword123",
            grad=2025,
        )
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(self.token)}")

        # Create test semesters
        self.semester1 = Semester.objects.create(
            student=self.user, name="Fall 2023", isCompleted=False
        )
        self.semester2 = Semester.objects.create(
            student=self.user, name="Spring 2024", isCompleted=False
        )

        # Create test courses
        self.course1 = Course.objects.create(
            title="Course 1", description="Description 1", units=3, code="CSE 123"
        )
        self.course2 = Course.objects.create(
            title="Course 2", description="Description 2", units=4, code="CSE 124"
        )


class RedisConnectionTest(APITestCase):
    def test_redis_connection(self):
        try:
            cache.set("test_key", "test_value", timeout=10)
            value = cache.get("test_key")
            self.assertEqual(value, "test_value")
        except Exception as e:
            self.fail(f"Redis connection failed: {str(e)}")


class StudentViewSetTest(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        # Define the URL for student endpoints
        self.url_list = reverse("student-list")
        self.url_detail = reverse("student-detail", kwargs={"pk": self.user.pk})

    def test_list_authenticated_student_info(self):
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data["username"], self.user.username)

    def test_retrieve_authenticated_student_info(self):
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data["username"], self.user.username)

    def test_update_student_info_with_invalid_data(self):
        updated_data = {"grad": "not_a_number"}  # Invalid data
        response = self.client.put(self.url_detail, updated_data)
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)

    def test_delete_student(self):
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)
        self.assertFalse(Student.objects.filter(pk=self.user.pk).exists())

    def test_delete_student_without_authentication(self):
        self.client.credentials()  # Clear the token
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)


class CourseViewSetTest(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        # Define the URLs
        self.url_list = reverse("course-list")
        self.url_detail1 = reverse("course-detail", kwargs={"pk": self.course1.pk})
        self.url_detail2 = reverse("course-detail", kwargs={"pk": self.course2.pk})

    def test_list_courses(self):
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(len(response.data), 2)

    def test_get_course_detail(self):
        response = self.client.get(self.url_detail1)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data["title"], self.course1.title)
        self.assertEqual(response.data["description"], self.course1.description)

    def test_get_course_detail_not_found(self):
        response = self.client.get(reverse("course-detail", kwargs={"pk": 999}))
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_list_course_unauthenticated(self):
        self.client.credentials()  # Clear the token
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_get_course_detail_unauthenticated(self):
        self.client.credentials()  # Clear the token
        response = self.client.get(self.url_detail1)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)


class DepartmentViewSetTest(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        # Create a test department
        self.department1 = Department.objects.create(name="Computer Science")
        self.department2 = Department.objects.create(name="Mathematics")

        # Define URLs
        self.url_list = reverse("department-list")
        self.url_detail = reverse(
            "department-detail", kwargs={"pk": self.department1.pk}
        )

    def test_list_all_departments(self):
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(len(response.data), 2)

    def test_get_department_detail(self):
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data["name"], self.department1.name)

    def test_get_department_detail_not_found(self):
        response = self.client.get(
            reverse("department-detail", kwargs={"pk": 999})
        )  # Non-existent ID
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_list_departments_unauthenticated(self):
        self.client.credentials()  # Clear the token
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_get_department_detail_unauthenticated(self):
        self.client.credentials()  # Clear the token
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)


class ProgramViewSetTest(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        # Create test programs
        self.program1 = Program.objects.create(name="Accounting")
        self.program2 = Program.objects.create(name="Data Science")

        # Define URLs
        self.url_list = reverse("program-list")
        self.url_detail = reverse("program-detail", kwargs={"pk": self.program1.pk})

    def test_list_all_programs(self):
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(len(response.data), 2)

    def test_get_program_detail(self):
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data["name"], self.program1.name)

    def test_get_program_detail_not_found(self):
        response = self.client.get(reverse("program-detail", kwargs={"pk": 999}))
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_list_programs_unauthenticated(self):
        self.client.credentials()  # Clear the token
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_get_program_detail_unauthenticated(self):
        self.client.credentials()  # Clear the token
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)


class SemesterViewSetTests(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        # URL for listing semesters
        self.url_list = reverse("semester-list")
        self.url_update = reverse("semester-detail", kwargs={"pk": self.semester1.pk})

    def test_list_semesters(self):
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["name"], "Fall 2023")  # Check sorted

    def test_add_course_to_semester(self):
        updated_data = {"planned_courses": [self.course1.pk, self.course2.pk]}
        response = self.client.put(self.url_update, updated_data)

        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.semester1.refresh_from_db()
        self.assertIn(self.course1, self.semester1.planned_courses.all())
        self.assertIn(self.course2, self.semester1.planned_courses.all())

    def test_remove_course_from_semester(self):
        updated_data = {
            "planned_courses": [self.course1.pk],  # Only keep course1
        }
        response = self.client.put(self.url_update, updated_data)
        self.assertEqual(response.status_code, HTTPStatus.OK)

        self.semester1.refresh_from_db()
        self.assertIn(self.course1, self.semester1.planned_courses.all())
        self.assertNotIn(self.course2, self.semester1.planned_courses.all())

    def test_update_semester_with_invalid_course(self):
        updated_data = {
            "planned_courses": [999],  # Non-existent course
        }
        response = self.client.put(self.url_update, updated_data)
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)

    def test_update_semester_not_found(self):
        response = self.client.put(reverse("semester-detail", kwargs={"pk": 999}))
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_update_semester_invalid_data(self):
        url_update = reverse("semester-detail", kwargs={"pk": self.semester1.pk})
        updated_data = {"name": "Fall 2026"}
        response = self.client.put(url_update, updated_data)

        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data["name"], self.semester1.name)  # No change


class ReviewViewSet(BaseAPITestCase):
    def setUp(self):
        super().setUp()

        self.review = Review.objects.create(
            student=self.user, course=self.course1, rating=5, comments="Great course!"
        )

        self.url_list = reverse("review-list")
        self.url_detail = reverse("review-detail", kwargs={"pk": self.review.pk})

    def test_list_reviews(self):
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["comments"], self.review.comments)

    def test_retrieve_review(self):
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data["comments"], self.review.comments)

    def test_create_review(self):
        data = {
            "course": self.course1.id,
            "rating": 4,
            "comments": "Very informative but quite challenging.",
        }
        response = self.client.post(self.url_list, data, format="json")
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(Review.objects.count(), 2)
        self.assertEqual(response.data["comments"], data["comments"])

    def test_update_review(self):
        data = {
            "course": self.course1.id,
            "rating": 3,
            "comments": "Updated review: Good course but needs improvement.",
        }
        response = self.client.put(self.url_detail, data, format="json")
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.review.refresh_from_db()
        self.assertEqual(self.review.rating, data["rating"])
        self.assertEqual(self.review.comments, data["comments"])

    def test_delete_review(self):
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code, HTTPStatus.NO_CONTENT)
        self.assertEqual(Review.objects.count(), 0)
