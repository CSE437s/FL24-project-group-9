"""The scraper script to crawl department data from WashU website."""

import json
import time
import requests
from bs4 import BeautifulSoup


class DepartmentScraper:
    """
    A class to represent a Department Scraper.

    ...

    Attributes
    ----------
    url : str
        the base url to the WashU department page

    Methods
    -------
    export_data(programs_list):
        Export data to json file.
    create_department_list() -> list:
        Return the list of departments from the page.
    """

    def __init__(self, base_url: str):
        """Initialize attributes of class."""
        self.url = base_url

    def export_data(self, programs_list: list):
        """Export data to json file."""
        with open(
            "./departments_data.json",
            "w+",
            encoding="utf-8",
        ) as output_file:
            output_file.write(json.dumps(programs_list, indent=4))
            print(f"{len(programs_list)} departments exported to file")

    def create_department_list(self) -> list:
        """Return the list of department from the page."""
        print("Creating departments list...")
        page = requests.get(self.url)
        time.sleep(2)  # Wait for the page to load

        soup = BeautifulSoup(page.text, "html.parser")
        department_list = []

        department_section = soup.find_all("div", class_="wp-block-washu-listing-item")

        for department in department_section:
            department_tag = department.find("a")
            department_name = department_tag.text.strip() if department_tag else None
            department_url = department_tag["href"] if department_tag else None

            department_data = {"department": department_name, "url": department_url}

            department_list.append(department_data)

        return department_list


URL = "https://washu.edu/academics/schools-and-departments/"

scraper = DepartmentScraper(URL)
data_list = scraper.create_department_list()
scraper.export_data(data_list)
