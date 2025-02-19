from airtable import Airtable
import pandas as pd
from dotenv import load_dotenv
import os
import sqlite3
from datetime import datetime, timedelta

conn = sqlite3.connect('cache.db')
cursor = conn.cursor()

cursor.execute(
    '''
    CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        value TEXT
    )
    '''
)

def set_cache(key, cache_value):
    cursor.execute('REPLACE INTO cache (key, value, timestamp) VALUES (?,?,?)', (key, cache_value, datetime.now()))
    conn.commit()

def get_cache(key):
    cursor.execute('SELECT value, timestamp FROM cache WHERE key = ?', (key,))
    result = cursor.fetchone()
    if result:
        value, timestamp = result
        timestamp = datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S')
        if datetime.now() - timestamp < timedelta(days=1):
            return value
        else:
            return None

# Load environment variables
load_dotenv()
"""
Thing to add:
-Frequency of "reason for missing" per section in test, overall in test, and overall between tests
-Number of topics reviewed today out of total needed to review (Days since last reviewed == 1 | needs review == yes)
-Review rate (to see if I am slacking more)
-Number of topics that need review per section (to see which topic deserves the most attention)
-Ratio of needs review to total topic per section
-Pie chart of confidence level for each section 
-Time per question per section
-Average number of reviewed topics per day and projected amount of days it will take to get through it all
-pie chart of reason for missing a question per section
-The topics I need to review based on the last test
-Line graph of test score over date
-Confidence verse accuracy (per section or per topic)

Frontend abilities that require BE
-Get a drop down of the possible views
    -get all test dates to see analytics for specific date (dropdown)
    -get all sections (drop down) (have all dropdown to return all)
    -Allow time frame
    -Get all topics

"""
# Replace with your credentials
API_KEY = os.getenv("AIRTABLE_API_KEY")
BASE_ID = os.getenv("AIRTABLE_BASE_ID")
#TABLE_NAME = "Topics Review"

# Connect to Airtable


def get_airtable_table_data(tableName):
    # cache_data = get_cache(tableName)
    # if cache_data:
    #     print("Retrieved from cache")
    #     return cache_data
    # else:
    airTable = Airtable(BASE_ID, tableName, API_KEY)
    data = airTable.get_all()
    #set_cache(tableName, data)
    return data

# Function to fetch and process data from Airtable
def get_needs_review_ratios():
    # Fetch records from Airtable
    records = get_airtable_table_data("Topics Review")

    # Extract fields into a DataFrame
    data = [record['fields'] for record in records]
    df = pd.DataFrame(data)

    # Flatten the 'Section' column if it's a list (if needed)
    df['Section'] = df['Section'].apply(lambda x: x[0] if isinstance(x, list) else x)

    # Group by 'Section' and calculate the count of 'Yes' and 'No' in the 'Needs Review' column
    category_counts = df.groupby('Section')['Needs Review'].value_counts().unstack(fill_value=0)

    # Convert to a dictionary for easy consumption in frontend
    category_counts_dict = category_counts.to_dict(orient="index")
    return category_counts_dict


def get_reason_for_missing_frequencies():
    records = get_airtable_table_data("Practice Test Review")
    data = [record['fields'] for record in records]
    df = pd.DataFrame(data)

    # Ensure 'Test', 'section', and 'Reason For Missing' exist
    df['Test'] = df.get('Test', 'Unknown')
    df['section'] = df.get('section', 'Unknown')
    df['Reason For Missing'] = df.get('Reason For Missing', '')

    # Flatten 'Test' and 'section' if they are lists (ensure they are strings)
    df['Test'] = df['Test'].apply(lambda x: str(x[0]) if isinstance(x, list) and x else str(x))
    df['section'] = df['section'].apply(lambda x: str(x[0]) if isinstance(x, list) and x else str(x))

    # Convert 'Reason For Missing' multi-select values into separate rows
    df = df.explode('Reason For Missing')

    # Remove NaN or empty values in 'Reason For Missing'
    df = df.dropna(subset=['Reason For Missing'])
    df['Reason For Missing'] = df['Reason For Missing'].astype(str)  # Ensure it's a string

    # Group by 'Test', then by 'section', then count occurrences of each "Reason For Missing"
    grouped = df.groupby(['Test', 'section', 'Reason For Missing']).size().unstack(fill_value=0)

    # Convert into the desired nested dictionary format
    result_dict = {}
    for (test, section), reasons in grouped.iterrows():
        if test not in result_dict:
            result_dict[test] = {}  # Initialize test key if not present
        result_dict[test][section] = reasons.to_dict()  # Store section data inside test key

    return result_dict


def generate_error_frequencies_by_topic():
    records = get_airtable_table_data("Practice Test Review")
    data = [record['fields'] for record in records]
    # Create an empty list to hold our rows
    rows = []

    # Flatten the data
    for test, test_data in data:
        for topic, topic_data in test_data.items():
            for error_type, count in topic_data.items():
                rows.append({
                    "Test": test,
                    "Topic": topic,
                    "Error Type": error_type,
                    "Frequency": count
                })

    # Convert to a DataFrame
    df = pd.DataFrame(rows)

    # Group by Test, Topic, and Error Type, then sum the frequencies
    result = df.groupby(['Test', 'Topic', 'Reason For Missing'])['Frequency'].sum().unstack(fill_value=0)

    return result

if __name__ == "__main__":
    freqs = generate_error_frequencies_by_topic()
    print(freqs)
    # for key in freqs:
    #     print(f"########### tet id # {key} #############")
    #     for section in freqs[key]:
    #         print(f"****{section}******")
    #         for reason in freqs[key][section]:
    #             if freqs[key][section][reason] != 0:
    #                 print(f"{reason}: {freqs[key][section][reason]}")


