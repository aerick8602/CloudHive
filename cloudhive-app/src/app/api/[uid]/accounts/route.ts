import { createOAuthClient } from "@/lib/google/google.client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  paramsPromise: Promise<{ params: { params: string[] } }>
) {
  try {
    const { params } = await paramsPromise;
    const [email, parentId] = params.params || [];

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const pageToken = searchParams.get("pageToken") || undefined;
    const starred = searchParams.get("starred") === "true";
    const trashed = searchParams.get("trashed") === "true";

    console.log("⚡ Params:", { email, parentId, pageToken, starred, trashed });

    const drive = await createOAuthClient(email);
    const { files, nextPageToken } = await getDriveFilesWithQuery(drive, {
      parentId,
      pageToken,
      starred,
      trashed,
    });

    return NextResponse.json({ files, nextPageToken }, { status: 200 });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getDriveFilesWithQuery(
  drive: any,
  options: {
    parentId?: string;
    pageToken?: string;
    starred?: boolean;
    trashed?: boolean;
  }
) {
  const { parentId, pageToken, starred, trashed } = options;

  let qParts = [];

  if (parentId) qParts.push(`'${parentId}' in parents`);
  if (starred) qParts.push("starred = true");
  if (!trashed) qParts.push("trashed = false");
  if (trashed) qParts.push("trashed = true");

  const q = qParts.join(" and ");

  const response = await drive.files.list({
    pageSize: 25,
    q,
    fields: "nextPageToken, files(*)",
    pageToken,
  });

  return {
    files: response.data.files || [],
    nextPageToken: response.data.nextPageToken,
  };
}
