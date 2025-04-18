from pymongo import MongoClient
from app.utils.config import MONGODB_URI
from app.utils.logger import logger
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure

logger.info("Connecting to MongoDB...")

try:
    client = MongoClient(
        MONGODB_URI,
        serverSelectionTimeoutMS=10000
    )
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

db = client.cloudhive
metadata_collection = db.metadata

# Create unique index for file metadata
try:
    metadata_collection.create_index([("id", 1), ("c", 1), ("e", 1)], unique=True)
except Exception as e:
    logger.error(f"Failed to create index: {e}")

def save_metadata(metadata: dict):
    try:

        existing = metadata_collection.find_one({
            "id": metadata["id"],
            "c": metadata["c"],
            "e": metadata["e"]
        })
        
        if existing:
            result = metadata_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": metadata}
            )
            logger.debug(f"Metadata updated successfully — {result.modified_count} document(s) modified")
        else:
            result = metadata_collection.insert_one(metadata)



            return True
    except Exception as e:
        logger.error(f"Failed to save metadata: {e} ")
        return False

def get_mongodb_stats():
    try:
        db_stats = db.command("dbStats")
        return {
                "db": db_stats["db"],
                "collections": db_stats["collections"],
                "objects": db_stats["objects"],
                "avgObjSize": db_stats.get("avgObjSize"),
                "dataSize": db_stats["dataSize"],  
                "storageSize": db_stats["storageSize"],  
                "indexes": db_stats["indexes"],
                "indexSize": db_stats["indexSize"],
        }
    except Exception as e:
        logger.error(f"Failed to get MongoDB stats: {e}")
        return {"error": str(e)}
