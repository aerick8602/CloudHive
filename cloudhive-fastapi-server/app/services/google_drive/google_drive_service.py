import os
import io
import json
from fastapi import UploadFile
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.http import MediaIoBaseUpload

class GoogleDriveService:
    def __init__(self):
        pass

    def get_google_drive_service(self, email: str):
        """Get an authenticated Google Drive service for a specific email, refreshing the token if needed."""
        token_path = os.path.join("app/token/google", f"{email}.json")

        if not os.path.exists(token_path):
            raise Exception(f"❌ No Google Drive token found for {email}. Please authenticate first.")

        with open(token_path, "r") as token_file:
            token_data = json.load(token_file)

        creds = Credentials(
            token=token_data["token"],
            refresh_token=token_data.get("refresh_token"),
            token_uri=token_data["token_uri"],
            client_id=token_data["client_id"],
            client_secret=token_data["client_secret"],
            scopes=token_data["scopes"],
        )

        # Refresh token if expired
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
            token_data["token"] = creds.token  # Update with new access token

            # Save the updated token data back to the file
            with open(token_path, "w") as token_file:
                json.dump(token_data, token_file, indent=4)

        return build("drive", "v3", credentials=creds)
    

    def list_files(self, email: str, folder_id=None):
        """List files in a specific Google Drive folder, or only top-level files if no folder is specified."""
        service = self.get_google_drive_service(email)

        # Base query to exclude trashed files
        query = "trashed=false"

        if folder_id:
            query += f" and '{folder_id}' in parents"  # List files inside a specific folder
        else:
            query += " and 'root' in parents"  # Show only top-level files

        results = service.files().list(
            q=query,
            # fields="files(*)"
            fields = (
                "files(id, name, mimeType, fileExtension, parents, hasThumbnail, "
                "thumbnailLink, iconLink, owners(emailAddress, photoLink), "
                "webViewLink, webContentLink, size, starred, trashed, "
                "createdTime, modifiedTime)"
            )
        ).execute()
        files = results.get("files", [])

        # Manually add the provider field to each file
        for file in files:
            file["cloudProvider"] = "google"  # ✅ Include provider info

        return files


    def upload_file(self, email: str, file: UploadFile, folder_id: str = None):
        """Upload a file to Google Drive from an UploadFile object (FastAPI)."""
        service = self.get_google_drive_service(email)

        # Read file content into a BytesIO stream
        file_stream = io.BytesIO(file.file.read())

        # Prepare file metadata
        file_metadata = {"name": file.filename}
        if folder_id:
            file_metadata["parents"] = [folder_id]  # Upload to a specific folder

        # Create a MediaIoBaseUpload object
        media = MediaIoBaseUpload(file_stream, mimetype=file.content_type, resumable=True)

        # Upload file to Google Drive
        uploaded_file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields="id, name"
        ).execute()

        return f"✅ Uploaded '{uploaded_file.get('name')}' with ID: {uploaded_file.get('id')}"

