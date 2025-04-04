import os
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from services.google_token_service import get_valid_google_token
from app.utils.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET


class GoogleDriveProvider:
    def __init__(self):
        """Initialize the Google Drive provider."""
        self.client_id = GOOGLE_CLIENT_ID
        self.client_secret = GOOGLE_CLIENT_SECRET

    def get_google_drive_service(self, email: str):
        """Get an authenticated Google Drive service for a specific email using a valid token."""
        try:
            access_token, token_data = get_valid_google_token(email)  # ✅ Load & refresh in one step

            if not access_token:
                raise ValueError(f"❌ Failed to get a valid access token for {email}")

            creds = Credentials(
                token=access_token,
                refresh_token=token_data.get("refresh_token"),
                token_uri=token_data.get("token_uri"),
                client_id=self.client_id,
                client_secret=self.client_secret,
            )

            return build("drive", "v3", credentials=creds)  # ✅ Return authenticated Google Drive service

        except ValueError as e:
            print(e)
            return None
        except Exception as e:
            print(f"❌ Failed to create Google Drive service for {email}: {e}")
            return None
