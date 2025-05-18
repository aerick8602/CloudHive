import { NextRequest, NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";
import { connectToDatabase } from "@/lib/db/mongo.config";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const uid = formData.get('uid') as string;

    if (!file || !uid) {
      return NextResponse.json(
        { error: "File and UID are required" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Google Drive
    const drive = await createOAuthClient(uid);
    
    // Create a folder for profile pictures if it doesn't exist
    const folderResponse = await drive.files.list({
      q: `name = 'Profile Pictures' and mimeType = 'application/vnd.google-apps.folder' and 'root' in parents and trashed = false`,
      fields: "files(id, name)",
    });

    let folderId = folderResponse.data.files?.[0]?.id;

    if (!folderId) {
      const createFolderResponse = await drive.files.create({
        requestBody: {
          name: 'Profile Pictures',
          mimeType: 'application/vnd.google-apps.folder',
          parents: ['root'],
        },
        fields: 'id',
      });
      folderId = createFolderResponse.data.id;
    }

    // Upload the file
    const uploadResponse = await drive.files.create({
      requestBody: {
        name: `${uid}_profile_${Date.now()}.${file.name.split('.').pop()}`,
        parents: [folderId!],
      },
      media: {
        mimeType: file.type,
        body: buffer,
      },
      fields: 'id, webContentLink',
    });

    // Get the file's web content link
    const fileResponse = await drive.files.get({
      fileId: uploadResponse.data.id!,
      fields: 'webContentLink',
    });

    // Update user's profile picture URL in the database
    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");
    
    await usersCollection.updateOne(
      { email: uid },
      { $set: { photoURL: fileResponse.data.webContentLink } }
    );

    return NextResponse.json({
      success: true,
      photoURL: fileResponse.data.webContentLink,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return NextResponse.json(
      { error: "Failed to upload profile picture" },
      { status: 500 }
    );
  }
} 