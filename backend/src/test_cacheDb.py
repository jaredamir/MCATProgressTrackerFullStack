import unittest
import sqlite3
import json
import time
from cachingFunctions import store_data_in_cache, get_cached_data, init_db, get_db_connection

class TestCacheFunctionality(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Set up the database for testing"""
        init_db()

    def setUp(self):
        """Reset cache before each test to ensure a clean slate"""
        self.test_key = "test_key"
        self.test_value = {"message": "Hello, world!"}
        self.test_ttl = 10  # 10 seconds for TTL

    def test_store_data_in_cache(self):
        """Test storing data in the cache"""
        store_data_in_cache(self.test_key, self.test_value, ttl=self.test_ttl)
        cached_data = get_cached_data(self.test_key)
        self.assertEqual(cached_data, self.test_value, "Stored data doesn't match the retrieved data")

    def test_cache_expiry(self):
        """Test if the cache expires correctly after the TTL"""
        store_data_in_cache(self.test_key, self.test_value, ttl=1)  # 1 second TTL
        cached_data = get_cached_data(self.test_key)
        self.assertEqual(cached_data, self.test_value, "Stored data doesn't match immediately")

        # Wait for more than the TTL (2 seconds)
        time.sleep(2)

        # Check if the cache has expired
        cached_data_after_expiry = get_cached_data(self.test_key)
        self.assertIsNone(cached_data_after_expiry, "Cache should be expired but data was still found")

    def test_cache_not_found(self):
        """Test retrieving non-existent data from the cache"""
        cached_data = get_cached_data("non_existent_key")
        self.assertIsNone(cached_data, "Cache should return None for non-existent data")

    def test_database_connection(self):
        """Test if the database connection is established"""
        try:
            conn = get_db_connection()
            self.assertIsInstance(conn, sqlite3.Connection, "Database connection failed")
        except Exception as e:
            self.fail(f"Unexpected error: {e}")

if __name__ == "__main__":
    unittest.main()
