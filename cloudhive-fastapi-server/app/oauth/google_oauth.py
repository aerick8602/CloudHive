import os
import json
from app.routes.quota import refresh_all_quotas
from fastapi import BackgroundTasks ,Request
import jwt as pyjwt 
from google_auth_oauthlib.flow import Flow
from app.utils.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from app.utils.logger import logger  

# Static values
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
os.makedirs(TOKEN_DIR, exist_ok=True)  

def get_google_auth_url():
    """Generate Google OAuth URL"""
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

    auth_url, _ = flow.authorization_url(
        prompt="consent",
        access_type="offline",  # Ensure refresh token is received
    )

    return auth_url


def handle_google_callback(code: str,request: Request,background_tasks: BackgroundTasks):
    """Exchange authorization code for token and save it"""
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

        # Decode JWT token to extract user email
        id_token_data = pyjwt.decode(creds.id_token, options={"verify_signature": False})  
        email = id_token_data.get("email")

        if not email:
            raise ValueError("Failed to retrieve email from OAuth provider")

        token_path = os.path.join(TOKEN_DIR, f"{email}.json")

        # Prepare token dictionary
        creds_dict = {
            "token": creds.token,
            "refresh_token": creds.refresh_token,
            "token_uri": creds.token_uri,
            "expiry": creds.expiry.isoformat() if creds.expiry else None,
            "scopes": creds.scopes
        }

        # ✅ Retain old refresh_token if not provided in new response
        if os.path.exists(token_path):
            with open(token_path, "r") as f:
                existing_data = json.load(f)
                creds_dict["refresh_token"] = existing_data.get("refresh_token", creds.refresh_token)

        # ✅ Save credentials securely
        with open(token_path, "w") as token_file:
            json.dump(creds_dict, token_file, indent=4)

        logger.debug(f"Successfully saved Google token for {email} 📧")


        # Trigger quota refresh as a background task after OAuth success
        # refresh_all_quotas()

        # Trigger quota refresh as a background task
        background_tasks.add_task(refresh_all_quotas)

        return {"message": "Google account connected! 🎉", "email": email}

    except ValueError as ve:
        logger.critical(f"Google OAuth authentication failed: {ve} ")
        return {"error": "OAuth authentication failed", "details": str(ve)}
    except KeyError as ke:
        logger.critical(f"Unexpected response format from Google: {ke} ")
        return {"error": "Unexpected response format from Google", "details": str(ke)}
    except pyjwt.ExpiredSignatureError as e:
        logger.critical(f"JWT signature expired during decoding: {e}")
        return {"error": "JWT signature expired", "details": str(e)}
    except pyjwt.DecodeError as e:
        logger.critical(f"Failed to decode JWT token: {e} 🛠️")
        return {"error": "Failed to decode JWT", "details": str(e)}
    except Exception as e:
        logger.critical(f"An unexpected error occurred: {e} ")
        return {"error": "An unexpected error occurred", "details": str(e)}
