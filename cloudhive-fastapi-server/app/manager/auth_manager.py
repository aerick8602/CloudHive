from app.oauth.google_oauth import get_google_auth_url, handle_google_callback


def get_auth_url(provider: str):
    """ Return the OAuth URL for the given provider """
    if provider == "google":
        return get_google_auth_url()
    else:
        return None

def handle_callback(provider: str, code: str):
    """ Handle OAuth callback for each provider """
    if provider == "google":
        return handle_google_callback(code)
    else:
        return {"error": "Unsupported provider"}
