import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

import numpy as np
from openai import OpenAI

from api.models import Course
from openai_integration.prompt import get_system_role, get_user_role


class OpenAIUltils:
    THRESHOLD = 0.3
    COURSES = Course.objects.all()
    CLIENT = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "mock_api_key"))

    @staticmethod
    def cosine_similarity(embedding1, embedding2):
        embedding1 = np.array(embedding1)
        embedding2 = np.array(embedding2)

        if np.linalg.norm(embedding1) == 0 or np.linalg.norm(embedding2) == 0:
            return 0.0

        return np.dot(embedding1, embedding2) / (
            np.linalg.norm(embedding1) * np.linalg.norm(embedding2)
        )

    @staticmethod
    def generate_course_embedding(course_text):
        response = OpenAIUltils.CLIENT.embeddings.create(
            input=course_text, model="text-embedding-3-large"
        )
        return response.data[0].embedding

    @staticmethod
    def generate_student_embedding(student_profile_text):
        response = OpenAIUltils.CLIENT.embeddings.create(
            input=student_profile_text, model="text-embedding-3-large"
        )

        return response.data[0].embedding

    @staticmethod
    def filter_courses_by_similarity(student_embedding):
        # Retrieve course embeddings and find those with the highest similarity
        relevant_courses = set()
        for course in OpenAIUltils.COURSES:
            similarity = OpenAIUltils.cosine_similarity(
                student_embedding, course.embedding
            )
            if similarity >= OpenAIUltils.THRESHOLD:  # Define a threshold for relevance
                relevant_courses.add(course.code)
        return list(relevant_courses)

    @staticmethod
    def generate_course_plan(semesters, student_profile_text, relevant_courses):
        completion = OpenAIUltils.CLIENT.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": get_system_role(),
                },
                {
                    "role": "user",
                    "content": get_user_role(
                        semesters, student_profile_text, relevant_courses
                    ),
                },
            ],
        )
        response = completion.choices[0].message
        if hasattr(response, "content"):
            return response.content
        return str(response)
