import os
import json
import jwt as pyjwt  # Ensure using PyJWT
from dotenv import load_dotenv
from google_auth_oauthlib.flow import Flow

# Load environment variables
load_dotenv()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

# Hardcoded static values
GOOGLE_AUTH_URI = "https://accounts.google.com/o/oauth2/auth"
GOOGLE_TOKEN_URI = "https://oauth2.googleapis.com/token"
GOOGLE_REDIRECT_URI = "http://localhost:8000/auth/google/callback"
GOOGLE_SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid"
]

TOKEN_DIR = "app/token/google"
os.makedirs(TOKEN_DIR, exist_ok=True)  # Ensure directory exists

def get_google_auth_url():
    """ Generate Google OAuth URL """
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": GOOGLE_AUTH_URI,
                "token_uri": GOOGLE_TOKEN_URI,
                "redirect_uris": [GOOGLE_REDIRECT_URI],
            }
        },
        scopes=GOOGLE_SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI,
    )

    auth_url, _ = flow.authorization_url(prompt="consent", access_type="offline")
    return auth_url

def handle_google_callback(code: str):
    """ Exchange authorization code for token and save it """
    try:
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "auth_uri": GOOGLE_AUTH_URI,
                    "token_uri": GOOGLE_TOKEN_URI,
                    "redirect_uris": [GOOGLE_REDIRECT_URI],
                }
            },
            scopes=GOOGLE_SCOPES,
            redirect_uri=GOOGLE_REDIRECT_URI,
        )

        flow.fetch_token(code=code)
        creds = flow.credentials

        if not creds.id_token:
            raise ValueError("No ID token received from OAuth provider")

        # Decode JWT token to get user email
        id_token_data = pyjwt.decode(creds.id_token, options={"verify_signature": False})  
        email = id_token_data.get("email")

        if not email:
            raise ValueError("Failed to retrieve email from OAuth provider")

        # ✅ Convert credentials to a serializable dictionary
        creds_dict = {
            "token": creds.token,
            "refresh_token": creds.refresh_token,
            "token_uri": creds.token_uri,
            "expiry": creds.expiry.isoformat() if creds.expiry else None
        }

        token_path = os.path.join(TOKEN_DIR, f"{email}.json")

        # ✅ Save credentials securely
        with open(token_path, "w") as token_file:
            json.dump(creds_dict, token_file, indent=4)

        print(f"✅ Token saved for {email} at {token_path}")

        return {"message": "Google account connected!", "email": email}

    except Exception as e:
        return {"error": "OAuth authentication failed", "details": str(e)}
