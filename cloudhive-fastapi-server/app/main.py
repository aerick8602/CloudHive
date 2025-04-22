from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.utils.logger import logger

from app.routes import auth
from app.routes import file
from app.routes import upload
from app.routes import logs
from app.routes import quota
from app.routes import database
from app.routes import cloud

# from app.provider.google_drive.google_drive_provider import GoogleDriveProvider





# Initialize FastAPI app
app = FastAPI(title="CloudHive FastAPI Server")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base router
router = APIRouter(tags=["Default"])

@router.get("/")
async def root():
    return {"message": "Welcome to CloudHive Server 🚀"}

# @router.get("/google/files/{email}")
# def list_google_drive_files(email: str):
#     try:
#         provider = GoogleDriveProvider(email)
#         response = provider.client.files().list(
#             q="trashed = false",
#             fields=(
#                 "files(id, name, mimeType, parents, modifiedTime, createdTime, "
#                 "iconLink, thumbnailLink, webViewLink, webContentLink, starred, "
#                 "trashed, owners(emailAddress, photoLink), size)"
#             )
#         ).execute()
#         return response.get("files", [])
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to list files: {str(e)}")

# Register route modules

app.include_router(auth.router)
app.include_router(file.router)
app.include_router(upload.router)
app.include_router(logs.router)
app.include_router(quota.router)
app.include_router(database.router)
app.include_router(cloud.router)



# Uvicorn entrypoint
if __name__ == "__main__":
    logger.info("Starting CloudHive FastAPI server...")
    import uvicorn
    try:
        uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True, log_config=None)
    except Exception as e:
        logger.critical(f"Error starting server: {e}")
