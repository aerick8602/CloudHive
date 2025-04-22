import os
from fastapi import APIRouter, Request, Query
from fastapi.responses import RedirectResponse
from fastapi import BackgroundTasks
from typing import Optional
from app.manager.auth_manager import get_auth_url, handle_callback

router = APIRouter(prefix="/cloud", tags=["Cloud Storage Accounts"])

@router.get("/{provider}/login")
async def provider_login(provider: str, primary: Optional[str] = None):
    """ Redirect user to OAuth login for the selected provider """
    auth_url = get_auth_url(provider, primary)
    if not auth_url:
        return {"error": "Unsupported provider"}
    return {"auth_url": auth_url}


@router.get("/{provider}/callback")
async def provider_callback(provider: str, request: Request,background_tasks: BackgroundTasks):
    """ Handle OAuth callback for multiple providers """
    code = request.query_params.get("code")
    if not code:
        return {"error": "Authorization code not found"}
    
    result = handle_callback(provider, code,request,background_tasks)
    # if "error" in result:
    #     return RedirectResponse(url="/error")

    # frontend_url = request.headers.get("origin", "http://localhost:3000")
    # return RedirectResponse(url=f"{frontend_url}/")
    return result

@router.get("/accounts")
def list_all_accounts():
    """ List all linked accounts across all providers """
    all_accounts = {}

    if os.path.exists("app/token"):
        for provider in os.listdir("app/token"):
            provider_dir = os.path.join("app/token", provider)
            
            if os.path.isdir(provider_dir):
                accounts = []
                
                # Loop through token files and extract email/ID
                for filename in os.listdir(provider_dir):
                    if filename.endswith(".json"):
                        accounts.append(filename.replace(".json", ""))  # Extract email/ID
                
                # Add to result only if accounts exist
                if accounts:
                    all_accounts[provider] = accounts

    return {"accounts": all_accounts}


@router.delete("/remove")
def remove_account(provider: str = Query(...), email: str = Query(...)):
    """ Remove a specific account by provider & email """
    token_path = os.path.join("app/token", provider, f"{email}.json")
    
    if os.path.exists(token_path):
        os.remove(token_path)
        return {"message": f"Removed {email} from {provider}"}
    
    return {"error": "Account not found"}
