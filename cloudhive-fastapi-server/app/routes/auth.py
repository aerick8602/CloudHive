from fastapi import APIRouter, Request, Response, Depends, HTTPException
from pydantic import BaseModel
from firebase_admin import auth as firebase_auth, credentials
import firebase_admin
import os





# Initialize Firebase Admin if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate("app/firebase/cloudhive-e6fa5-firebase-adminsdk-fbsvc-d4e152d9a4.json")
    firebase_admin.initialize_app(cred)

router = APIRouter(prefix="/auth",tags=["Authentication"])

# Models
class TokenData(BaseModel):
    idToken: str

# ---------------- Session Login ----------------
@router.post("/creat-session")
async def session_login(data: TokenData, response: Response):
    try:
        decoded_token = firebase_auth.verify_id_token(data.idToken)
        expires_in = int(os.getenv("SESSION_COOKIE_MAX_AGE", 1209600))
        session_cookie = firebase_auth.create_session_cookie(data.idToken, expires_in=expires_in)

        response.set_cookie(
            key="session",
            value=session_cookie,
            max_age=expires_in,
            httponly=True,
            secure=False,  # Change to True in production
            samesite="Strict",
        )
        return {"message": "Session cookie set"}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid ID token")

# ---------------- Session Validator (FAST) ----------------
@router.get("/validate-session")
async def validate_session(request: Request):
    session_cookie = request.cookies.get("session")
    if not session_cookie:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        # Fast validation (no revocation check)
        firebase_auth.verify_session_cookie(session_cookie, check_revoked=False)
        return Response(status_code=200)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid session cookie")

# ---------------- Current User Info ----------------
def verify_session(request: Request):
    session_cookie = request.cookies.get("session")
    if not session_cookie:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        decoded = firebase_auth.verify_session_cookie(session_cookie, check_revoked=True)
        return decoded
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid session cookie")

# ---------------- Logout ----------------
@router.post("/end-session")
async def logout(request: Request, response: Response, user=Depends(verify_session)):
    try:
        if user:
            response.delete_cookie("session")
            return {"message": "Logged out successfully"}
        else:
            raise HTTPException(status_code=401, detail="Unauthorized")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to logout: {str(e)}")
