import json
import pandas as pd

def export_data(courses_list: list):
    """Export data to json file."""
    with open(
        "C:/Users/sameg/OneDrive/Documents/GitHub/FL24-project-group-9/backend/data-scraper/washu_courses_data_fixed.json",
        "w+",
        encoding="utf-8",
        ) as output_file:
        output_file.write(json.dumps(courses_list, indent=4))
        print(f"{len(courses_list)} courses exported to file")

df = pd.read_json("C:/Users/sameg/OneDrive/Documents/GitHub/FL24-project-group-9/backend/data-scraper/washu_courses_data.json")

courses_list = []
def create_courses_list():
    for x in range(len(df)):
        course_info = {}
        concat_title = df['title'][x].split(' ', 4)
        concat_units = df['credits'][x].split(' ', 3)
        dept_code = concat_title[0]
        course_code = concat_title[1] + " " + concat_title[2]
        course_name = concat_title[3]
        course_url = df['link'][x]
        if df['credits'][x].split(' ', 3)[1]
        course_units = df['credits'][x].split(' ', 3)[1]
        course_description = df['description'][x]
        
        course_info["course_code"] = course_code
        course_info["course_name"] = course_name
        course_info["dept_code"] = dept_code
        course_info["units"] = course_units
        course_info["url"] = course_url
        course_info["description"] = course_description
        
        courses_list.append(course_info)


create_courses_list()
export_data(courses_list)