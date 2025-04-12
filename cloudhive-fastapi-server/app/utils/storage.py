import json
import os
from app.utils.logger import logger  

ROOT_FOLDERS_FILE = "app/data/root_folders.json"

# Ensure the data directory exists
os.makedirs(os.path.dirname(ROOT_FOLDERS_FILE), exist_ok=True)


def load_root_folders():
    """Load root folder IDs from the JSON file."""
    if not os.path.exists(ROOT_FOLDERS_FILE):
        logger.warning("Root folders file not found. Returning an empty dictionary.")
        return {}

    try:
        with open(ROOT_FOLDERS_FILE, "r", encoding="utf-8") as file:
            return json.load(file)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to load root folders file: {e}")
        return {}


def save_root_folders(root_folders):
    """Save root folder IDs to the JSON file."""
    try:
        with open(ROOT_FOLDERS_FILE, "w", encoding="utf-8") as file:
            json.dump(root_folders, file, indent=4)
        logger.info("Root folders successfully saved.")
    except Exception as e:
        logger.error(f"Failed to save root folders: {e}")


def get_root_folder(provider, email):
    """Retrieve the root folder ID for a given provider and email."""
    provider_key = f"{provider}_{email}"
    root_folders = load_root_folders()
    return root_folders.get(provider_key)


def set_root_folder(provider, email, folder_id):
    """Store the root folder ID for a given provider and email."""
    provider_key = f"{provider}_{email}"
    root_folders = load_root_folders()
    root_folders[provider_key] = folder_id
    save_root_folders(root_folders)
    logger.info(f"Root folder set for {provider_key}: {folder_id}")


def remove_root_folder(provider, email):
    """Remove the stored root folder ID for a provider and email."""
    provider_key = f"{provider}_{email}"
    root_folders = load_root_folders()
    if provider_key in root_folders:
        del root_folders[provider_key]
        save_root_folders(root_folders)
        logger.info(f"Root folder removed for {provider_key}")
    else:
        logger.warning(f"No root folder found for {provider_key}")
