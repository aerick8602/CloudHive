import os
from fastapi import APIRouter, Request, Response, Depends, HTTPException
from pydantic import BaseModel
from firebase_admin import auth, credentials, initialize_app, _apps
from datetime import datetime
from fastapi.responses import JSONResponse
from firebase_admin import auth, exceptions
# Firebase initialization
if not _apps:
    cred = credentials.Certificate("app/resources/firebase/cloudhive-e6fa5-firebase-adminsdk-fbsvc-d4e152d9a4.json")
    initialize_app(cred)

router = APIRouter(prefix="/auth", tags=["authentication"])


# ----------- Models ----------- 
class TokenData(BaseModel):
    idToken: str

# ----------- Helper Functions -----------

def decode_id_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print("Firebase token verification failed:", e)
        raise HTTPException(status_code=401, detail="Invalid ID token")

def create_session_cookie(id_token: str):
    try:
        return auth.create_session_cookie(id_token, expires_in=21600)
    except Exception:
        raise HTTPException(status_code=401, detail="Could not create session cookie")

def get_current_user(request: Request):
    session_cookie = request.cookies.get("CLOUDHIVE_SESSION")
    if not session_cookie:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        decoded = auth.verify_session_cookie(session_cookie, check_revoked=True)
        # Check if user still exists
        auth.get_user(decoded["uid"])
        return decoded
    except auth.UserNotFoundError:
        raise HTTPException(status_code=401, detail="User has been deleted")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

def clear_session_cookie(response: Response):
    response.delete_cookie("CLOUDHIVE_SESSION")

# ----------- Routes -----------

@router.post("/create-session")
async def session_login(data: TokenData):
    # Get the ID token sent by the client
    id_token = data.idToken
    expires_in = datetime.timedelta(days=5)
    
    try:
        # Create the session cookie. This will also verify the ID token in the process.
        session_cookie = auth.create_session_cookie(id_token, expires_in=expires_in)
        
        # Set the expiration time for the session cookie
        expires = datetime.datetime.utcnow() + expires_in

        # Prepare the response
        response = JSONResponse(content={'status': 'success'})
        
        # Set cookie policy for session cookie
        response.set_cookie(
            'session', session_cookie, expires=expires, httponly=True, secure=True, samesite='None'
        )
        return response
    except exceptions.FirebaseError:
        raise HTTPException(status_code=401, detail="Failed to create a session cookie")


@router.get("/validate-session")
async def validate_session(request: Request):
    try:
        decoded = auth.verify_session_cookie(
            request.cookies.get("CLOUDHIVE_SESSION"), check_revoked=False
        )
        # auth.get_user(decoded["user_id"])  # Check user existence
        return Response(status_code=200)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or deleted session")

@router.post("/end-session")
async def session_logout(request: Request, response: Response, user=Depends(get_current_user)):
    clear_session_cookie(response)
    return {"message": "Logged out successfully"}
