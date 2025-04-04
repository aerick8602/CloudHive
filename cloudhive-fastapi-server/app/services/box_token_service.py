import os
import json
import time
from boxsdk import OAuth2
from app.utils.config import BOX_CLIENT_ID, BOX_CLIENT_SECRET  # Import from config

TOKEN_DIR = "app/token/box"
os.makedirs(TOKEN_DIR, exist_ok=True)  # ✅ Ensure token directory exists


def load_box_token(email):
    """Load Box token data from file."""
    token_path = os.path.join(TOKEN_DIR, f"{email}.json")

    if not os.path.exists(token_path):
        raise FileNotFoundError(f"❌ Token file not found for {email} at {token_path}")

    with open(token_path, "r") as token_file:
        return json.load(token_file)


def save_box_token(email, access_token, refresh_token):
    """Save refreshed Box tokens."""
    token_path = os.path.join(TOKEN_DIR, f"{email}.json")

    new_tokens = {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "expires_at": time.time() + 3600  # 1-hour expiration
    }

    with open(token_path, "w") as token_file:
        json.dump(new_tokens, token_file, indent=4)
    
    print(f"✅ Box tokens updated for {email} at {token_path}")


def get_valid_box_token(email):
    """Get a valid Box access token (refresh if expired) and return both token and data."""
    try:
        token_data = load_box_token(email)

        # Check if token is expired
        if time.time() > token_data.get("expires_at", 0):
            print(f"🔄 Refreshing Box token for {email}...")

            oauth = OAuth2(
                client_id=BOX_CLIENT_ID,
                client_secret=BOX_CLIENT_SECRET,
                access_token=token_data["access_token"],
                refresh_token=token_data["refresh_token"],
                store_tokens=lambda access, refresh: save_box_token(email, access, refresh)
            )

            access_token, refresh_token = oauth.refresh(token_data["refresh_token"])
            save_box_token(email, access_token, refresh_token)
            print(f"✅ Box token refreshed for {email}")

            return access_token, token_data  # ✅ Return both access token & full data

        return token_data["access_token"], token_data  # ✅ Return valid token & token data

    except FileNotFoundError:
        print(f"❌ No token found for {email}")
        return None, None
    except Exception as e:
        print(f"❌ Failed to refresh Box token for {email}: {e}")
        return None, None
