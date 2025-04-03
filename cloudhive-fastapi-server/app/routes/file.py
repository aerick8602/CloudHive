from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import List, Optional ,Dict ,Any
import os
from app.services.google_drive.google_drive_service import GoogleDriveService
from app.services.box.box_service import BoxService 


router = APIRouter(prefix="/file", tags=["File Management"])

STORAGE_SERVICES = {
    "google": GoogleDriveService(),
    "box": BoxService(),
}


def get_service(provider: str):
    """ Fetch storage service based on provider """
    provider = provider.lower()
    if provider not in STORAGE_SERVICES:
        raise HTTPException(status_code=400, detail="Invalid provider. Choose from: google, onedrive, dropbox")
    return STORAGE_SERVICES[provider]



@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...), 
    provider: str = Query(...), 
    email: str = Query(...),
    folder_id: str = Query(None)
):
    """Upload a file to a specific cloud storage provider, optionally into a folder."""
    service = get_service(provider)

    try:
        file_id = service.upload_file(email, file, folder_id)
        return {"message": "✅ File uploaded successfully", "file_id": file_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Upload failed: {str(e)}")


@router.get("/list")
async def list_files(
    provider: str = Query(...), 
    account_email: str = Query(...), 
    folder_id: Optional[str] = None  
):
    """List files from a specific account in the chosen provider."""
    service = get_service(provider)

    try:
        files = service.list_files(account_email, folder_id)
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Failed to list files: {str(e)}")
