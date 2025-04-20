from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
from app.utils.config import MONGODB_URI
from app.utils.logger import logger
from pymongo import MongoClient, ASCENDING
from pymongo.errors import OperationFailure

logger.info("Connecting to MongoDB...")

try:
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=10000)
    client.server_info()
    logger.debug("Successfully connected to MongoDB")
except ServerSelectionTimeoutError as e:
    logger.critical(f"MongoDB connection timed out: {str(e)}")
    raise
except ConnectionFailure as e:
    logger.critical(f"MongoDB server connection failed: {str(e)}")
    raise
except Exception as e:
    logger.critical(f"Failed to connect to MongoDB: {str(e)}")
    raise

# Export database and collections
from pymongo.database import Database

db: Database = client.cloudhive
metadata_collection = db.metadata
user_collection = db.users

# Indexes
try:
    metadata_collection.create_index([("id", 1), ("c", 1), ("e", 1)], unique=True)
except Exception as e:
    logger.error(f"Failed to create metadata index: {e}")
    
try:
    user_collection.create_index([("accounts.e", ASCENDING)], unique=True)
except OperationFailure as e:
    logger.error(f"Failed to create user index: {e}")