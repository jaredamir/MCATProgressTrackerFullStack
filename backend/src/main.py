from airtable import Airtable
import pandas as pd
from dotenv import load_dotenv
import os
import sqlite3

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
    cursor.execute('REPLACE INTO cache (key, value) VALUES (?,?)', (key, cache_value))
    conn.commit()

def get_cache(key):
    cursor.execute('SELECT value FROM cache WHERE key = ?', (key,))
    result = cursor.fetchone()
    return result[0] if result else None

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
    airTable = Airtable(BASE_ID, tableName, API_KEY)
    return airTable.get_all()

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

    # Flatten 'section' column if it's a list
    df['section'] = df['section'].apply(lambda x: x[0] if isinstance(x, list) else x)

    # Flatten 'Reason For Missing' column if it's a list
    df['Reason For Missing'] = df['Reason For Missing'].apply(lambda x: ', '.join(x) if isinstance(x, list) else x)
    # Count occurrences of each "Reason For Missing" per section
    reason_counts = df.groupby(['section', 'Reason For Missing']).size().unstack(fill_value=0)

    # Convert to a dictionary for frontend use
    reason_counts_dict = reason_counts.to_dict(orient="index")

    return reason_counts_dict


if __name__ == "__main__":
    print(get_practice_test_reviews())
