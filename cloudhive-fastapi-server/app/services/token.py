import os
import json
from app.utils.logger import logger

def save_token(user_id: str, cloud_provider: str, email: str, creds):
    try:
        # Save the token in the appropriate directory
        user_token_dir = os.path.join("app", "resources", user_id, "token", cloud_provider)
        os.makedirs(user_token_dir, exist_ok=True)
        token_path = os.path.join(user_token_dir, f"{email}.json")

        creds_dict = {
            "token": creds.token,
            "refresh_token": creds.refresh_token,
            "token_uri": creds.token_uri,
            "expiry": creds.expiry.isoformat() if creds.expiry else None,
            "scopes": creds.scopes
        }

        # Save the token to the file
        with open(token_path, "w") as token_file:
            json.dump(creds_dict, token_file, indent=4)

        logger.debug(f"Successfully saved {cloud_provider} token for {email}")
        
    except Exception as e:
        logger.critical(f"Failed to save token for {email}: {e}")
