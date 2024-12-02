import re


def extract_course_code(title):
    return title[:12].strip()


def extract_course_title(title):
    return title[12:].strip()


def extract_units(credits):
    match = re.search(r"(\d+)", credits)
    if match:
        return int(match.group(1))
    return 0


def extract_prerequisites(description):
    extracted = description.rsplit("Prerequisite", 1)
    return extracted[1][1:].strip(":").strip().strip(".") if len(extracted) == 2 else ""
    
def extract_attribs(attributes):
    return attributes.strip()
    
def extract_department(department):
    return department.strip()

def extract_description(description):
    extracted = description.rsplit("Prerequisite", 1)
    return extracted[0].strip() if len(extracted) == 2 else description.strip()


def transform_data(course):
    transformed_course = {
        "title": extract_course_title(course.get("title", "")),
        "code": extract_course_code(course.get("title", "")),
        "description": extract_description(course.get("description", "")),
        "units": extract_units(course.get("credits", "")),
        "url": course.get("link", ""),
        "prerequisites": extract_prerequisites(course.get("description", "")),
        "attributes": course.get("attributes", ""),
        "department": course.get("department", ""),
    }
   
    return transformed_course
