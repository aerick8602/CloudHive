import os
import json
from app.routes.quota import refresh_all_quotas
from fastapi import BackgroundTasks, Request
import jwt as pyjwt
from google_auth_oauthlib.flow import Flow
from app.utils.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from app.utils.logger import logger
from app.db.mongo import register_user, connect_account
from app.services.token import save_token

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

def get_google_auth_url(primary: str):
    """Generate Google OAuth URL with state parameter"""
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": ["http://localhost:8000/auth/google/callback"],
            }
        },
        scopes=GOOGLE_SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI,
    )


    state = json.dumps({"primary": primary}) 
    auth_url, _ = flow.authorization_url(
        prompt="consent",
        access_type="offline",  
        state=state 
    )

    return auth_url

def handle_google_callback(code: str, request: Request, background_tasks: BackgroundTasks):
    """Exchange authorization code for token and save it"""
    try:
        # Create the OAuth flow from config
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

        # Fetch the token using the provided code
        flow.fetch_token(code=code)
        creds = flow.credentials

        if not creds.id_token:
            raise ValueError("No ID token received from OAuth provider")

        # Decode the ID token to get user information
        id_token_data = pyjwt.decode(creds.id_token, options={"verify_signature": False})  # or set verify_signature=True to check JWT signature
        email = id_token_data.get("email")
        name = id_token_data.get("name")

        if not email:
            raise ValueError("Failed to retrieve email from OAuth provider")


        state = request.query_params.get("state")
        if state:
            try:
                
                state_data = json.loads(state)  
                primary_email = state_data.get("primary")  
                if primary_email:
                    logger.debug(f"Primary email: {primary_email}")
            except json.JSONDecodeError:
                logger.error(f"Failed to decode state: {state}")
                return {"error": "Failed to decode state", "details": state}
        else:
            primary_email = None

        if primary_email:
            is_new_user,user_id = register_user(name,primary_email)
            connect_account(user_id, email)
        else:
            is_new_user,user_id = register_user(name,email)


        background_tasks.add_task(save_token, user_id, "google", email, creds)

        return {"message": "Google account connected!", "email": email, "user_id": user_id}

    except ValueError as ve:
        logger.critical(f"Google OAuth authentication failed: {ve}")
        return {"error": "OAuth authentication failed", "details": str(ve)}
    except KeyError as ke:
        logger.critical(f"Unexpected response format from Google: {ke}")
        return {"error": "Unexpected response format from Google", "details": str(ke)}
    except pyjwt.ExpiredSignatureError as e:
        logger.critical(f"JWT signature expired during decoding: {e}")
        return {"error": "JWT signature expired", "details": str(e)}
    except pyjwt.DecodeError as e:
        logger.critical(f"Failed to decode JWT token: {e}")
        return {"error": "Failed to decode JWT", "details": str(e)}
    except Exception as e:
        logger.critical(f"An unexpected error occurred: {e}")
        return {"error": "An unexpected error occurred", "details": str(e)}
