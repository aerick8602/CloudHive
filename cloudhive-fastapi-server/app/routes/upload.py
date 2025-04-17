import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from typing import List, Optional
from app.provider.google_drive.google_drive_provider import GoogleDriveProvider
from app.utils.logger import logger
from app.db.mongo import metadata_collection

router = APIRouter(prefix="/upload", tags=["Drive Uploads"])


PROVIDERS = {
    "google": GoogleDriveProvider,
}

@router.post("/")
async def upload_to_cloud(
    background_tasks: BackgroundTasks,
    email: str = Form(...),
    provider: str = Form(...),
    files: List[UploadFile] = File(...),
    paths: Optional[List[str]] = Form(None),
    is_folder: bool = Form(False),
    parent_id: Optional[str] = Form(None) 
):
    """Upload a file to the specified cloud provider"""
    if parent_id:
            matched_metadata = metadata_collection.find_one({"id": parent_id})
            if matched_metadata:
                email = matched_metadata["e"]
                provider = matched_metadata["c"]
            else:
                raise HTTPException(status_code=400, detail="Parent ID not found")

    provider = provider.lower()
    if provider not in PROVIDERS:
        raise HTTPException(status_code=400, detail=f"❌ Unsupported provider '{provider}'")

    service = PROVIDERS[provider](email)
    
    try:

        uploaded_files = []

        if is_folder and paths and len(paths) > 0:
            # Folder upload mode
            folder_name = os.path.basename(paths[0].split('/')[0])
            files_dict = {path: file for path, file in zip(paths, files)}
            # Pass parent_id if provided
            folder_id = service.upload_folder(folder_name, files_dict, parent_id)
            uploaded_files.append({"id": folder_id, "name": folder_name, "type": "folder"})
        else:
            # File upload mode
            for idx, file in enumerate(files):
                if paths:
                    # Upload with specific path
                    file_path = paths[idx]
                    uploaded = service.upload_file_with_path(file_path, file, parent_id)
                else:
                    # Upload to root or specified parent folder
                    file_bytes = await file.read()
                    uploaded = service.upload_file(
                        file_name=file.filename,
                        file_bytes=file_bytes,
                        mime_type=file.content_type,
                        parent_id=parent_id  # Include parent_id
                    )
                uploaded_files.append(uploaded)
        
        # Use background task to update and get quota info without blocking the response
        background_tasks.add_task(service.update_and_get_quota)


        logger.info(f"📂 Upload completed for {email}")
        return {"uploaded": uploaded_files}

    except Exception as e:
        logger.exception("❌ Upload failed due to exception:")
        raise HTTPException(status_code=500, detail=str(e))
