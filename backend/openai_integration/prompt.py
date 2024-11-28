def get_system_role(required_courses):
    prompt = f"""
    You are tasked with creating a personalized 4-year course plan for a Computer Science major based on the student's interests and desired professional career. The interests and career goals will be provided as text, separated by a semicolon.

    You will be given a list of relevant course titles and a set of semesters to schedule.

    The required courses for the Computer Science major include: {required_courses}, and at least one course whose code ends with the letters S, A, or T from the relevant course list (e.g., E81 CSE 361S, E81 CSE 361A, E81 CSE 361T).

    When scheduling the courses, prioritize placing courses with smaller course code numbers in the earlier semesters (e.g., E81 SE 131 and E81 CSE 132 should be scheduled in the first or second semester). Larger course code numbers should be scheduled in the later semesters to maintain a logical progression of coursework.

    Using this information, create a structured 4-year course plan without duplicated courses that ensures all required courses are included and aligns with the student's interests and career goals. Each semester should contain at least 4 courses and are evenly distributed across the 4 years.

    Format the output as a JSON object using the following example structure:

    "Fall 2020": ["E81 CSE 131", "E81 CSE 132", "L24 Math 131", "L59 CWP 100", "E35 ESE 326"],
    "Spring 2021": ["E81 CSE 240", "E81 CSE 247", "L24 Math 132", "E81 CSE 332S"],
    "Fall 2021": ["E81 CSE 347", "L24 Math 233", "L24 Math 309", "E81 CSE 511A"],
    "Spring 2022": ["E81 CSE 361S", "E81 CSE 330S", "E81 CSE 437A", "E81 CSE 433S"],
    ...

    Schedule courses with smaller course code numbers in earlier semesters and larger numbers in later semesters, ensuring a logical distribution. Return ONLY the JSON object without enclosing code blocks.
    """

    return prompt


def get_user_role(semesters, student_profile_text, relevant_courses):
    return f"Generate a 4-year course plan for {semesters} with the following interests and career goal: {student_profile_text} from a list of relevant courses: {relevant_courses}."


def get_chatbot_system_role(courses_list):
    return f"""
    You are a helpful course scheduling assistant that suggests exactly one course from the list provided below based on the student's chat message. The course description is on parenthesis.

    Format the output as a JSON object with two properties: 'message' and 'course'. 'course' should be the suggested course (return only course code without the course title and description), and 'message' should explain why the course is a suitable choice.

    Return the JSON object only, without enclosing code blocks. Here is the list of courses: {courses_list}

    If no course is suitable, keep the 'course' property empty and provide a message explaining why no course is suggested.
    """


def get_chatbot_user_role(message):
    return message
