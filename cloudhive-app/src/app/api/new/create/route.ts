import { NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";
import { connectToDatabase } from "@/lib/db/mongo.config";
import { drive_v3 } from "googleapis";
// import { Hive } from "@/interface";

export async function POST(request: Request) {
  try {
    const { email, currentParentId, newFolderName, userAppEmail } =
      await request.json();
    if (!email || !userAppEmail || !newFolderName) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Create OAuth client for Google Drive API
    const drive = await createOAuthClient(email);

    // Connect to the database
    // const { db } = await connectToDatabase();
    // const hiveCollection = db.collection("hive");

    // const getOrCreateCloudHiveRoot = async (): Promise<string> => {
    //   const res = await drive.files.list({
    //     q: `name = 'CloudHive' and mimeType = 'application/vnd.google-apps.folder' and 'root' in parents and trashed = false`,
    //     fields: "files(id, name)",
    //   });

    //   if (res.data.files && res.data.files.length > 0) {
    //     return res.data.files[0].id!;
    //   }

    //   const createRes = await drive.files.create({
    //     requestBody: {
    //       name: "CloudHive",
    //       mimeType: "application/vnd.google-apps.folder",
    //       parents: ["root"],
    //     },
    //     fields: "id",
    //   });

    //   return createRes.data.id!;
    // };
    // const cloudHiveRootId = await getOrCreateCloudHiveRoot();

    // Create a new folder in Google Drive

    const res = await drive.files.create({
      requestBody: {
        name: newFolderName, // Name of the new folder
        mimeType: "application/vnd.google-apps.folder", // Folder MIME type
        // parents: [currentParentId ? currentParentId : cloudHiveRootId], Use when using CloudHive Folder
        // parents: [currentParentId ? currentParentId : "root"], // Parent folder ID
      },
      fields: "id",
      // "id, name, mimeType, parents, createdTime, modifiedTime, starred, trashed,permissions",
    });

    const folderId = res.data.id!;
    // await
    drive.permissions.create({
      fileId: folderId,
      requestBody: {
        type: "user",
        role: "writer", // or "reader"
        emailAddress: userAppEmail,
      },
      sendNotificationEmail: false,
    });

    // Extract permissions from the folder metadata
    // const permissions =
    //   res.data.permissions?.map((permission) => ({
    //     pid: permission.id!,
    //     pt: permission.type!,
    //     pe: permission.emailAddress,
    //     pr: permission.role!,
    //   })) ?? [];

    // const folderMetadata: Hive = {
    //   id: folderId,
    //   e: email,
    //   n: res.data.name!,
    //   m: res.data.mimeType!,
    //   p: res.data.parents!,
    //   s: res.data.starred!,
    //   t: res.data.trashed!,
    //   ct: res.data.createdTime!,
    //   mt: res.data.modifiedTime!,
    //   permissions,
    // };

    // Insert the folder metadata into the database
    // await hiveCollection.insertOne(folderMetadata);

    return NextResponse.json({ message: "Folder created successfully!" });
  } catch (error) {
    console.error("Error during folder creation:", error);
    return NextResponse.json(
      { message: "Folder creation failed!" },
      { status: 500 }
    );
  }
}