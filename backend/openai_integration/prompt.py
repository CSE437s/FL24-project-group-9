def get_system_role(required_courses):
    prompt = f"""
    You are tasked with creating a personalized 4-year course plan for a Computer Science major based on the student's interests and desired professional career. The interests and career goals will be provided as text, separated by a semicolon.

    You will be given a list of relevant course titles and a set of semesters to schedule.

    The required courses for the Computer Science major include: {required_courses}, and at least one course whose code ends with the letters S, A, or T from the relevant course list (e.g., CSE 361S, CSE 361A, CSE 361T).

    When scheduling the courses, prioritize placing courses with smaller course code numbers in the earlier semesters (e.g., CSE 131 and CSE 132 should be scheduled in the first or second semester). Larger course code numbers should be scheduled in the later semesters to maintain a logical progression of coursework.

    Using this information, create a structured 4-year course plan that ensures all required courses are included and aligns with the student's interests and career goals. Each semester should contain at least 5 courses.

    Format the output as a JSON object using the following example structure:

    "Fall 2020": ["CSE 131", "CSE 132", "Math 131", "CWP 100", "ESE 326"],
    "Spring 2021": ["CSE 240", "CSE 247", "Math 132", "ESE 326", "CSE 332S"],
    "Fall 2021": ["CSE 347", "Math 233", "Math 309", "CSE 361S", "E81 CSE 511A"],
    "Spring 2022": ["CSE 361A", "CSE 361T", "CSE 332S", "CSE 347", "ESE 326"],
    ...

    Schedule courses with smaller course code numbers in earlier semesters and larger numbers in later semesters, ensuring a logical distribution. Return ONLY the JSON object without enclosing code blocks.
    """

    return prompt


def get_user_role(semesters, student_profile_text, relevant_courses):
    return f"Generate a 4-year course plan for {semesters} with the following interests and career goal: {student_profile_text} from a list of relevant courses: {relevant_courses}."
