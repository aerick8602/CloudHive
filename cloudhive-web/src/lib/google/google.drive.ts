import { google, drive_v3 } from "googleapis";
import { Readable } from "stream";
import { createOAuthClient } from "./google.client";

import { updateAccount } from "@/model/account.model";
import { DriveItem, saveDriveItem } from "@/model/drive.model";

export class GoogleDrive {
  private email: string;
  private drive: drive_v3.Drive;
  private rootFolderId: string | null = null;

  constructor(email: string, rootFolderId?: string) {
    this.email = email;
    this.rootFolderId = rootFolderId ?? null;
    this.drive = this.drive = {} as drive_v3.Drive;
  }

  async initializeClient() {
    try {
      this.drive = await createOAuthClient(this.email); // Await the OAuth client creation

      //Ensure Root folder is Set Up

      const { data } = await this.drive.files.list({
        q: "name='CloudHive' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: "files(id)",
        spaces: "drive",
      });

      if (data.files?.length) {
        this.rootFolderId = data.files[0].id!;
      } else {
        const { data: folder } = await this.drive.files.create({
          requestBody: {
            name: "CloudHive",
            mimeType: "application/vnd.google-apps.folder",
          },
          fields: "id",
        });
        this.rootFolderId = folder.id!;
      }

      await updateAccount(this.email, { rf: this.rootFolderId });
    } catch (error) {
      console.error("Failed to initialize Google Drive client:", error);
      throw error;
    }
  }

  private ensureDriveInitialized() {
    if (!this.drive) {
      throw new Error(
        "Google Drive client not initialized. Call initializeClient() first."
      );
    }
  }

  private async resolveFileBuffer(file: any): Promise<Buffer> {
    if (file instanceof Buffer) return file;
    if (file.buffer) return file.buffer;
    if (file instanceof Readable) {
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        file.on("data", (chunk: Buffer) => chunks.push(chunk));
        file.on("end", () => resolve(Buffer.concat(chunks)));
        file.on("error", reject);
      });
    }
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
    if (typeof file === "object") {
      if (file.raw) return file.raw;
      if (file.data) return Buffer.from(file.data);
    }
    throw new Error("Unsupported file type");
  }

  private async storeFolderMetadata(folderId: string) {
    try {
      const { data } = await this.drive.files.get({
        fileId: folderId,
        fields: "*", // Attempt to fetch all available fields
      });

      // Log the entire response data
      console.log("Folder Metadata:", data);

      // Construct the folder document
      const folderDoc: DriveItem = {
        id: data.id!,
        e: this.email,
        n: data.name!,
        m: data.mimeType!,
        p: data.parents || [],
        s: data.starred || false,
        t: data.trashed || false,
        ct: data.createdTime!,
        mt: data.modifiedTime!,
      };

      // Save the folder metadata to the database
      await saveDriveItem(folderDoc);
    } catch (error) {
      console.error("Failed to store folder metadata:", error);
    }
  }

  private async waitForThumbnail(
    fileId: string,
    retries = 5,
    delay = 2000
  ): Promise<drive_v3.Schema$File | null> {
    for (let i = 0; i < retries; i++) {
      try {
        const { data } = await this.drive.files.get({
          fileId,
          fields: "*",
        });

        if (data.thumbnailLink) {
          console.log("Thumbnail found for file:", data);
          return data;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (error) {
        console.error(`Thumbnail fetch failed (attempt ${i + 1}):`, error);
      }
    }

    // Return null if no thumbnail found after retries
    console.log("No thumbnail found after retries.");
    return null;
  }

  private async storeFileMetadata(fileId: string) {
    try {
      const fileData = await this.waitForThumbnail(fileId);
      if (!fileData) return;

      const fileDoc: DriveItem = {
        id: fileData.id!,
        e: this.email!,
        n: fileData.name!,
        m: fileData.mimeType!,
        p: fileData.parents || [],
        tl: fileData.thumbnailLink || undefined,
        wvl: fileData.webViewLink || undefined,
        wcl: fileData.webContentLink || undefined,
        s: fileData.starred || false,
        t: fileData.trashed || false,
        q: fileData.quotaBytesUsed
          ? Number(fileData.quotaBytesUsed)
          : undefined,
        ct: fileData.createdTime!,
        mt: fileData.modifiedTime!,
      };

      await saveDriveItem(fileDoc);
    } catch (error) {
      console.error("Failed to store file metadata:", error);
    }
  }

  async createFolder(name: string, parentId?: string) {
    try {
      this.ensureDriveInitialized();

      const { data } = await this.drive.files.create({
        requestBody: {
          name,
          mimeType: "application/vnd.google-apps.folder",
          parents: parentId ? [parentId] : undefined,
        },
        fields: "id",
      });

      const folderId = data.id!;
      await this.storeFolderMetadata(folderId);

      return folderId;
    } catch (error) {
      console.error("Failed to create folder:", error);
      throw error;
    }
  }

  async uploadFile(
    name: string,
    file: any,
    mimeType: string,
    parentId?: string
  ) {
    try {
      this.ensureDriveInitialized();

      const fileBuffer = await this.resolveFileBuffer(file);

      const { data } = await this.drive.files.create({
        requestBody: {
          name,
          parents: parentId ? [parentId] : undefined,
        },
        media: {
          mimeType,
          body: Readable.from(fileBuffer),
        },
        fields: "id",
      });

      const fileId = data.id!;
      this.storeFileMetadata(fileId).catch(console.error);

      return fileId;
    } catch (error) {
      console.error("Failed to upload file:", error);
      throw error;
    }
  }

  async uploadFolderWithFiles(
    folderName: string,
    files: Record<string, any>,
    parentId: string,
    onProgress?: (fileName: string, fileSize: string) => void
  ) {
    try {
      this.ensureDriveInitialized();

      const rootFolderId = this.rootFolderId;
      if (!rootFolderId) {
        throw new Error("CloudHive root folder not initialized");
      }

      const folderIds: Record<string, string> = { "": rootFolderId };

      for (const filePath of Object.keys(files)) {
        const parts = filePath.split(/[\\/]/).filter(Boolean);
        let currentPath = "";

        for (let i = 0; i < parts.length - 1; i++) {
          const folderName = parts[i];
          currentPath = currentPath
            ? `${currentPath}/${folderName}`
            : folderName;

          if (!folderIds[currentPath]) {
            const parentPath = currentPath.substring(
              0,
              currentPath.lastIndexOf("/")
            );
            const parentFolderId = folderIds[parentPath] || rootFolderId;

            const folderId = await this.createFolder(
              folderName,
              parentFolderId
            );
            folderIds[currentPath] = folderId;
          }
        }
      }

      for (const [filePath, fileData] of Object.entries(files)) {
        const parts = filePath.split(/[\\/]/).filter(Boolean);
        const fileName = parts.pop()!;
        const folderPath = parts.join("/");
        const parentFolderId = folderIds[folderPath] || rootFolderId;

        const fileBuffer = await this.resolveFileBuffer(fileData);

        await this.uploadFile(
          fileName,
          fileBuffer,
          fileData.mimetype,
          parentFolderId
        );

        if (onProgress) {
          onProgress(fileName, this.formatFileSize(fileBuffer.length));
        }
      }
    } catch (error) {
      console.error("Failed to upload folder with files:", error);
      throw error;
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  public getRootFolderId() {
    return this.rootFolderId;
  }
}
