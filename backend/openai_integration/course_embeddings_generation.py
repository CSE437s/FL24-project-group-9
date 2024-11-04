import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

import json

from dotenv import load_dotenv
from utils import OpenAIUltils

from api.models import Course

load_dotenv()

embeddings = []

courses = Course.objects.all()
for course in courses:
    course_text = course.title + " " + course.description
    embed = OpenAIUltils.generate_course_embedding(course_text)
    embeddings.append(embed)

with open(
    "openai_integration/course_embeddings_data.json",
    "w+",
    encoding="utf-8",
) as output_file:
    output_file.write(json.dumps(embeddings, indent=4))
    print(f"{len(embeddings)} course embeddings exported to file")
