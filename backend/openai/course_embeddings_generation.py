import json

from dotenv import load_dotenv
from utils import OpenAIUltils

from api.models import Course

load_dotenv()

openai_utils = OpenAIUltils()

embeddings = []

courses = Course.objects.all()
for course in courses:
    embed = openai_utils.generate_course_embedding(course.title)
    embeddings.append(embed)


with open(
    "./course_embeddings_data.json",
    "w+",
    encoding="utf-8",
) as output_file:
    output_file.write(json.dumps(embeddings, indent=4))
    print(f"{len(embeddings)} course embeddings exported to file")
