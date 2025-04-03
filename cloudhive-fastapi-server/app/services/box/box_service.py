from boxsdk import OAuth2, Client
import os
import json
import time

class BoxService:
    def __init__(self):
        pass  
    def _authenticate(self, email):
        """Authenticate using stored tokens or refresh if needed."""
        token_file_path = os.path.join("app", "token", "box", f"{email}.json")

        if not os.path.exists(token_file_path):
            raise FileNotFoundError(f"❌ Token file not found at {token_file_path}")

        with open(token_file_path, 'r') as file:
            token_data = json.load(file)

        oauth = OAuth2(
            client_id=os.getenv("BOX_CLIENT_ID"),
            client_secret=os.getenv("BOX_CLIENT_SECRET"),
            access_token=token_data.get("access_token"),
            refresh_token=token_data.get("refresh_token"),
            store_tokens=lambda access, refresh: self._store_tokens(email, access, refresh)
        )

        if time.time() > token_data.get("expires_at", 0):
            print("🔄 Token expired, refreshing...")
            oauth.refresh(token_data["refresh_token"])

        return Client(oauth)

    def _store_tokens(self, email, access_token, refresh_token):
        """Update the token file when refreshed."""
        token_file_path = os.path.join("app", "token", "box", f"{email}.json")
        new_tokens = {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "expires_at": time.time() + 3600  # 1-hour expiration
        }
        with open(token_file_path, 'w') as file:
            json.dump(new_tokens, file)

    def get_file_info(self, email, file_id):
        """Retrieve file metadata using the Box SDK."""
        client = self._authenticate(email)
        file_info = client.file(file_id).get()
        return {
            "name": file_info.name,
            "size": file_info.size,
            "created_at": file_info.created_at
        }

    def upload_file(self, email, file, folder_id='0'):
        """Upload a file to Box."""
        client = self._authenticate(email)
        folder = client.folder(folder_id)
        uploaded_file = folder.upload_stream(file.file, file.filename)
        return {"file_id": uploaded_file.id, "name": uploaded_file.name}

    def list_files(self, email, folder_id="0"):
        """List all metadata of files in a folder."""
        print(f"📂 Debug: Listing files for user {email} in folder {folder_id}")

        try:
            client = self._authenticate(email)
            print("✅ Debug: Successfully authenticated with Box SDK.")

            if not folder_id:
                print("⚠️ Warning: folder_id is None or empty, setting to root ('0').")
                folder_id = "0"

            items = client.folder(folder_id).get_items()
            files_metadata = []

            for item in items:
                if item.type == "file":
                    file_info = client.file(item.id).get()  # Fetch full metadata
                    
                    # Manually extract all available metadata
                    file_data = {
                        "id": file_info.id,
                        "type": file_info.type,
                        "name": file_info.name,
                        "size": file_info.size,
                        "created_at": file_info.created_at,
                        "modified_at": file_info.modified_at,
                        "created_by": {
                            "id": file_info.created_by.id,
                            "name": file_info.created_by.name,
                            "login": file_info.created_by.login
                        },
                        "owned_by": {
                            "id": file_info.owned_by.id,
                            "name": file_info.owned_by.name,
                            "login": file_info.owned_by.login
                        },
                        "description": file_info.description,
                        "path_collection": [
                            {"id": entry.id, "name": entry.name} for entry in file_info.path_collection['entries']
                        ],
                        "shared_link": file_info.shared_link.url if file_info.shared_link else None,
    
                    }
                    
                    files_metadata.append(file_data)

            print(f"✅ Debug: Successfully fetched {len(files_metadata)} files from folder {folder_id}")
            return files_metadata  # Returns JSON-friendly list of full file details

        except Exception as e:
            print(f"❌ Error in list_files: {e}")
            return {"error": str(e)}




    def download_file(self, email, file_id):
        """Download a file from Box."""
        client = self._authenticate(email)
        file = client.file(file_id).get()
        file_content = client.file(file_id).content()
        
        file_path = os.path.join("downloads", file.name)
        os.makedirs("downloads", exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(file_content)

        return file_path

    def delete_file(self, email, file_id):
        """Delete a file from Box."""
        client = self._authenticate(email)
        client.file(file_id).delete()
        return {"message": "File deleted successfully"}
