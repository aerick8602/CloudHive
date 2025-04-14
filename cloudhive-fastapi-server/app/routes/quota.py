# app/routes/quota.py
from fastapi import APIRouter, HTTPException
from pathlib import Path
from app.utils.logger import logger
from app.provider.google_drive.google_drive_provider import GoogleDriveProvider
import json

router = APIRouter(prefix="/quota", tags=["Storage Quota"])


TOKEN_BASE_DIR = Path("app/token")
QUOTA_FILE_PATH = Path("app/data/quotas.json")
QUOTA_FILE_PATH.parent.mkdir(parents=True, exist_ok=True)

PROVIDERS = {
    "google": GoogleDriveProvider,
}

@router.get("/refresh")
def refresh_all_quotas():
    """Fetch latest quotas from all provider accounts and update quotas.json"""
    all_quotas = {}

    try:
        for provider_dir in TOKEN_BASE_DIR.iterdir():
            if not provider_dir.is_dir():
                continue

            provider_name = provider_dir.name
            ProviderClass = PROVIDERS.get(provider_name)

            if not ProviderClass:
                continue

            for token_file in provider_dir.glob("*.json"):
                email = token_file.stem
                key = f"{provider_name}_{email}"

                provider = ProviderClass(email)
                quota_data = provider.update_and_get_quota()
                all_quotas[key] = quota_data  # Save latest data
                logger.info(f"✅ Quota fetched for {key}")

        return {"quotas": all_quotas}

    except Exception as e:
        logger.exception("❌ Failed to process quota info")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/cached")
async def get_cached_quotas():
    """
    Return quota data stored in quotas.json (no API calls)
    """
    if not QUOTA_FILE_PATH.exists():
        raise HTTPException(status_code=404, detail="Quota data not found")

    try:
        with open(QUOTA_FILE_PATH, "r") as f:
            quotas = json.load(f)
        return {"quotas": quotas}

    except Exception as e:
        logger.exception("❌ Failed to read stored quota info")
        raise HTTPException(status_code=500, detail="Internal Server Error")
