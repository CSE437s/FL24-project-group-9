"""The scraper script to crawl programs data from WashU website."""

import json
import time
import requests
from bs4 import BeautifulSoup


class ProgramScraper:
    """
    A class to represent a Program Scraper.

    ...

    Attributes
    ----------
    url : str
        the base url to the WashU program page

    Methods
    -------
    export_data(programs_list):
        Export data to json file.
    create_program_list() -> list:
        Return the list of programs from the page.
    """

    def __init__(self, base_url: str):
        """Initialize attributes of class."""
        self.url = base_url

    def export_data(self, programs_list: list):
        """Export data to json file."""
        with open(
            "./programs_data.json",
            "w+",
            encoding="utf-8",
        ) as output_file:
            output_file.write(json.dumps(programs_list, indent=4))
            print(f"{len(programs_list)} programs exported to file")

    def create_programs_list(self) -> list:
        """Return the list of programs from the page."""
        print("Creating programs list...")
        page = requests.get(self.url)
        time.sleep(2)  # Wait for the page to load

        soup = BeautifulSoup(page.text, "html.parser")
        program_list = []

        program_section = soup.find_all("div", class_="post-item")

        program_map = {
            "bachelor-of-science-in-business-administration": "Bachelor of Science in Business Administration",
            "minor": "Minor",
            "bachelor-of-arts": "Bachelor of Arts",
            "bachelor-of-fine-arts": "Bachelor of Fine Arts",
            "bachelor-of-science": "Bachelor of Science",
        }

        for program in program_section:
            program_name_tag = program.find("h3")
            program_name = program_name_tag.text.strip() if program_name_tag else None

            program_url_tag = program_name_tag.find("a") if program_name_tag else None
            program_url = program_url_tag["href"] if program_url_tag else None

            school_div = program.find("div", class_="school-list")
            schools = (
                [school.text.strip() for school in school_div.find_all("a")]
                if school_div
                else None
            )

            program_types_div = program.find("div", class_="program-types")
            program_types_spans = (
                program_types_div.find_all("span") if program_types_div else None
            )
            program_types = []
            for span_tag in program_types_spans:
                class_name = span_tag["class"]
                for key in program_map.keys():
                    if key in class_name:
                        program_types.append(program_map[key])

            program_data = {
                "program": program_name,
                "schools": schools,
                "type": program_types,
                "url": program_url,
            }

            program_list.append(program_data)

            # print(program_data)

        return program_list


URL = "https://admissions.wustl.edu/academics/majors-and-programs/"

scraper = ProgramScraper(URL)
data_list = scraper.create_programs_list()
scraper.export_data(data_list)
