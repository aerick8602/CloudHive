// lib/googleDrive.ts

import { google } from "googleapis";
import { createOAuthClient } from "./google.client"; // Import the createOAuthClient function

class GoogleDrive {
  private client: any;
  private rootFolderId: string;
  private email: string;

  constructor(email: string, rootFolderId: string) {
    this.email = email;
    this.rootFolderId = rootFolderId;
  }

  // Initialize the client using the access token
  async initializeClient() {
    this.client = await createOAuthClient(this.email); // Create Google OAuth client
  }

  async createFolder(name: string, parentId: string) {
    const metadata = {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    };

    const folder = await this.client.files.create({
      requestBody: metadata,
      fields: "id",
    });

    return folder.data.id;
  }

  async uploadFile(
    fileName: string,
    fileBytes: Buffer,
    mimeType: string,
    parentId: string
  ) {
    const fileMetadata = {
      name: fileName,
      parents: [parentId],
    };

    const media = {
      mimeType,
      body: fileBytes,
    };

    const uploaded = await this.client.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id",
    });

    const fileId = uploaded.data.id;

    // Refetch metadata and save it (simulated here)
    const uploadedMetadata = await this.client.files.get({
      fileId,
      fields: "*",
    });

    return uploadedMetadata.data;
  }

  async uploadFolderWithFiles(
    folderName: string,
    files: Record<string, any>,
    parentId: string
  ) {
    const folderId = await this.createFolder(folderName, parentId);

    for (const [filePath, fileData] of Object.entries(files)) {
      const relativePath = filePath.replace(`${folderName}/`, "");
      await this.uploadFileWithPath(relativePath, fileData, folderId);
    }

    return folderId;
  }

  async uploadFileWithPath(filePath: string, file: any, parentId: string) {
    const parts = filePath.split("/").filter((p) => p.trim());

    let currentParentId = parentId;

    for (const folder of parts.slice(0, -1)) {
      const query = `name='${folder}' and mimeType='application/vnd.google-apps.folder' and trashed=false and '${currentParentId}' in parents`;
      const res = await this.client.files.list({
        q: query,
        fields: "files(id, name)",
      });

      let folderId;
      if (res.data.files?.length > 0) {
        folderId = res.data.files[0].id;
      } else {
        folderId = await this.createFolder(folder, currentParentId);
      }

      currentParentId = folderId;
    }

    const fileName = parts[parts.length - 1];
    await this.uploadFile(fileName, file, file.mimetype, currentParentId);
  }
}

export default GoogleDrive;
