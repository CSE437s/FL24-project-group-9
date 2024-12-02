"""The scraper script to crawl courses data from WashU website."""

import json
import time
import requests
from bs4 import BeautifulSoup
from course_data_transformation import transform_data

class CourseScraper:
    """
    A class to represent a Course Scraper.

    ...

    Attributes
    ----------
    base_urls : list
        the list of URLS containing all WashU bulletin course pages

    Methods
    -------
    export_data(courses_list):
        Export data to json file.
    create_courses_list() -> set:
        Return the list of courses from the page.
    """
    
    def __init__(self, base_urls: list):
        """Initialize attributes of class."""
        self.url_list = base_urls

    def export_data(self, courses_list: list):
        """Export data to json file."""
        with open(
            "./courses_data.json",
            "w+",
            encoding="utf-8",
        ) as output_file:
            output_file.write(json.dumps(courses_list, indent=4))
            print(f"{len(courses_list)} courses exported to file")

    def create_courses_set(self) -> list:
        """Return the list of courses from the page."""
        print("Creating courses list...")

        courses_set = []
        courses_list = []    
        for url in self.url_list:
            print(url)
            page = requests.get(url)
            time.sleep(2)  # Wait for the page to load

            soup = BeautifulSoup(page.text, "html.parser")
           
            #dept = url.split("/", 7)[5]
            department_title = soup.find("h1", class_="page-title")
            dept = department_title.text.strip()
            # Find the course listings in the HTML structure
            courses_div = soup.find_all("div", class_="courseblock")
            for course in courses_div:
                course_info = {}
                course_title = course.find("p", class_="courseblocktitle").find("strong")
                course_description = course.find("p", class_="courseblockdesc")
                course_credits = course.find("p", class_="noindent")
                course_link = None
                link_tag = course.find("a", string="View Sections")
                course_attrib = None
                attrib_span = course.find("span", class_="crs_attrstr")
                course_info["department"] = dept
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
                if attrib_span:
                    attrib_dept_tag = attrib_span.find("a")
                    attrib_dept_tag = attrib_dept_tag["href"]
                    attrib_dept_tag = attrib_dept_tag.strip().replace("\u00a0", " ")
                    attrib_tag = attrib_span.text.strip().replace("\u00a0", " ")
                    course_attrib = attrib_dept_tag + attrib_tag
                    course_attrib = course_attrib.split("/search/", 1)[1].strip()
                    course_info["attributes"] = course_attrib.strip().replace("\u00a0", " ")
                    
                transformed_course_info = transform_data(course_info)
                courses_list.append(transformed_course_info)
        
        for c in courses_list:
            if c in courses_set:
                pass
            else:
                courses_set.append(c)
        
        return courses_set



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
    "https://bulletin.wustl.edu/grad/art/#courses",
    "https://bulletin.wustl.edu/grad/architecture/#courses",
    "https://bulletin.wustl.edu/grad/artsci/dbbs/#courses",
    "https://bulletin.wustl.edu/grad/artsci/americanculturestudies/#courses",
    "https://bulletin.wustl.edu/grad/artsci/anthropology/#courses",
    "https://bulletin.wustl.edu/grad/artsci/arthistoryandarchaeology/#courses",
    "https://bulletin.wustl.edu/grad/artsci/biology/#courses",
    "https://bulletin.wustl.edu/grad/artsci/chemistry/#courses",
    "https://bulletin.wustl.edu/grad/artsci/classics/#courses",
    "https://bulletin.wustl.edu/grad/artsci/comparativeliteratureandthought/#courses",
    "https://bulletin.wustl.edu/grad/artsci/performingarts/#courses",
    "https://bulletin.wustl.edu/grad/artsci/eeps/#courses",
    "https://bulletin.wustl.edu/grad/artsci/eastasianlanguagesandcultures/#courses",
    "https://bulletin.wustl.edu/grad/artsci/economics/#courses",
    "https://bulletin.wustl.edu/grad/artsci/education/#courses",
    "https://bulletin.wustl.edu/grad/artsci/english/#courses",
    "https://bulletin.wustl.edu/grad/artsci/filmandmediastudies/#courses",
    "https://bulletin.wustl.edu/grad/artsci/romancelanguagesandliteratures/#courses",
    "https://bulletin.wustl.edu/grad/artsci/history/#courses",
    "https://bulletin.wustl.edu/grad/artsci/jimes/#courses",
    "https://bulletin.wustl.edu/grad/artsci/latinamericanstudies/#courses",
    "https://bulletin.wustl.edu/grad/artsci/liberalarts/#courses",
    "https://bulletin.wustl.edu/grad/artsci/mathematics/#courses",
    "https://bulletin.wustl.edu/grad/artsci/music/#courses",
    "https://bulletin.wustl.edu/grad/artsci/performingarts/#courses",
    "https://bulletin.wustl.edu/grad/artsci/philosophy/#courses",
    "https://bulletin.wustl.edu/grad/artsci/philosophyneurosciencepsychology/#courses",
    "https://bulletin.wustl.edu/grad/artsci/physics/#courses",
    "https://bulletin.wustl.edu/grad/artsci/politicalscience/#courses",
    "https://bulletin.wustl.edu/grad/artsci/psychologicalandbrainsciences/#courses",
    "https://bulletin.wustl.edu/grad/artsci/sociology/#courses",
    "https://bulletin.wustl.edu/grad/artsci/statisticsanddatascience/#courses",
    "https://bulletin.wustl.edu/grad/artsci/womengenderandsexualitystudies/#courses"
    ]

scraper = CourseScraper(page_links)
data_list = scraper.create_courses_set()
scraper.export_data(data_list)
