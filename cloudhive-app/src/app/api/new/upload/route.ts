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

        // Initial status without progress
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            progress: 0, 
            status: `Preparing to upload ${totalFiles} file${totalFiles > 1 ? 's' : ''}...`
          })}\n\n`)
        );

        // Simulate OAuth connection without progress
        await sleep(800);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            progress: 0, 
            status: `Connecting to Google Drive...`
          })}\n\n`)
        );

        const drive = await createOAuthClient("a");
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

        // Simulate folder structure creation if needed (0% to 5%)
        if (isFolder) {
          await simulateProgress(
            controller,
            encoder,
            0,
            5,
            500,
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

            // Calculate progress range for this file
            const startProgress = isFolder ? 5 + (completedFiles * (85 / totalFiles)) : (completedFiles * (90 / totalFiles));
            const endProgress = isFolder ? 5 + ((completedFiles + 1) * (85 / totalFiles)) : ((completedFiles + 1) * (90 / totalFiles));

            // Simulate file upload progress
            await simulateProgress(
              controller,
              encoder,
              startProgress,
              endProgress,
              1000, // 1 second per file
              `Uploading ${fileName}...`
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

            const fileId = initialRes.data.id;

            // Add a delay to allow Google Drive to process the file
            await sleep(2000); // Wait 2 seconds

            try {
              await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                  type: "user",
                  role: "writer",
                  emailAddress: userAppEmail,
                },
                sendNotificationEmail: false,
              });
            } catch (permError) {
              console.error(`Error setting permissions for ${fileName}:`, permError);
              // If permission setting fails, wait a bit longer and try one more time
              await sleep(3000); // Wait 3 more seconds
              try {
                await drive.permissions.create({
                  fileId: fileId,
                  requestBody: {
                    type: "user",
                    role: "writer",
                    emailAddress: userAppEmail,
                  },
                  sendNotificationEmail: false,
                });
              } catch (retryError) {
                console.error(`Error setting permissions for ${fileName} on retry:`, retryError);
                // Try to delete the file if permission setting fails
                try {
                  await drive.files.delete({ fileId });
                } catch (deleteError) {
                  console.error(`Error deleting file ${fileName} after permission failure:`, deleteError);
                }
                throw new Error(`Failed to set permissions for ${fileName} after retry`);
              }
            }

            let meta: drive_v3.Schema$File | undefined;
            for (let attempt = 0; attempt < 5; attempt++) {
              try {
                const res = await drive.files.get({
                  fileId,
                  fields: "id",
                });
                meta = res.data;
                if (meta.thumbnailLink || attempt === 4) break;
                await sleep(1000);
              } catch (metaError) {
                console.error(`Error fetching metadata for ${fileName}:`, metaError);
                if (attempt === 4) throw new Error(`Failed to verify upload for ${fileName}`);
              }
            }

            if (!meta) {
              throw new Error(`Failed to verify upload for ${fileName}`);
            }

            completedFiles++;

          } catch (error: any) {
            console.error(`Error uploading file ${file.name}:`, error);
            // Send a more specific error message
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ 
                  error: `Failed to upload ${file.name}: ${error?.message || 'Unknown error'}`,
                  status: "Upload failed"
                })}\n\n`
              )
            );
            throw error; // Re-throw to stop the upload process
          }
        }

        // Simulate final processing (90% to 100%)
        await simulateProgress(
          controller,
          encoder,
          90,
          100,
          500,
          "Upload complete!"
        );

        // Send one final message to ensure completion
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