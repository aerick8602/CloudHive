import os
from fastapi import APIRouter, Request, Response, Depends, HTTPException
from pydantic import BaseModel
from firebase_admin import auth, credentials, initialize_app, _apps

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
    session_cookie = request.cookies.get("session")
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
    response.delete_cookie("session")

# ----------- Routes -----------

@router.post("/create-session")
async def login(data: TokenData, response: Response):
    print("Received ID token:", data.idToken[:20], "...")

    try:
        decoded_token = decode_id_token(data.idToken)
        print("Decoded token email:", decoded_token.get("email"))
    except Exception as e:
        print("Token verification failed:", e)
        raise HTTPException(status_code=401, detail="Invalid ID token")

    session_cookie = create_session_cookie(data.idToken)
    print("Session cookie generated")

    ENV = os.getenv("ENV", "development")
    IS_PROD = ENV == "production"
    SESSION_TTL = int(os.getenv("SESSION_TTL", 86400))

    response.set_cookie(
        key="session",
        value=session_cookie,
        max_age=SESSION_TTL,
        httponly=True,
        secure=IS_PROD,
        samesite="None" if IS_PROD else "Lax"
    )

    return {"message": "Session cookie set"}
@router.get("/validate-session")
async def validate_session(request: Request):
    try:
        decoded = auth.verify_session_cookie(
            request.cookies.get("session"), check_revoked=False
        )
        auth.get_user(decoded["user_id"])  # Check user existence
        return Response(status_code=200)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or deleted session")

@router.post("/end-session")
async def logout(request: Request, response: Response, user=Depends(get_current_user)):
    clear_session_cookie(response)
    return {"message": "Logged out successfully"}
