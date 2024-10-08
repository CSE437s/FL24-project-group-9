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

    def export_data(self, courses_list: list):
        """Export data to json file."""
        with open(
            "./courses_data.json",
            "w+",
            encoding="utf-8",
        ) as output_file:
            output_file.write(json.dumps(courses_list, indent=4))
            print(f"{len(courses_list)} courses exported to file")

    def create_courses_list(self) -> list:
        """Return the list of courses from the page."""
        print("Creating courses list...")
        page = requests.get(self.url)
        time.sleep(2)  # Wait for the page to load

        soup = BeautifulSoup(page.text, "html.parser")
        courses_list = []

        # Find the course listings in the HTML structure
        courses_div = soup.find_all("div", class_="courseblock")
        for course in courses_div:
            course_info = {}
            course_title = course.find("p", class_="courseblocktitle").find("strong")
            course_description = course.find("p", class_="courseblockdesc")
            course_credits = course.find("p", class_="noindent")
            course_link = None
            link_tag = course.find("a", string="View Sections")
            if link_tag:
                course_link = link_tag["href"]

            if course_title:
                course_info["title"] = course_title.text.strip().replace("\u00a0", " ")
            if course_description:
                course_info["description"] = course_description.text.strip().replace(
                    "\u00a0", " "
                )
            if course_link:
                course_info["link"] = course_link.strip().replace("\u00a0", " ")
            if course_credits:
                course_info["credits"] = course_credits.text.strip().replace(
                    "\u00a0", " "
                )

            courses_list.append(course_info)

        return courses_list


URL = "https://bulletin.wustl.edu/undergrad/engineering/computerscience/#courses"

scraper = CourseScraper(URL)
data_list = scraper.create_courses_list()
scraper.export_data(data_list)
