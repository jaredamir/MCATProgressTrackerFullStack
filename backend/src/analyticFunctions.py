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
    "scores": "Practice Test Scores",
    "question reviews": "Practice Test Review"
}

#Analytics to add:
#-Reason for missing frequency Per section
#-CARS question type frqucny for missing
#-Average reason for missing across tests (to see if theres a consistent issue) or comparing frequncy of missing to previous test

def get_airtable_table_data(tableName):
    airTable = Airtable(BASE_ID, tableName, API_KEY)
    data = airTable.get_all()
    return data

def get_topics_map():
    try:
        airtableData = get_airtable_table_data(tableNames["topics"])
        topicMap = {topic['id']: f"{topic['fields']['Topic Name']} ({topic['fields']['Section'][0]})" for topic in airtableData}

        return topicMap
    except Exception as e:
        logger.error("error during get_topics_map:", e)

def get_tests_map():
    try:
        airtableData = get_airtable_table_data(tableNames["scores"])
        testMap = {
            test['id']: test['fields']['Date']
            for test in airtableData
            if 'fields' and test['fields'] and 'Date' in test['fields']
        }
        return testMap
    except Exception as e:
        logger.error("error in get_tests_map:", e)

def get_topics_related_to_missed_questions():
    try:
        airtableData = get_airtable_table_data(tableNames["question reviews"])
        testMap = get_tests_map()
        topicsMap = get_topics_map()
        testsDataMap = {}
        for review in airtableData:
            review_test_date = testMap[review['fields']['Test'][0]]
            if not review_test_date in testsDataMap:
                testsDataMap[review_test_date] = {}

            topics = review['fields'].get('Topic question relates to ', None)
            if topics == None:
                continue
            for topic in topics:
                topicName = topicsMap[topic]
                if topicName == None:
                    pass
                if topicName in testsDataMap[review_test_date]:
                    testsDataMap[review_test_date][topicName] += 1
                else:
                    testsDataMap[review_test_date][topicName] = 1

        return testsDataMap

    except Exception as e:
        logger.error("error in get_topic_related_to_miss:", e)
        return None

def get_reason_for_missing_frequencies(): #make the airtable get function global, so we're not calling the api everytime
    try:
        airtableData = get_airtable_table_data(tableNames["question reviews"])
        testMap = get_tests_map()
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

def get_test_section_scores():
    try:
        airtableData = get_airtable_table_data(tableNames["scores"])
        testMap = get_tests_map()
        testsDataMap = {}
        sections = ['Chem/Phys Score', 'CARS score', 'Bio/Bio chem Score', 'Psych/Soc Score']
        for test in airtableData:
            testId = test['id']
            if not testId in testMap:
                continue
            testDate = testMap[testId]
            if not testId or not testDate:
                continue
            scoreData = {section: test['fields'][section]
                         for section in sections
                         if test['fields'].get(section)
                         }
            testsDataMap[testDate] = scoreData

        return testsDataMap

    except Exception as e:
        logger.error("error occured with get_reason_for_missing_frequencies:", e)
        return None

def get_topics_lacking_in_understanding_frequncies():
    try:
        airtableData = get_airtable_table_data(tableNames["question reviews"])
        print(airtableData)
        testMap = get_tests_map()
        topicsMap = get_topics_map()
        testsDataMap = {}
        for review in airtableData:
            if all(reason not in review.get('fields').get('Reason For Missing') for reason in
                   ("lacking topic understanding", "Content issue (Memorization)")):
                continue
            review_test_date = testMap[review['fields']['Test'][0]]
            if not review_test_date in testsDataMap:
                testsDataMap[review_test_date] = {}

            topics = review['fields'].get('Topic question relates to ', None)
            if topics == None:
                continue
            for topic in topics:
                topicName = topicsMap[topic]
                if topicName == None:
                    pass
                if topicName in testsDataMap[review_test_date]:
                    testsDataMap[review_test_date][topicName] += 1
                else:
                    testsDataMap[review_test_date][topicName] = 1

        return testsDataMap

    except Exception as e:
        logger.error("error in get_topics_lacking_in_understanding_frequncies:", e)
        return None

if __name__ == "__main__":
    print(get_topics_lacking_in_understanding_frequncies()) #rec2oz7d5mlc8BewW
