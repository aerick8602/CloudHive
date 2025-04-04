import os
import json
import time
from boxsdk import OAuth2, Client
from app.utils.config import BOX_CLIENT_ID, BOX_CLIENT_SECRET

# Hardcoded static values
BOX_REDIRECT_URI = "http://localhost:8000/auth/box/callback"


TOKEN_DIR = "app/token/box"
os.makedirs(TOKEN_DIR, exist_ok=True)  # ✅ Ensure base directory exists


def store_tokens(access_token, refresh_token, email):
    """Store Box tokens in {email}.json inside token/box/"""
    token_path = os.path.join(TOKEN_DIR, f"{email}.json")
    
    token_data = {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "expires_at": time.time() + 3600  # Box access tokens usually expire in 1 hour
    }
    
    with open(token_path, "w") as token_file:
        json.dump(token_data, token_file, indent=4)
    
    print(f"✅ Box tokens saved at {token_path}")


def get_box_auth_url():
    """Generate Box OAuth authorization URL."""
    oauth = OAuth2(client_id=BOX_CLIENT_ID, client_secret=BOX_CLIENT_SECRET, store_tokens=None)
    auth_url, csrf_token = oauth.get_authorization_url(BOX_REDIRECT_URI)
    return auth_url, csrf_token

def handle_box_callback(auth_code):
    """Handle Box OAuth callback, authenticate user, and store tokens."""
    try:
        oauth = OAuth2(client_id=BOX_CLIENT_ID, client_secret=BOX_CLIENT_SECRET, store_tokens=None)
        access_token, refresh_token = oauth.authenticate(auth_code)
        
        # Get user email
        client = Client(oauth)
        user_info = client.user().get()
        email = user_info.login  # This is the user's email in Box
        
        if not email:
            return {"error": "Failed to retrieve user email from Box"}

        # Save tokens
        store_tokens(access_token, refresh_token, email)

        return {"message": "Box authentication successful", "email": email}
    
    except Exception as e:
        return {"error": "Box authentication failed", "details": str(e)}