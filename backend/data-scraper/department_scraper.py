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

    def __init__(self, base_urls: list):
        """Initialize attributes of class."""
        self.url_list = base_urls

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
        department_list = []
        for url in self.url_list:
            
            page = requests.get(url)
            time.sleep(2)  # Wait for the page to load

            soup = BeautifulSoup(page.text, "html.parser")
        
        

            department_title = soup.find("h1", class_="page-title")
            dept = department_title.text.strip()
            
            department_url = url.replace("#courses", "")
            print(department_url)
            department_data = {"department": dept, "url": department_url}# "tag": dept_tag}

            department_list.append(department_data)

        return department_list


page_links = [
    "https://bulletin.wustl.edu/undergrad/engineering/computerscience/#courses",
    "https://bulletin.wustl.edu/undergrad/engineering/energy-environmental-chemical/#courses",
    "https://bulletin.wustl.edu/undergrad/engineering/biomedical/#courses",
    "https://bulletin.wustl.edu/undergrad/engineering/electrical-and-systems/#courses",
    "https://bulletin.wustl.edu/undergrad/engineering/umsl-wustl-joint-program/#courses",
    "https://bulletin.wustl.edu/undergrad/architecture/#courses",
    "https://bulletin.wustl.edu/undergrad/art/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/africanandafricanamericanstudies/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/americanculturestudies/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/classics/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/anthropology/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/appliedlinguistics/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/mathematics/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/economics/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/jimes/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/arthistoryandarchaeology/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/americanculturestudies/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/physics/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/biology/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/chemistry/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/english/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/eastasianlanguagesandcultures/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/psychologicalandbrainsciences/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/comparativeliteratureandthought/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/performingarts/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/statisticsanddatascience/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/eeps/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/education/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/environmentalstudies/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/politicalscience/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/filmandmediastudies/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/romancelanguagesandliteratures/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/globalstudies/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/history/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/music/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/latinamericanstudies/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/linguistics/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/philosophy/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/philosophyneurosciencepsychology/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/publichealthandsociety/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/religionandpolitics/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/religiousstudies/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/russianlanguageandliterature/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/sociology/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/speechandhearing/#courses",
    "https://bulletin.wustl.edu/undergrad/artsci/womengenderandsexualitystudies/#courses",
    "https://bulletin.wustl.edu/undergrad/business/#courses",
    "https://bulletin.wustl.edu/undergrad/beyondboundaries/#courses",
    ]

scraper = DepartmentScraper(page_links)
data_list = scraper.create_department_list()
scraper.export_data(data_list)
