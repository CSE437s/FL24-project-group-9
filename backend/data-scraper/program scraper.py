"""The scraper script to crawl courses data from WashU website."""

import json
import time
import requests
from bs4 import BeautifulSoup

class CourseScraper:
    """
    A class to represent a Course Scraper.

    ...

    Attributes
    ----------
    url : str
        the base url to the WashU courses page

    Methods
    -------
    export_data(courses_list):
        Export data to json file.
    create_courses_list() -> list:
        Return the list of courses from the page.
    """

    def __init__(self, base_url: str):
        """Initialize attributes of class."""
        self.url = base_url

    def export_data(self, programs_list: list):
        """Export data to json file."""
        with open(
            "C:/Users/sameg/OneDrive/Documents/GitHub/FL24-project-group-9/backend/data-scraper/washu_program_data.json",
            "w+",
            encoding="utf-8",
        ) as output_file:
            output_file.write(json.dumps(programs_list, indent=4))
            print(f"{len(programs_list)} courses exported to file")

    def create_programs_list(self) -> list:

        """Return the list of majors and minors from the page."""
        print("Creating majors and minors list...")
        # self.driver.get(self.url)
        page = requests.get(self.url)

        soup = BeautifulSoup(page.text, "html.parser")
        programs_list = []

        # Find the program listings in the HTML structure
        programs_div = soup.find_all("div", class_="post-item")
        for program in programs_div:
            program_info = {}
            program_title = program.find("h3").find("a")
            print(program_title)
            program_school = program.find("a", class_="school")
            program_type = []
            if program.find("span", class_="program-type-item minor"):
                program_type.append("Minor")
            if program.find("span", class_="program-type-item bachelor-of-arts"):
                program_type.append("Bachelor of Arts")
            if program.find("span", class_="program-type-item bachelor-of-science-in-business-administration"):
                program_type.append("Bachelor of Science in Business Administration")
            if program.find("span", class_="program-type-item bachelor-of-science"):
                program_type.append("Bachelor of Science")
            if program.find("span", class_="program-type-item bachelor-of-fine-arts"):
                program_type.append("Bachelor of Fine Arts")
            if program_title:
                program_info["title"] = program_title.text.strip()#.replace("\u00a0", " ")
            if program_school:
                program_info["school"] = program_school.text.strip()#.replace("\u00a0", " ")
            if program_type:
                program_info["type"] = program_type    
                
            programs_list.append(program_info)    
        return programs_list


URL = "https://admissions.wustl.edu/academics/majors-and-programs/"

scraper = CourseScraper(URL)
programs_data_list = scraper.create_programs_list()
scraper.export_data(programs_data_list)
