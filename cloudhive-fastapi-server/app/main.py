from fastapi import FastAPI
from fastapi.routing import APIRouter
from app.routes import auth
from app.routes import file
from app.routes import upload
from app.utils.logger import logger  
from app.db.mongo import get_mongodb_stats
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(title="CloudHive FastAPI Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(tags=["Default"])

@router.get("/")
async def root():
    return {"message": "Welcome to CloudHive Server 🚀"}

@router.get("/usage/mongodb")
def fetch_mongo_usage_stats():
    return get_mongodb_stats()

# Register routes
app.include_router(router)
app.include_router(auth.router)
app.include_router(file.router)
app.include_router(upload.router)

if __name__ == "__main__":
    logger.info("Starting CloudHive FastAPI server...")
    import uvicorn
    try:
        uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True, log_config=None)
    except Exception as e:
        logger.error(f"Error starting server: {e}")
