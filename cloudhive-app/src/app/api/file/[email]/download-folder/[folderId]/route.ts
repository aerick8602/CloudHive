import { NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";
import JSZip from "jszip";
import { Readable } from "stream";

export async function GET(
  request: Request,
  { params }: { params: { email: string; folderId: string } }
) {
  try {
    const { email, folderId } = params;
    const drive = await createOAuthClient(email);
    const zip = new JSZip();

    // Function to recursively get all files in a folder
    async function getAllFilesInFolder(folderId: string, path: string = "") {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: "files(id, name, mimeType, parents)",
      });

      const files = response.data.files || [];
      
      for (const file of files) {
        if (file.mimeType === "application/vnd.google-apps.folder") {
          // Recursively get files in subfolder
          await getAllFilesInFolder(file.id!, path + file.name + "/");
        } else {
          try {
            // Download file content
            const fileResponse = await drive.files.get(
              { fileId: file.id!, alt: "media" },
              { responseType: "arraybuffer" }
            );
            
            // Add file to zip with the buffer data
            if (fileResponse.data instanceof ArrayBuffer) {
              zip.file(path + file.name, Buffer.from(fileResponse.data));
            } else {
              console.warn(`Skipping file ${file.name} - invalid data format`);
            }
          } catch (error) {
            console.error(`Error downloading file ${file.name}:`, error);
          }
        }
      }
    }

    // Get folder name for the zip file
    const folderResponse = await drive.files.get({
      fileId: folderId,
      fields: "name",
    });
    const folderName = folderResponse.data.name || "folder";

    // Get all files in the folder
    await getAllFilesInFolder(folderId);

    // Generate zip file
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    // Create response with zip file
    const headers = new Headers();
    headers.set("Content-Type", "application/zip");
    headers.set("Content-Disposition", `attachment; filename="${folderName}.zip"`);

    return new NextResponse(zipContent, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error downloading folder:", error);
    return NextResponse.json(
      { message: "Failed to download folder" },
      { status: 500 }
    );
  }
} 