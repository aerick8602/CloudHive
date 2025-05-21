import { NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";
import { Readable } from "stream";
import { connectToDatabase } from "@/lib/db/mongo.config";
import { drive_v3 } from "googleapis";
// import { Hive, FileData } from "@/interface";

interface FileData {
  path: string;
  name: string;
  size: number;
  type: string;
  file: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to simulate progress
async function simulateProgress(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  startProgress: number,
  endProgress: number,
  duration: number,
  status: string
) {
  const steps = 10; // Number of steps in the simulation
  const stepDuration = duration / steps;
  const progressIncrement = (endProgress - startProgress) / steps;

  for (let i = 0; i < steps; i++) {
    const currentProgress = Math.round(startProgress + (progressIncrement * i));
    controller.enqueue(
      encoder.encode(`data: ${JSON.stringify({ 
        progress: currentProgress, 
        status 
      })}\n\n`)
    );
    await sleep(stepDuration);
  }
}

export async function POST(request: Request) {
  try {
    const { files, email, isFolder, currentParentId, userAppEmail } =
      await request.json();

    if (!files || !email || !isFolder === undefined || !userAppEmail) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const totalFiles = (files as FileData[]).length;
        let completedFiles = 0;

        // Initial preparation stage (0-10%)
        await simulateProgress(
          controller,
          encoder,
          0,
          10,
          800,
          `Preparing to upload ${totalFiles} file${totalFiles > 1 ? 's' : ''}...`
        );

        // OAuth connection stage (10-20%)
        await simulateProgress(
          controller,
          encoder,
          10,
          20,
          1000,
          `Connecting to Google Drive...`
        );

        const drive = await createOAuthClient(email);
        const folderIds = new Map<string, string>();
        folderIds.set("", "root");

        if (currentParentId) {
          folderIds.set("", currentParentId);
        }

        // Recursive folder creation utility
        const getOrCreateFolder = async (path: string): Promise<string> => {
          if (folderIds.has(path)) return folderIds.get(path)!;

          const parts = path.split("/");
          const parentPath = parts.slice(0, -1).join("/");
          const folderName = parts[parts.length - 1];
          const parentId = await getOrCreateFolder(parentPath);

          // Update status for folder creation
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              progress: 20, 
              status: `Creating folder structure...`
            })}\n\n`)
          );

          const res = await drive.files.create({
            requestBody: {
              name: folderName,
              mimeType: "application/vnd.google-apps.folder",
              parents: [parentId],
            },
            fields: "id",
          });

          const folderId = res.data.id!;
          folderIds.set(path, folderId);

          // Update status for permission setting
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              progress: 22, 
              status: `Setting folder permissions...`
            })}\n\n`)
          );

          await drive.permissions.create({
            fileId: folderId,
            requestBody: {
              type: "user",
              role: "writer",
              emailAddress: userAppEmail,
            },
            sendNotificationEmail: false,
          });

          return folderId;
        };

        // Folder structure creation stage (20-30%)
        if (isFolder) {
          await simulateProgress(
            controller,
            encoder,
            20,
            30,
            1000,
            `Creating folder structure...`
          );
        }

        for (const file of files as FileData[]) {
          try {
            const path = file.path;
            const parts = path.split("/");
            const fileName = parts[parts.length - 1];
            const folderPath = isFolder ? parts.slice(0, -1).join("/") : "";
            
            const parentId = await getOrCreateFolder(folderPath);

            // Calculate progress range for this file (30-95%)
            const startProgress = isFolder ? 30 + (completedFiles * (55 / totalFiles)) : (completedFiles * (65 / totalFiles));
            const endProgress = isFolder ? 30 + ((completedFiles + 1) * (55 / totalFiles)) : ((completedFiles + 1) * (65 / totalFiles));

            // Upload stage - show current file name in both status and progress
            await simulateProgress(
              controller,
              encoder,
              startProgress,
              endProgress,
              1000,
              `Uploading ${fileName}`
            );

            const base64Data = file.file.split(",")[1];
            const buffer = Buffer.from(base64Data, "base64");
            const fileStream = new Readable();
            fileStream.push(buffer);
            fileStream.push(null);

            const initialRes = await drive.files.create({
              requestBody: {
                name: fileName,
                parents: [parentId],
              },
              media: {
                mimeType: file.type || "application/octet-stream",
                body: fileStream,
              },
              fields: "id",
            });

            if (!initialRes.data.id) {
              throw new Error(`Failed to upload ${fileName}: No file ID returned`);
            }

            completedFiles++;

          } catch (error: any) {
            console.error(`Error uploading file ${file.name}:`, error);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ 
                  error: `Failed to upload ${file.name}: ${error?.message || 'Unknown error'}`,
                  status: "Upload failed"
                })}\n\n`
              )
            );
            throw error;
          }
        }

        // Final completion
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            progress: 100, 
            status: "Upload complete!" 
          })}\n\n`)
        );

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Error during upload", error);
    return NextResponse.json({ message: "Upload failed!" }, { status: 500 });
  }
}