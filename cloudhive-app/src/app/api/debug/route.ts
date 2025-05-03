import { NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";
// GET /api/debug?id=your-file-or-folder-id&email=user@gmail.com

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const email = url.searchParams.get("email");

    if (!id || !email) {
      return NextResponse.json(
        { error: "Missing id or email" },
        { status: 400 }
      );
    }

    const drive = await createOAuthClient(email);

    const fileRes = await drive.files.get({
      fileId: id,
      fields: "*",
      supportsAllDrives: true,
    });

    const metadata = fileRes.data;

    return NextResponse.json({
      file: metadata,
    });
  } catch (err) {
    console.error("Debug API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch file info" },
      { status: 500 }
    );
  }
}
