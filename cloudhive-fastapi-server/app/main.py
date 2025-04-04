from fastapi import FastAPI
from fastapi.routing import APIRouter
from app.routes import auth

app = FastAPI(title="CloudHive FastAPI Server")


router = APIRouter(tags=["Default"])

@router.get("/")
async def root():
    return {"message": "Welcome to CloudHive Server 🚀"}

# routes
app.include_router(router) 
app.include_router(auth.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
