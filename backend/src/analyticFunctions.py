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
        topicMap = {}

        for topic in airtableData:
            if 'id' in topic and 'fields' in topic:
                topicName = topic['fields'].get('Topic Name', None)
                section = topic['fields'].get('Section', [None])[0]

                if topicName and section:
                    topicMap[topic['id']] = f"{topicName} ({section})"
                else:
                    logger.warning(f"Missing 'Topic Name' or 'Section' in topic: {topic}")
            else:
                logger.warning(f"Topic structure is invalid: {topic}")

        return topicMap
    except Exception as e:
        logger.error("Error during get_topics_map:", e)

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
            review_test_id = testMap.get(review.get('fields').get('Test')[0])
            if review_test_id == None:
                pass
            if not review_test_id in testsDataMap:
                testsDataMap[review_test_id] = {}
            reasons = review.get('fields').get('Reason For Missing')
            if reasons != None:
                for reason in reasons:
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
            testId = test.get('id')
            if testId == None:
                pass
            if not testId in testMap:
                continue
            testDate = testMap[testId]
            if not testId or not testDate:
                continue
            scoreData = {section: test.get('fields').get(section)
                         for section in sections
                         if test.get('fields').get(section)
                         }
            testsDataMap[testDate] = scoreData

        return testsDataMap

    except Exception as e:
        logger.error("error occured with get_reason_for_missing_frequencies:", e)
        return None

def get_topics_lacking_in_understanding_frequencies():
    try:
        airtableData = get_airtable_table_data(tableNames["question reviews"])
        testMap = get_tests_map()
        topicsMap = get_topics_map()
        testsDataMap = {}

        for review in airtableData:
            if not review.get('fields') or not isinstance(review.get('fields'), dict):
                continue  # Skip if 'fields' is missing or not a dictionary

            # Skip if 'Reason For Missing' doesn't contain the relevant reasons
            if not any(reason in review.get('fields').get('Reason For Missing', [])
                       for reason in ("lacking topic understanding", "Content issue (Memorization)")):
                continue

            review_test_date = testMap.get(review.get('fields').get('Test', [None])[0])
            if review_test_date is None:
                continue  # Skip if the test date is missing

            if review_test_date not in testsDataMap:
                testsDataMap[review_test_date] = {}

            topics = review['fields'].get('Topic question relates to ', None)
            if not topics or not isinstance(topics, list):
                continue  # Skip if 'topics' is None or not a list

            for topic in topics:
                topicName = topicsMap.get(topic)
                if not topicName:
                    continue  # Skip if topic name is missing

                testsDataMap[review_test_date][topicName] = (
                    testsDataMap[review_test_date].get(topicName, 0) + 1
                )

        return testsDataMap

    except Exception as e:
        logger.error(f"Error in get_topics_lacking_in_understanding_frequencies: {e}")
        return None

if __name__ == "__main__":
    #print(get_topics_lacking_in_understanding_frequncies()) #rec2oz7d5mlc8BewW
    #print(get_topics_related_to_missed_questions())

    # response_data = {}
    # reason_data = get_reason_for_missing_frequencies()
    # if reason_data:
    #     response_data["Reason For Missing"] = {
    #         "graphType": "Pie",
    #         "data": reason_data
    #     }
    #
    # topics_data = get_topics_related_to_missed_questions()
    # if topics_data:
    #     response_data["Frequency of Topics Relating To Missed Questions"] = {
    #         "graphType": "Bar",
    #         "data": topics_data
    #     }
    #
    # section_data = get_test_section_scores()
    # if section_data:
    #     response_data["Section Scores"] = {
    #         "graphType": "Bar",
    #         "data": section_data
    #     }
    #
    # topics_understanding_data = get_topics_lacking_in_understanding_frequencies()
    # if topics_understanding_data:
    #     response_data["Topics Lacking in Understanding"] = {
    #         "graphType": "Pie",
    #         "data": topics_understanding_data
    #     }
    #
    # print(response_data)

    print(get_topics_related_to_missed_questions())