from app.oauth.google_oauth import get_google_auth_url, handle_google_callback
from fastapi import Request, BackgroundTasks

def get_auth_url(provider: str,primary:str):
    """ Return the OAuth URL for the given provider """
    if provider == "google":
        return get_google_auth_url(primary)
    else:
        return None

def handle_callback(provider: str, code: str,request: Request, background_tasks: BackgroundTasks):
    """ Handle OAuth callback for each provider """
    if provider == "google":
        return handle_google_callback(code,request,background_tasks)
    else:
        return {"error": "Unsupported provider"}
