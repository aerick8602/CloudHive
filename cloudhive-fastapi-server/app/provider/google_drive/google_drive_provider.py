from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from google.oauth2.credentials import Credentials
from app.services.google_token_service import get_valid_google_token
from app.utils.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from app.utils.logger import logger
from app.utils.storage import get_root_folder, set_root_folder
from app.db.mongo import save_metadata
from typing import Optional
import io
from fastapi import UploadFile


class GoogleDriveProvider:
    def __init__(self, email: str):
        self.email = email
        self.client_id = GOOGLE_CLIENT_ID
        self.client_secret = GOOGLE_CLIENT_SECRET
        self.client = self.get_google_drive_client()
        self.root_folder_id = self.ensure_root_folder()

    def get_google_drive_client(self):
        try:
            access_token, token_data = get_valid_google_token(self.email)
            if not access_token:
                raise ValueError("No valid access token available")

            creds = Credentials(
                token=access_token,
                refresh_token=token_data.get("refresh_token"),
                token_uri=token_data.get("token_uri"),
                client_id=self.client_id,
                client_secret=self.client_secret,
            )
            return build("drive", "v3", credentials=creds, static_discovery=False)
        except Exception as e:
            logger.error(f"Failed to create Google Drive client: {str(e)}")
            raise

    def ensure_root_folder(self):
        folder_id = get_root_folder("google", self.email)
        if folder_id:
            return folder_id

        query = (
            "name='CloudHive' and mimeType='application/vnd.google-apps.folder' "
            "and trashed=false and 'root' in parents"
        )
        response = self.client.files().list(q=query, fields="files(id)").execute()
        if response.get("files"):
            folder_id = response["files"][0]["id"]
        else:
            metadata = {"name": "CloudHive", "mimeType": "application/vnd.google-apps.folder"}
            folder = self.client.files().create(body=metadata, fields="id").execute()
            folder_id = folder["id"]
            permission = {
                "type": "anyone",
                "role": "reader"
            }
            self.client.permissions().create(fileId=folder_id, body=permission).execute()

        set_root_folder("google", self.email, folder_id)
        return folder_id

    def create_folder(self, name: str, parent_id: str):
        metadata = {
            "name": name,
            "mimeType": "application/vnd.google-apps.folder",
            "parents": [parent_id]
        }
        folder = self.client.files().create(body=metadata, fields="id").execute()
        return folder["id"]

    def upload_file(self, file_name: str, file_bytes: bytes, mime_type: str, parent_id: Optional[str] = None):
        try:
            parent_folder = parent_id or self.root_folder_id
            file_metadata = {
                "name": file_name,
                "parents": [parent_folder],
            }

            media = MediaIoBaseUpload(
                io.BytesIO(file_bytes),
                mimetype=mime_type,
                resumable=True
            )

            uploaded = self.client.files().create(
                body=file_metadata,
                media_body=media,
                fields="*"
            ).execute()

            logger.info(f"File uploaded to Google Drive: {uploaded.get('id')}")

            doc = {
                "id": uploaded.get("id"),
                "n": uploaded.get("name"),
                "m": uploaded.get("mimeType"),
                "p": uploaded.get("parents"),
                "tl": uploaded.get("thumbnailLink"),
                "il": uploaded.get("iconLink"),
                "wvl": uploaded.get("webViewLink"),
                "wcl": uploaded.get("webContentLink"),
                "s": uploaded.get("starred", False),
                "t": uploaded.get("trashed", False),
                "q": uploaded.get("quotaBytesUsed"),
                "ct": uploaded.get("createdTime"),
                "mt": uploaded.get("modifiedTime"),
                "e": self.email,
                "c": "google"
            }

            logger.info(f"Preparing to save metadata for file: {file_name}")
            if save_metadata(doc):
                logger.info(f"✅ Metadata saved successfully for file: {file_name}")
            else:
                logger.error(f"❌ Failed to save metadata for file: {file_name}")

            return uploaded
        except Exception as e:
            logger.error(f"Failed to upload file {file_name}: {str(e)}")
            raise

    def upload_folder(self, folder_name: str, files: dict, parent_id: Optional[str] = None):
        """
        Upload a folder with its contents to Google Drive.
        
        Args:
            folder_name: Name of the folder to create
            files: Dictionary containing file paths and their contents
            parent_id: Parent folder ID (defaults to root folder)
        """
        try:
            parent_id = parent_id or self.root_folder_id

            # Create the main folder
            folder_metadata = {
                "name": folder_name,
                "mimeType": "application/vnd.google-apps.folder",
                "parents": [parent_id]
            }
            folder = self.client.files().create(body=folder_metadata, fields="*").execute()
            folder_id = folder["id"]

            logger.info(f"Folder created in Google Drive: {folder_id}")

            # Store folder metadata
            folder_doc = {
                "id": folder.get("id"),
                "n": folder.get("name"),
                "m": folder.get("mimeType"),
                "p": folder.get("parents"),
                "s": folder.get("starred", False),
                "t": folder.get("trashed", False),
                "ct": folder.get("createdTime"),
                "mt": folder.get("modifiedTime"),
                "e": self.email,
                "c": "google"
            }

            logger.info(f"Preparing to save metadata for folder: {folder_name}")
            if save_metadata(folder_doc):
                logger.info(f"✅ Metadata saved successfully for folder: {folder_name}")
            else:
                logger.error(f"❌ Failed to save metadata for folder: {folder_name}")

            # Process each file in the folder
            for file_path, file_data in files.items():
                # Remove the folder name from the path
                relative_path = file_path.replace(f"{folder_name}/", "")
                self.upload_file_with_path(relative_path, file_data, folder_id)

            return folder_id
        except Exception as e:
            logger.error(f"Failed to upload folder {folder_name}: {str(e)}")
            raise

    def upload_file_with_path(self, file_path: str, file: UploadFile, root_folder_id: Optional[str] = None):
        try:
            parent_id = root_folder_id or self.root_folder_id
            parts = [p for p in file_path.replace("\\", "/").split("/") if p.strip()]

            if not parts:
                raise ValueError("Empty file path")

            *folders, file_name = parts

            # Create folder structure and store metadata for each folder
            for folder in folders:
                try:
                    query = (
                        f"name='{folder}' and mimeType='application/vnd.google-apps.folder' "
                        f"and trashed=false and '{parent_id}' in parents"
                    )
                    response = self.client.files().list(q=query, fields="files(id, name, mimeType, parents, createdTime, modifiedTime)").execute()

                    if response.get("files"):
                        folder_data = response["files"][0]
                        parent_id = folder_data["id"]
                    else:
                        # Create new folder
                        folder_metadata = {
                            "name": folder,
                            "mimeType": "application/vnd.google-apps.folder",
                            "parents": [parent_id]
                        }
                        folder_data = self.client.files().create(body=folder_metadata, fields="*").execute()
                        parent_id = folder_data["id"]

                    # Store metadata for this folder
                    folder_doc = {
                        "id": folder_data.get("id"),
                        "n": folder_data.get("name"),
                        "m": folder_data.get("mimeType"),
                        "p": folder_data.get("parents"),
                        "s": folder_data.get("starred", False),
                        "t": folder_data.get("trashed", False),
                        "ct": folder_data.get("createdTime"),
                        "mt": folder_data.get("modifiedTime"),
                        "e": self.email,
                        "c": "google"
                    }
                    logger.info(f"Saving metadata for folder: {folder}")
                    save_metadata(folder_doc)

                except Exception as e:
                    logger.error(f"Error creating/accessing folder {folder}: {str(e)}")
                    raise

            # Read file content
            file_bytes = file.file.read()
            mime_type = file.content_type or "application/octet-stream"

            # Upload the file
            return self.upload_file(file_name, file_bytes, mime_type, parent_id)
        except Exception as e:
            logger.error(f"Failed to upload file with path {file_path}: {str(e)}")
            raise ValueError(f"Failed to upload file: {str(e)}")
