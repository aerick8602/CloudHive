import { NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";
import { Readable } from "stream";
import { connectToDatabase } from "@/lib/db/mongo.config";
import { drive_v3 } from "googleapis";
import { Hive, FileData } from "@/app/interface";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const { files, email, isFolder, currentParentId } = await request.json();
    const drive = await createOAuthClient(email);

    const { db } = await connectToDatabase();
    const hiveCollection = db.collection("hive");

    const folderIds = new Map<string, string>();
    const uploadedMetadata: Hive[] = [];

    // Create or find the top-level CloudHive folder
    const getOrCreateCloudHiveRoot = async (): Promise<string> => {
      const res = await drive.files.list({
        q: `name = 'CloudHive' and mimeType = 'application/vnd.google-apps.folder' and 'root' in parents and trashed = false`,
        fields: "files(id, name)",
      });

      if (res.data.files && res.data.files.length > 0) {
        return res.data.files[0].id!;
      }

      const createRes = await drive.files.create({
        requestBody: {
          name: "CloudHive",
          mimeType: "application/vnd.google-apps.folder",
          parents: ["root"],
        },
        fields: "id",
      });

      return createRes.data.id!;
    };

    const cloudHiveRootId = await getOrCreateCloudHiveRoot();
    folderIds.set("", cloudHiveRootId);

    // Recursive folder creation utility
    const getOrCreateFolder = async (path: string): Promise<string> => {
      if (folderIds.has(path)) return folderIds.get(path)!;

      const parts = path.split("/");
      const parentPath = parts.slice(0, -1).join("/");
      const folderName = parts[parts.length - 1];
      const parentId = await getOrCreateFolder(parentPath);

      const res = await drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: "application/vnd.google-apps.folder",
          parents: [parentId],
        },
        fields:
          "id, name, mimeType, parents, createdTime, modifiedTime, starred, trashed, permissions",
      });

      const folderId = res.data.id!;
      folderIds.set(path, folderId);

      // Extract permissions from the folder metadata
      const permissions =
        res.data.permissions?.map((permission) => ({
          pid: permission.id!,
          pt: permission.type!,
          pe: permission.emailAddress,
          pr: permission.role!,
        })) ?? [];

      uploadedMetadata.push({
        id: folderId,
        e: email,
        n: res.data.name!,
        m: res.data.mimeType!,
        p: res.data.parents!,
        s: res.data.starred!,
        t: res.data.trashed!,
        ct: res.data.createdTime!,
        mt: res.data.modifiedTime!,
        permissions,
      });

      return folderId;
    };

    if (currentParentId) {
      folderIds.set("", currentParentId);
    }

    for (const file of files as FileData[]) {
      const path = file.path;
      const parts = path.split("/");
      const fileName = parts[parts.length - 1];
      const folderPath = isFolder ? parts.slice(0, -1).join("/") : "";
      const parentId = await getOrCreateFolder(folderPath);

      const base64Data = file.file.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      const initialRes = await drive.files.create({
        requestBody: {
          name: fileName,
          parents: [parentId],
        },
        media: {
          mimeType: file.type || "application/octet-stream",
          body: stream,
        },
        fields: "id",
      });

      const fileId = initialRes.data.id!;
      let meta: drive_v3.Schema$File | undefined;

      for (let attempt = 0; attempt < 5; attempt++) {
        const res = await drive.files.get({
          fileId,
          fields:
            "id, name, mimeType, parents, createdTime, modifiedTime, starred, trashed, thumbnailLink, webViewLink, webContentLink, quotaBytesUsed, permissions",
        });
        meta = res.data;
        if (meta.thumbnailLink || attempt === 4) break;
        await sleep(1000);
      }

      if (!meta) throw new Error("Failed to fetch metadata for uploaded file");

      // Extract permissions from the file metadata
      const permissions =
        meta.permissions?.map((permission) => ({
          pid: permission.id!,
          pt: permission.type!,
          pe: permission.emailAddress,
          pr: permission.role!,
        })) ?? [];

      uploadedMetadata.push({
        id: fileId,
        e: email,
        n: meta.name!,
        m: meta.mimeType!,
        p: meta.parents!,
        s: meta.starred!,
        t: meta.trashed!,
        ct: meta.createdTime!,
        mt: meta.modifiedTime!,
        tl: meta.thumbnailLink ?? undefined,
        wvl: meta.webViewLink ?? undefined,
        wcl: meta.webContentLink ?? undefined,
        q: meta.quotaBytesUsed ? Number(meta.quotaBytesUsed) : undefined,
        permissions,
      });
    }

    if (uploadedMetadata.length > 0) {
      await hiveCollection.insertMany(uploadedMetadata);
    }

    return NextResponse.json({ message: "Upload and metadata saved!" });
  } catch (error) {
    console.error("Error during upload", error);
    return NextResponse.json({ message: "Upload failed!" }, { status: 500 });
  }
}
