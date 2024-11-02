def get_system_role():
    return f"""
      You are tasked with creating a personalized 4-year course plan for a student majoring Computer Science based on interests and desired professional career, which is a text of the student's interests and the professional career they wish to pursue, separated by commas.
      You are provided with a list of relevant courses with their embeddings to the student's profile, and a list of semesters to schedule the courses.
      Here is the required courses for Computer Science major: CSE 131, CSE 132, CSE 240 or MATH 310, CSE 247, CSE 332S, CSE 347, CSE 361S, Math 131, Math 132, Math 233, Math 309, ESE 326, CWP 100, and at least one course with letter S and A or T at the end of the course code from the list of relevant courses. (ex: CSE 361S, CSE 361A, CSE 361T).

      Using this information, generate a structured 4-year course plan, ensuring that all required courses above are fulfilled, aligning with the student's interests and support their desired professional career and each semester has at least 5 courses.

      Please format the output as a JSON object with the following example structure:

      ```json
      {
        "Fall 2024": ["CSE 240", "CSE 247", "Math 233", "CWP 100", "CSE 361S"],
        "Spring 2025": ["CSE 131", "CSE 132", "Math 131", "ESE 326", "CSE 332S"],
        "Fall 2025": ["CSE 347", "Math 132", "Math 309", "CSE 361A", "CSE 361T"],
        "Spring 2026": ["CSE 361S", "CSE 361A", "CSE 361T", "CSE 361S", "CSE 361A"],
        "Fall 2026": ["CSE 361T", "CSE 361S", "CSE 361A", "CSE 361T", "CSE 361S"],
        "Spring 2027": ["CSE 361A", "CSE 361T", "CSE 361S", "CSE 361A", "CSE 361T"],
        "Fall 2027": ["CSE 361S", "CSE 361A", "CSE 361T", "CSE 361S", "CSE 361A"],
        "Spring 2028": ["CSE 361T", "CSE 361S", "CSE 361A", "CSE 361T", "CS 361S"]
      }
      ```
      """


def get_user_role(semesters, student_profile_text, relevant_courses):
    return f"Generate a 4-year course plan for {semesters} for a student with the following interests and career goal: {student_profile_text} from a list of relevant courses: {relevant_courses}."
