import { createOAuthClient } from "@/lib/google/google.client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;
    const { searchParams } = new URL(req.url);
    const pageToken = searchParams.get("pageToken") || undefined;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    console.log("⚡ Fetching files for:", email, "with pageToken:", pageToken);

    const drive = await createOAuthClient(email);
    const { files, nextPageToken } = await getDriveFiles(drive, pageToken);

    return NextResponse.json({ files, nextPageToken }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching files:", error);
    return NextResponse.json(
      { message: "Failed to fetch files from Google Drive" },
      { status: 500 }
    );
  }
}

async function getDriveFiles(drive: any, pageToken?: string) {
  const response = await drive.files.list({
    pageSize: 25,
    fields: "nextPageToken, files(id, name, mimeType, size)",
    pageToken,
  });

  return {
    files: response.data.files || [],
    nextPageToken: response.data.nextPageToken,
  };
}
