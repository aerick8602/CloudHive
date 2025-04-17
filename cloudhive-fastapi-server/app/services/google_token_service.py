import os
import json
from datetime import datetime, timezone
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from app.utils.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET 
from app.utils.logger import logger  

TOKEN_DIR = "app/token/google"
os.makedirs(TOKEN_DIR, exist_ok=True)


def load_google_token(email):
    """Load Google token data from file."""
    token_path = os.path.join(TOKEN_DIR, f"{email}.json")

    if not os.path.exists(token_path):
        logger.warning(f"❓ Google token file not found for {email}.")
        raise FileNotFoundError(f"Google token file not found for {email}")

    with open(token_path, "r") as token_file:
        logger.debug(f"🔍 Token file found. Loading Google token for {email}.")
        return json.load(token_file)


def save_google_token(email, token_data):
    """Save updated token data for a Google account."""
    token_path = os.path.join(TOKEN_DIR, f"{email}.json")
    with open(token_path, "w") as token_file:
        json.dump(token_data, token_file, indent=4)

    logger.info(f"✅ Google tokens successfully updated for {email}.")


def is_google_token_expired(expiry):
    """Check if the access token is expired."""
    if not expiry:
        logger.warning("⚠️ Token expiry date is missing. Assuming the token is expired.")
        return True 

    expiry_time = datetime.fromisoformat(expiry).replace(tzinfo=timezone.utc)
    expired = datetime.now(timezone.utc) >= expiry_time
    if expired:
        logger.warning("⚠️ Token has expired.")
    return expired


def get_valid_google_token(email):
    """Get a valid access token for a Google account (refresh if necessary) and return both the token and data."""
    try:
        logger.trace(f"🔄 Attempting to retrieve a valid Google token for {email}...")
        token_data = load_google_token(email)

        creds = Credentials(
            token=token_data["token"],
            refresh_token=token_data.get("refresh_token"),
            token_uri=token_data["token_uri"],
            client_id=GOOGLE_CLIENT_ID,
            client_secret=GOOGLE_CLIENT_SECRET,
            scopes=token_data.get("scopes", []),
        )

        
        if is_google_token_expired(token_data.get("expiry")):
            logger.info(f"🔄 Refreshing Google token for {email}...")
            creds.refresh(Request())  # Refresh access token

            # Update token data
            token_data["token"] = creds.token
            token_data["expiry"] = creds.expiry.isoformat()

            # Save updated token
            save_google_token(email, token_data)
            logger.info(f"✅ Google token refreshed successfully for {email}.")

        return token_data["token"], token_data  

    except FileNotFoundError:
        logger.error(f"❌ Google token file not found for {email}.")
        return None, None
    except Exception as e:
        logger.error(f"❌ Failed to refresh Google token for {email}: {e}")
        return None, None
