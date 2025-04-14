from fastapi import APIRouter
from app.db.mongo import get_mongodb_stats  

router = APIRouter(prefix="/db", tags=["Database Stats"])

@router.get("/usage")
def fetch_mongo_usage_stats():
    """Returns MongoDB usage statistics"""
    return get_mongodb_stats()
