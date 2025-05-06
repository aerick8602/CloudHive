import { NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";

// GET /api/debug?email=user@gmail.com
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Missing email parameter" },
        { status: 400 }
      );
    }

    const drive = await createOAuthClient(email);

    const response = await drive.files.list({
      q: "'me' in owners", // ✅ Only show files owned by the user
      fields: "files(*)",

      orderBy: "modifiedTime desc",
    });

    const files = response.data.files || [];

    return NextResponse.json({ files }, { status: 200 });
  } catch (err) {
    console.error("❌ Debug API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch file info" },
      { status: 500 }
    );
  }
}
