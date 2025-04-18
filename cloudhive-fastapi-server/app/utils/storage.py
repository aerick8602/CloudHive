import json
import os
from app.utils.logger import logger  

ROOT_FOLDERS_FILE = "app/data/root_folders.json"

# Ensure the data directory exists
os.makedirs(os.path.dirname(ROOT_FOLDERS_FILE), exist_ok=True)


def load_root_folders():
    """Load root folder IDs from the JSON file."""
    if not os.path.exists(ROOT_FOLDERS_FILE):
        logger.warning("No root folders file found. Returning an empty dictionary for now.")
        return {}

    try:
        with open(ROOT_FOLDERS_FILE, "r", encoding="utf-8") as file:
            logger.debug("Successfully loaded root folders file.")
            return json.load(file)
    except json.JSONDecodeError as e:
        logger.error(f"Error loading root folders file. Could not decode JSON: {e}")
        return {}


def save_root_folders(root_folders):
    """Save root folder IDs to the JSON file."""
    try:
        with open(ROOT_FOLDERS_FILE, "w", encoding="utf-8") as file:
            json.dump(root_folders, file, indent=4)
        logger.debug("Root folder data saved successfully to the file.")
    except Exception as e:
        logger.error(f"Failed to save root folders to the file. Error: {e}")


def get_root_folder(provider, email):
    """Retrieve the root folder ID for a given provider and email."""
    provider_key = f"{provider}_{email}"
    root_folders = load_root_folders()
    root_folder_id = root_folders.get(provider_key)
    if root_folder_id:
        logger.info(f"Found root folder ID for {provider_key}: {root_folder_id}")
    else:
        logger.warning(f"Root folder not found for {provider_key}.")
    return root_folder_id


def set_root_folder(provider, email, folder_id):
    """Store the root folder ID for a given provider and email."""
    provider_key = f"{provider}_{email}"
    root_folders = load_root_folders()
    root_folders[provider_key] = folder_id
    save_root_folders(root_folders)
    logger.debug(f"Successfully set the root folder for {provider_key} with ID: {folder_id}")


def remove_root_folder(provider, email):
    """Remove the stored root folder ID for a provider and email."""
    provider_key = f"{provider}_{email}"
    root_folders = load_root_folders()
    if provider_key in root_folders:
        del root_folders[provider_key]
        save_root_folders(root_folders)
        logger.debug(f"Successfully removed the root folder for {provider_key}.")
    else:
        logger.warning(f"No root folder found for {provider_key}. No action taken.")
