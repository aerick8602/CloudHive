from pymongo import MongoClient
from app.utils.config import MONGODB_URI
from app.utils.logger import logger

logger.info("Connecting to MongoDB...")

try:
    client = MongoClient(
        MONGODB_URI,
        serverSelectionTimeoutMS=5000
    )
    client.server_info()
    logger.info("✅ Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"❌ Failed to connect to MongoDB: {str(e)}")
    raise

db = client.cloudhive
metadata_collection = db.metadata

# Create unique index for file metadata
try:
    metadata_collection.create_index([("id", 1), ("c", 1), ("e", 1)], unique=True)
    logger.info("✅ Created unique index on metadata collection")
except Exception as e:
    logger.error(f"❌ Failed to create index: {e}")

def save_metadata(metadata: dict):
    try:
        logger.info(f"Saving metadata: {metadata}")
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
            logger.info(f"Updated existing metadata: {result.modified_count} documents modified")
        else:
            result = metadata_collection.insert_one(metadata)
            logger.info(f"Inserted new metadata with ID: {result.inserted_id}")
        
        return True
    except Exception as e:
        logger.error(f"❌ Failed to save metadata: {e}")
        return False

def get_mongodb_stats():
    try:
        stats = db.command("dbStats")
        return {
            "db": stats["db"],
            "collections": stats["collections"],
            "objects": stats["objects"],
            "avgObjSize": stats["avgObjSize"],
            "dataSize": stats["dataSize"],
            "storageSize": stats["storageSize"],
            "indexes": stats["indexes"],
            "indexSize": stats["indexSize"],
        }
    except Exception as e:
        logger.error(f"Failed to get MongoDB stats: {e}")
        return {"error": str(e)}