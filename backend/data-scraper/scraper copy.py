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
            "./data-scraper/washu_majors_minors_data.json",
            "w+",
            encoding="utf-8",
        ) as output_file:
            output_file.write(json.dumps(programs_list, indent=4))
            print(f"{len(programs_list)} courses exported to file")

    def create_majors_minors_list(self) -> list:
        """Return the list of majors and minors from the page."""
        print("Creating majors and minors list...")
        # self.driver.get(self.url)
        page = requests.get(self.url)
        time.sleep(2)  # Wait for the page to load

        soup = BeautifulSoup(page.text, "html.parser")
        programs_list = []

        # Find the program listings in the HTML structure
        programs_div = soup.find_all("div", class_="post-item")
        for program in programs_div:
            program_title = program.find("h3", class_="").find("strong")
            program_school = program.find("a", class_="school")
            program_type_major = None
            program_type_minor = None
            program_link = None
            major_tag = program.find("span", string="Bachelor")
            if major_tag:
                program_type_major = major_tag
            minor_tag = program.find("span", string="Minor")
            if minor_tag:
                program_type_minor = minor_tag
            
            

            program_list.append(course_info)

        return courses_list


URL = "https://bulletin.wustl.edu/undergrad/engineering/computerscience/#courses"

scraper = CourseScraper(URL)
courses_data_list = scraper.create_courses_list()
scraper.export_data(courses_data_list)
