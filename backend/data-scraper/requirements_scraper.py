"""The scraper script to crawl Computer Science major requirements from WashU website."""

import json
import time

import requests
from bs4 import BeautifulSoup


class RequirementsScraper:
    """
    A class to represent a Requirements Scraper.

    ...

    Attributes
    ----------
    url : str
        the base url to the WashU Computer Science major requirements page

    Methods
    -------
    export_data(requirements_list):
        Export data to json file.
    create_requirements_list() -> list:
        Return the list of major requirements from the page.
    """

    def __init__(self, base_url: str):
        """Initialize attributes of class."""
        self.url = base_url

    def export_data(self, courses_list: list):
        """Export data to json file."""
        with open(
            "./washu_cs_major_requirements.json",
            "w+",
            encoding="utf-8",
        ) as output_file:
            output_file.write(json.dumps(courses_list, indent=4))
            print(f"{len(courses_list)} requirements exported to file")

    def create_requirements_list(self) -> list:
        """Return the list of major requirements from the page."""
        print("Creating Computer Science major requirements list...")
        page = requests.get(self.url)
        time.sleep(2)

        soup = BeautifulSoup(page.text, "html.parser")
        requirements_list = []

        div_col = soup.find("div", class_="col")

        # Extract all text inside the div, including text from nested tags
        all_text = div_col.get_text(separator=" ", strip=True)

        print(all_text)

        return requirements_list


URL = "https://cse.washu.edu/academics/undergraduate/BS-Computer-Science.html"

scraper = RequirementsScraper(URL)
requirements_list = scraper.create_requirements_list()
# scraper.export_data(requirements_list)
