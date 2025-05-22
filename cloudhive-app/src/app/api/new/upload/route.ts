import { NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";
import { Readable } from "stream";
import { drive_v3 } from "googleapis";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getProgressRange = (
  completed: number,
  total: number,
  base: number,
  range: number
): [number, number] => {
  const increment = range / total;
  const start = base + completed * increment;
  const end = base + (completed + 1) * increment;
  return [Math.min(start, 99), Math.min(end, 100)];
};

async function simulateFixedProgress(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  startProgress: number,
  endProgress: number,
  duration: number,
  status: string
) {
  const steps = 10;
  const stepDuration = duration / steps;
  const progressIncrement = (endProgress - startProgress) / steps;

  for (let i = 0; i < steps; i++) {
    const currentProgress = Math.round(startProgress + progressIncrement * i);
    controller.enqueue(
      encoder.encode(
        `data: ${JSON.stringify({
          progress: currentProgress,
          status,
        })}\n\n`
      )
    );
    await sleep(stepDuration);
  }
}

async function simulateUploadProgress(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  startProgress: number,
  endProgress: number,
  fileSize: number, // in bytes
  fileName: string
) {
  const totalMB = fileSize / (1024 * 1024); // Convert bytes to MB
  const speedMBps = 1.5 + Math.random() * 1.5; // Random speed between 1.5–3 MB/s
  const duration = Math.max(500, (totalMB / speedMBps) * 1000); // Minimum 500ms

  const steps = 10;
  const stepDuration = duration / steps;
  const progressIncrement = (endProgress - startProgress) / steps;

  for (let i = 0; i < steps; i++) {
    const currentProgress = Math.round(startProgress + progressIncrement * i);
    controller.enqueue(
      encoder.encode(
        `data: ${JSON.stringify({
          progress: currentProgress,
          status: `Uploading ${fileName}...`,
        })}\n\n`
      )
    );
    await sleep(stepDuration);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract all files and their paths
    const files: { file: File; path: string }[] = [];
    let index = 0;
    while (formData.has(`file-${index}`)) {
      const file = formData.get(`file-${index}`) as File;
      const path = formData.get(`path-${index}`) as string;
      files.push({ file, path });
      index++;
    }

    const isFolder = formData.get("isFolder") === "true";
    const email = formData.get("email") as string;
    const currentParentId = formData.get("currentParentId") as string | null;
    const userAppEmail = formData.get("userAppEmail") as string;
    const totalFiles =
      parseInt(formData.get("totalFiles") as string) || files.length;

    if (!files.length || !email || !userAppEmail) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let completedFiles = 0;

        await simulateFixedProgress(
          controller,
          encoder,
          0,
          10,
          800,
          `Preparing to upload ${totalFiles} file${totalFiles > 1 ? "s" : ""}...`
        );

        await simulateFixedProgress(
          controller,
          encoder,
          10,
          20,
          1000,
          `Connecting to Google Drive...`
        );

        const drive = await createOAuthClient(email);
        const folderIds = new Map<string, string>();
        folderIds.set("", currentParentId || "root");

        const getOrCreateFolder = async (path: string): Promise<string> => {
          if (folderIds.has(path)) return folderIds.get(path)!;

          const parts = path.split("/");
          const parentPath = parts.slice(0, -1).join("/");
          const folderName = parts[parts.length - 1];
          const parentId = await getOrCreateFolder(parentPath);

          // Only show a status, don't reset progress
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                status: `Creating folder "${folderName}"...`,
              })}\n\n`
            )
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
          return folderId;
        };

        if (isFolder) {
          await simulateFixedProgress(
            controller,
            encoder,
            20,
            30,
            1000,
            `Creating folder structure...`
          );
        }

        for (const { file, path } of files) {
          try {
            const parts = path.split("/");
            const fileName = parts[parts.length - 1];
            const folderPath = isFolder ? parts.slice(0, -1).join("/") : "";

            const parentId = await getOrCreateFolder(folderPath);

            const [startProgress, endProgress] = isFolder
              ? getProgressRange(completedFiles, totalFiles, 30, 45)
              : getProgressRange(completedFiles, totalFiles, 20, 55);

            await simulateUploadProgress(
              controller,
              encoder,
              startProgress,
              endProgress,
              file.size,
              fileName
            );

            const fileStream = Readable.fromWeb(file.stream() as any);

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
              throw new Error(
                `Failed to upload ${fileName}: No file ID returned`
              );
            }

            completedFiles++;
          } catch (error: any) {
            console.error(`Error uploading file ${path}:`, error);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  error: `Failed to upload ${path}: ${error?.message || "Unknown error"}`,
                  status: "Upload failed",
                })}\n\n`
              )
            );
            throw error;
          }
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              progress: 100,
              status: "Upload complete!",
            })}\n\n`
          )
        );

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error during upload", error);
    return NextResponse.json({ message: "Upload failed!" }, { status: 500 });
  }
}
