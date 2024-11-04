import json
import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()
from dotenv import load_dotenv
from utils import OpenAIUltils

load_dotenv()
# sample_student_embed = OpenAIUltils.generate_student_embedding(
#     "AI, Machine Learning Software Engineer"
# )

# with open(
#     "openai_integration/sample_student_embeddings.json",
#     "w+",
#     encoding="utf-8",
# ) as output_file:
#     output_file.write(json.dumps(sample_student_embed, indent=4))
#     print(f"exported to file")

sample_student_embed = None
with open("openai_integration/sample_student_embeddings.json", "r") as file:
    sample_student_embed = json.load(file)

relevant_courses = OpenAIUltils.filter_courses_by_similarity(sample_student_embed)
# print(relevant_courses)

student_text = "AI, Machine Learning;Software Engineer"
semesters = "Fall 2026, Spring 2027, Fall 2027, Spring 2028, Fall 2028, Spring 2029, Fall 2029, Spring 2030"
required_courses = "CSE 131, CSE 132, CSE 240 or MATH 310, CSE 247, CSE 332S, CSE 347, CSE 361S, Math 131, Math 132, Math 233, Math 309, ESE 326, CWP 100"
response = OpenAIUltils.generate_course_plan(
    required_courses, semesters, student_text, relevant_courses
)

# Write the extracted text to the file
with open("openai_integration/sample_generated_schedule.json", "w") as file:
    file.write(response)
