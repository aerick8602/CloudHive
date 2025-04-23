from app.db.client import db, metadata_collection,user_collection
from app.utils.logger import logger
from datetime import datetime ,timezone
from bson import ObjectId




# Example usage:
# email = "user@example.com"
# _id = register_user(email)
def register_user( email: str) -> tuple[bool, str]:
    try:
        user = user_collection.find_one({"accounts.e": email})
        if user:
            return False, str(user["_id"]) 


        result = user_collection.insert_one({
            "accounts": [
                {
                    "e": email,
                    "cp": "google",
                    "ic": True,
                    "jt": datetime.now(timezone.utc).isoformat(),
                    "sync": datetime.now(timezone.utc).isoformat()
                }
            ]
        })
        logger.debug(f"Created new user: {email}")
        return True, str(result.inserted_id) 

    except Exception as e:
        logger.error(f"User creation failed: {e}")
        return False, None


# Example usage:
# _id = "607c72ef6e38ed3f8f6b8b62"  # Example _id
# email = "other@example.com"  # The new account's email
# is_connected = connect_account(_id, email)
def connect_account(_id: str, email: str):
    try:

        user = user_collection.find_one({"_id": ObjectId(_id)})
        if not user:
            logger.error(f"User not found: {_id}")
            return False

        existing_emails = [acc["e"] for acc in user.get("accounts", [])]
        if email in existing_emails:
            logger.debug(f"Account {email} already connected")
            return True

        user_collection.update_one(
            {"_id": ObjectId(_id)},
            {"$addToSet": {"accounts": {
                "e": email,  
                "cp": "google",  
                "ic": True, 
                "jt": datetime.now(timezone.utc), 
                "sync": datetime.now(timezone.utc) 
            }}}
        )
        return True
    except Exception as e:
        logger.error(f"Failed to add connected account: {e}")
        return False


# Example usage:
# _id = "607c72ef6e38ed3f8f6b8b62"  # Example _id
# email = "other@example.com"  # The account's email to be updated
# updates = {
#     "ic": False,  
#     "sync": datetime.now(timezone.utc) 
# }
# was_updated = update_account_status(_id, email, updates)
def update_account_status(_id: str, email: str, updates: dict):
    """Update fields in a specific connected account under a user."""
    try:
        result = user_collection.update_one(
            {
                "_id": ObjectId(_id),
                "accounts.e": email
            },
            {
                "$set": {
                    **{f"accounts.$.{key}": value for key, value in updates.items()}
                }
            }
        )
        if result.modified_count > 0:
            logger.debug(f"Updated account {email} for user {_id} with {updates}")
            return True
        else:
            logger.warning(f"No updates applied for account {email} of user {_id}")
            return False
    except Exception as e:
        logger.error(f"Failed to update account status: {e}")
        return False


def save_metadata(metadata: dict):
    try:

        existing = metadata_collection.find_one({
            "id": metadata["id"],
            "cp": metadata["cp"],
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
