import os
import json
from datetime import datetime, timezone
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from app.utils.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET  # Import from config
from app.utils.logger import logger  

TOKEN_DIR = "app/token/google"
os.makedirs(TOKEN_DIR, exist_ok=True)  # ✅ Ensure Google token directory exists


def load_google_token(email):
    """Load Google token data from file."""
    token_path = os.path.join(TOKEN_DIR, f"{email}.json")

    if not os.path.exists(token_path):
        logger.warning(f"🔸 Google token file not found for {email}")
        raise FileNotFoundError(f"Google token file not found for {email}")

    with open(token_path, "r") as token_file:
        return json.load(token_file)


def save_google_token(email, token_data):
    """Save updated token data for a Google account."""
    token_path = os.path.join(TOKEN_DIR, f"{email}.json")
    with open(token_path, "w") as token_file:
        json.dump(token_data, token_file, indent=4)

    logger.info(f"✅ Google tokens updated for {email}")


def is_google_token_expired(expiry):
    """Check if the access token is expired."""
    if not expiry:
        return True  # Assume expired if expiry is missing

    expiry_time = datetime.fromisoformat(expiry).replace(tzinfo=timezone.utc)
    return datetime.now(timezone.utc) >= expiry_time


def get_valid_google_token(email):
    """Get a valid access token for a Google account (refresh if necessary) and return both the token and data."""
    try:
        token_data = load_google_token(email)

        creds = Credentials(
            token=token_data["token"],
            refresh_token=token_data.get("refresh_token"),
            token_uri=token_data["token_uri"],
            client_id=GOOGLE_CLIENT_ID,
            client_secret=GOOGLE_CLIENT_SECRET,
            scopes=token_data.get("scopes", []),
        )

        # If token is expired, refresh it
        if is_google_token_expired(token_data.get("expiry")):
            logger.info(f"🔄 Refreshing Google token for {email}...")
            creds.refresh(Request())  # Refresh access token

            # Update token data
            token_data["token"] = creds.token
            token_data["expiry"] = creds.expiry.isoformat()

            # Save updated token
            save_google_token(email, token_data)
            logger.info(f"✅ Google token refreshed successfully for {email}")

        return token_data["token"], token_data  # ✅ Return both access token & full data

    except FileNotFoundError:
        logger.error(f"❌ No Google token found for {email}")
        return None, None
    except Exception as e:
        logger.error(f"❌ Failed to refresh Google token for {email}: {e}")
        return None, None
