from neo4j import GraphDatabase
from dotenv import load_dotenv, dotenv_values 
import os

URI = os.getenv('NEO4J_URI')
AUTH = (os.getenv('NEO4J_USERNAME'), os.getenv('NEO4J_PASSWORD'))

def create_driver():
    driver = GraphDatabase.driver(URI, AUTH)

def create_dept(name, code, url):
    neo4j_create_statement = "CREATE (dept: DEPARTMENT {id: 000, name:" + name + ", code:" + code + ", url: " + url + "})"
    