import sqlite3
import time
import json
import logging

logging.basicConfig(filename='app.log',  # Specify the log file name
                    level=logging.DEBUG,  # Set the logging level
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',  # Log format
                    datefmt='%Y-%m-%d %H:%M:%S')  # Timestamp format

logger = logging.getLogger(__name__)


def get_db_connection():
    try:
        conn = sqlite3.connect("cache.db")
        #cursor = conn.cursor()
        return conn
    except Exception as e:
        logger.error(f"cache db error: {e}")
        raise Exception("Cache database connection failed")

def init_db():
    with get_db_connection() as conn:
        try:
            cursor = conn.cursor()
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS cache (
                    key TEXT PRIMARY KEY,
                    value TEXT,
                    timestamp INTEGER
                )
                """
            )

            conn.commit()
        except Exception as e:
            logger.critical(f"Error initalizing cache db: {e}")
            raise

def store_data_in_cache(key, value, ttl=1200):
    with get_db_connection() as conn:
        try:
            cursor = conn.cursor()
            expiry = int(time.time()) + ttl

            cursor.execute(
                """
                REPLACE INTO cache (key, value, timestamp) VALUES (?, ?, ?)
                """, (key, json.dumps(value), expiry)
            )
            conn.commit()
        except Exception as e:
            logger.error(f"error in store_data_in_cache: {e}")

def get_cached_data(key):
    with get_db_connection() as conn:
        try:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT value, timestamp FROM cache WHERE key=? 
                """, (key,)
            )
            row = cursor.fetchone()
            if row:
                value, expiry = row
                if int(time.time()) < expiry:
                    return json.loads(value)
                else:
                    cursor.execute(
                        """
                        DELETE FROM cache WHERE key=?
                        """, (key,)
                    )
                    conn.commit()
            return None
        except Exception as e:
            logger.error(f"error in get_cached_data: {e}")
            return None

if __name__ == "__main__":
    init_db()
    # Example analytics data
    analytics_data = {
        "graphType": "Bar",
        "data": {
            "2025-02-01": {"Math Error": 3, "Misread Question": 1},
            "2025-02-9": {"Math Error": 2, "Misread Question": 4}
        }
    }

    # Store data with a 10-second expiration time
    store_data_in_cache("analytics_result", analytics_data, ttl=10)

    # Retrieve data
    cached_data = get_cached_data("analytics_result")
    print("Cached Data:", cached_data)  # Should print the data if it's still valid

    # Wait 11 seconds and try again

    time.sleep(11)

    cached_data = get_cached_data("analytics_result")
    print("Cached Data After Expiry:", cached_data)  # Should print None