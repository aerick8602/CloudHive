from fastapi import APIRouter, HTTPException, Query
from typing import  Optional
from app.utils.logger import logger
import os
import json
from app.db.mongo import metadata_collection
from app.utils.helpers import CATEGORY_MIME_MAP

router = APIRouter(prefix="/files", tags=["File Retrieval"])

@router.get("/")
async def get_items(
    filter: Optional[str] = Query(None, description="Filter: starred, trashed, category"),
    category: Optional[str] = Query(None, description="Category to filter (if filter=category)"),
    parent_id: Optional[str] = Query(None, description="Parent folder ID (ignored for starred/trashed/category filters)")
):
    """
    Unified route to fetch:
    - All items under parent_id (or root folders if none)
    - Starred items (filter=starred)
    - Trashed items (filter=trashed)
    - Items by MIME category (filter=category&category=Images, etc.)
    """

    try:
        query = {}

        # Trashed filter
        if filter == "trashed":
            query = {"p.0": parent_id, "t": True }

        # Starred filter
        elif filter == "starred":
            query = {"p.0": parent_id, "s": True, "t": False }

        # Category filter
        elif filter == "category":
            if not category or category not in CATEGORY_MIME_MAP:
                raise HTTPException(status_code=400, detail=f"Invalid or missing category")
            print(category)
            mime_types = CATEGORY_MIME_MAP[category]
            query = { "m": { "$in": mime_types }, "t": False }

        # Default: Fetch by parent
        else:
            ROOT_FOLDER_PATH = "app/data/root_folders.json"
            if not os.path.exists(ROOT_FOLDER_PATH):
                raise FileNotFoundError(f"❌ root_folders.json not found at {ROOT_FOLDER_PATH}")
            
            with open(ROOT_FOLDER_PATH, "r") as f:
                ROOT_FOLDER_MAP = json.load(f)

            if parent_id:
                query = { "p.0": parent_id, "t": False }
            else:
                query = { "p.0": { "$in": list(ROOT_FOLDER_MAP.values()) }, "t": False }



        items = list(metadata_collection.find(query))
        for item in items:
            item["_id"] = str(item["_id"])

        logger.info(f"Fetched {len(items)} items | filter={filter} | parent_id={parent_id} | category={category}")
        return { "items": items }

    except Exception as e:
        logger.error("Failed to fetch items")
        raise HTTPException(status_code=500, detail=str(e))