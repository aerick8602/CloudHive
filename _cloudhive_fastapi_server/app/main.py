from fastapi import FastAPI, HTTPException, APIRouter,Query
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI(title="CloudHive FastAPI Server")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to CloudHive Server 🚀"}

# Register route modules
from app.routes import auth
app.include_router(auth.router)


# Uvicorn entrypoint
if __name__ == "__main__":
    import uvicorn
    try:
        uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True, log_config=None)
    except Exception as e:
        print(f"Error starting server: {e}")

