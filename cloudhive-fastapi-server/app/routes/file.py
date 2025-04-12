from fastapi import APIRouter, HTTPException, Query
from typing import  Optional
from app.utils.logger import logger
import os
import json
from app.db.mongo import metadata_collection

router = APIRouter(prefix="/files", tags=["File Retrieval"])

ROOT_FOLDER_PATH = os.path.join("app", "data", "root_folders.json")
if not os.path.exists(ROOT_FOLDER_PATH):
    raise FileNotFoundError(f"❌ root_folder.json not found at {ROOT_FOLDER_PATH}")

with open(ROOT_FOLDER_PATH, "r") as f:
    ROOT_FOLDER_MAP = json.load(f)

@router.get("/")
async def get_items(
    parent_id: Optional[str] = Query(None)
):
    try:
        # Build the query depending on presence of parent_id
        if not parent_id:
            parent_ids = list(ROOT_FOLDER_MAP.values())
            query = { "p.0": { "$in": parent_ids } }
        else:
            query = { "p.0": parent_id }

        items = list(metadata_collection.find(query))
        for item in items:
            item["_id"] = str(item["_id"])  # Convert ObjectId to string

        logger.info(f"📂 Fetched {len(items)} items for parent_id={parent_id or 'root folders'}")
        return { "items": items }

    except Exception as e:
        logger.exception("❌ Failed to fetch items")
        raise HTTPException(status_code=500, detail=str(e))