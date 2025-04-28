import { NextRequest, NextResponse } from "next/server";
import { GoogleDrive } from "@/lib/google/google.drive";
import { writeFile, mkdir, rm } from "fs/promises";
import { join, dirname } from "path";
import { tmpdir } from "os";
import { updateProgress, resetProgress } from "./progress/route";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function processFiles(formData: FormData, uploadType: "file" | "folder") {
  const files: Record<string, File> = {};
  const fields: Record<string, string> = {};
  const paths: Record<string, string> = {};

  // First, collect all paths
  for (const [key, value] of formData.entries()) {
    if (key === "paths") {
      const index = Object.keys(files).length;
      paths[index] = value as string;
    }
  }

  // Then collect files and fields
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      const index = Object.keys(files).length;
      files[index] = value;
      if (uploadType === "folder") {
        const path = (value as any).webkitRelativePath;
        if (path) {
          paths[index] = path;
        }
      }
    } else if (key !== "paths") {
      fields[key] = value as string;
    }
  }

  return { fields, files, paths };
}

async function cleanupTempFiles(tempDir: string) {
  try {
    await rm(tempDir, { recursive: true, force: true });
  } catch (error) {
    console.error("Error cleaning up temp files:", error);
  }
}

export async function POST(req: NextRequest) {
  let tempDir = "";
  try {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const uploadType = req.headers.get("x-upload-type") as "file" | "folder";

    // Reset progress at start
    resetProgress();

    if (!email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const googleDriveProvider = new GoogleDrive(email);
    await googleDriveProvider.initializeClient();

    // Get the CloudHive folder ID
    const cloudHiveFolderId = googleDriveProvider.getRootFolderId();
    if (!cloudHiveFolderId) {
      throw new Error("CloudHive folder not found or created");
    }

    if (uploadType === "folder") {
      const { fields, files, paths } = await processFiles(formData, uploadType);

      if (Object.keys(files).length > 0) {
        // Process files and upload them
        const processedFiles: Record<string, any> = {};
        tempDir = join(tmpdir(), "cloudhive-upload");

        // Create the root temp directory
        await mkdir(tempDir, { recursive: true });

        // Process files in parallel
        await Promise.all(
          Object.entries(files).map(async ([key, file]) => {
            // Create a temporary file
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Get the relative path for this file
            const relativePath = paths[key] || file.name;

            // Create the full path in temp directory
            const tempFilePath = join(tempDir, relativePath);

            // Ensure the directory exists
            await mkdir(dirname(tempFilePath), { recursive: true });

            // Save the file
            await writeFile(tempFilePath, buffer);

            processedFiles[relativePath] = {
              filepath: tempFilePath,
              originalFilename: file.name,
              mimetype: file.type,
            };
          })
        );

        const folderId = await googleDriveProvider.uploadFolderWithFiles(
          "", // Empty folder name since we're uploading directly to CloudHive
          processedFiles,
          cloudHiveFolderId, // Use CloudHive folder as parent
          (fileName, fileSize) => {
            updateProgress(fileName, fileSize);
          }
        );

        return NextResponse.json({ folderId }, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "No files provided" },
          { status: 400 }
        );
      }
    } else {
      // Handle single file upload
      const file = formData.get("files") as File;
      if (!file) {
        throw new Error("No file provided");
      }

      const fileId = await googleDriveProvider.uploadFile(
        file.name,
        file,
        file.type,
        cloudHiveFolderId // Use CloudHive folder as parent
      );

      updateProgress(file.name, formatFileSize(file.size));
      return NextResponse.json({ success: true, fileId });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  } finally {
    // Clean up temp files
    if (tempDir) {
      await cleanupTempFiles(tempDir);
    }
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
