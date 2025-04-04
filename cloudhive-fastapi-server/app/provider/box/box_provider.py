import os
import time
from boxsdk import OAuth2, Client
from services.box_token_service import get_valid_box_token
from app.utils.config import BOX_CLIENT_ID, BOX_CLIENT_SECRET  # Import from config


class BoxProvider:
    def __init__(self):
        """Initialize the BoxProvider."""
        self.client_id = BOX_CLIENT_ID
        self.client_secret = BOX_CLIENT_SECRET

    def get_box_client(self, email):
        """Authenticate and return a Box client for a given email."""
        try:
            access_token, token_data = get_valid_box_token(email)  # ✅ Load & refresh in one step

            if not access_token:
                raise ValueError(f"❌ Failed to get a valid access token for {email}")

            oauth = OAuth2(
                client_id=self.client_id,
                client_secret=self.client_secret,
                access_token=access_token,
                refresh_token=token_data.get("refresh_token"),
                store_tokens=lambda access, refresh: self._store_tokens(email, access, refresh)
            )

            return Client(oauth)  # ✅ Return authenticated Box client

        except ValueError as e:
            print(e)
            return None
        except Exception as e:
            print(f"❌ Failed to create Box client for {email}: {e}")
            return None

    def _store_tokens(self, email, access_token, refresh_token):
        """Update the token file when refreshed."""
        new_tokens = {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "expires_at": time.time() + 3600  # 1-hour expiration
        }
        from services.box_token_service import save_box_token
        save_box_token(email, access_token, refresh_token)
