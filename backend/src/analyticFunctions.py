from airtable import Airtable
import pandas as pd
from dotenv import load_dotenv
import os
import sqlite3
from datetime import datetime, timedelta
import logging

logging.basicConfig(filename='app.log',  # Specify the log file name
                    level=logging.DEBUG,  # Set the logging level
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',  # Log format
                    datefmt='%Y-%m-%d %H:%M:%S')  # Timestamp format

logger = logging.getLogger(__name__)

load_dotenv()
"""
Bar Graph:
hash {label: data point}

"""
API_KEY = os.getenv("AIRTABLE_API_KEY")
BASE_ID = os.getenv("AIRTABLE_BASE_ID")

tableNames = {
    "topics": "Topics Review",
    "practice tests": "Practice Test Scores",
    "question reviews": "Practice Test Review"
}

def get_airtable_table_data(tableName):
    airTable = Airtable(BASE_ID, tableName, API_KEY)
    data = airTable.get_all()
    return data

def get_topics_map():
    try:
        airtableData = get_airtable_table_data(tableNames["topics"])
        print(airtableData)
        topicMap = {topic['id']: f"{topic['fields']['Topic Name']} ({topic['fields']['Section'][0]})" for topic in airtableData}

        return topicMap
    except Exception as e:
        logger.error("error during get_topics_map:", e)

def get_tests_map():
    try:
        airtableData = get_airtable_table_data(tableNames["practice tests"])
        #print(airtableData)
        testMap = {
            test['id']: test['fields']['Date']
            for test in airtableData
            if 'fields' and test['fields'] and 'Date' in test['fields']
        }
        return testMap
    except Exception as e:
        logger.error("error in get_tests_map:", e)

def get_reason_for_missing_frequencies():
    try:
        airtableData = get_airtable_table_data(tableNames["question reviews"])
        testMap = get_tests_map()
        print(airtableData)
        testsDataMap = {}
        for review in airtableData:
            review_test_id = testMap[review['fields']['Test'][0]]
            if not review_test_id in testsDataMap:
                testsDataMap[review_test_id] = {}
            for reason in review['fields']['Reason For Missing']:
                if reason in testsDataMap[review_test_id]:
                    testsDataMap[review_test_id][reason] += 1
                else:
                    testsDataMap[review_test_id][reason] = 1

        return testsDataMap
    except Exception as e:
        logger.error("error occured with get_reason_for_missing_frequencies:", e)
        return None
if __name__ == "__main__":
    print(get_reason_for_missing_frequencies()) #rec2oz7d5mlc8BewW
    #print(get_tests_map())