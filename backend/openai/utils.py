import numpy as np
from prompt import get_system_role, get_user_role

from api.models import Course, Student
from openai import OpenAI


class OpenAIUltils:
    def __init__(self):
        self.courses = Course.objects.all()
        self.client = OpenAI()

    def cosine_similarity(self, embedding1, embedding2):
        embedding1 = np.array(embedding1)
        embedding2 = np.array(embedding2)
        return np.dot(embedding1, embedding2) / (
            np.linalg.norm(embedding1) * np.linalg.norm(embedding2)
        )

    def generate_course_embedding(self, course_text):
        response = self.client.embeddings.create(
            course_text, model="text-embedding-3-large"
        )
        return response.data[0].embedding

    def generate_student_embedding(self, student_profile_text):
        response = self.client.embeddings.create(
            student_profile_text, model="text-embedding-3-small"
        )

        return response.data[0].embedding

    def filter_courses_by_similarity(self, student_embedding):
        # Retrieve course embeddings and find those with the highest similarity
        relevant_courses = []
        for course in self.courses:
            similarity = self.cosine_similarity(student_embedding, course.embedding)
            if similarity > 0.8:  # Define a threshold for relevance
                relevant_courses.append(course)
        return relevant_courses

    def generate_course_plan(self, semesters, student_profile_text, relevant_courses):
        completion = self.client.chat.completions.create(
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

        return completion.choices[0].message
