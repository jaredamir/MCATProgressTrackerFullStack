from airtable import Airtable
import pandas as pd
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Replace with your credentials
API_KEY = os.getenv("AIRTABLE_API_KEY")
BASE_ID = os.getenv("AIRTABLE_BASE_ID")
TABLE_NAME = "Topics Review"

# Connect to Airtable
airtable = Airtable(BASE_ID, TABLE_NAME, API_KEY)

# Function to fetch and process data from Airtable
def get_needs_review_ratios():
    # Fetch records from Airtable
    records = airtable.get_all()

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

