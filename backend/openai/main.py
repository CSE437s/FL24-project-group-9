from dotenv import load_dotenv
from utils import OpenAIUltils

load_dotenv()

openai_utils = OpenAIUltils()

openai_utils.generate_course_embedding("Introduction to Python")
