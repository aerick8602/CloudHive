import { NextRequest, NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";
import { CATEGORY_MIME_MAP } from "@/utils/mimetypes";

export async function GET(req: NextRequest, context: any) {
  try {
    const { params } = context;
    const email = params.params[0];
    const parentId = params.params[1]; // Optional

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const pageToken = searchParams.get("pageToken") || undefined;
    const starred = searchParams.get("starred") === "true";
    const trashed = searchParams.get("trashed") === "true";
    const type = searchParams.get("type") || undefined;

    console.log("⚡ Params:", {
      email,
      parentId,
      pageToken,
      starred,
      trashed,
      type,
    });

    const drive = await createOAuthClient(email);

    const { files, nextPageToken } = await getDriveFilesWithQuery(drive, {
      parentId,
      pageToken,
      starred,
      trashed,
      type,
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
    type?: string;
  }
) {
  const { parentId, pageToken, starred, trashed, type } = options;

  let qParts: string[] = [];

  if (parentId) qParts.push(`'${parentId}' in parents`);
  if (starred) qParts.push("starred = true");
  if (!trashed) qParts.push("trashed = false");
  if (trashed) qParts.push("trashed = true");

  // 🧠 Add MIME type filter based on "type" category
  if (type && CATEGORY_MIME_MAP[type]) {
    const mimeConditions = CATEGORY_MIME_MAP[type].map(
      (mime) => `mimeType='${mime}'`
    );
    qParts.push(`(${mimeConditions.join(" or ")})`);
  }

  const q = qParts.join(" and ");

  const response = await drive.files.list({
    pageSize: 25,
    q,
    orderBy: "modifiedTime desc",
    fields: "nextPageToken, files(*)",
    pageToken,
  });

  return {
    files: response.data.files || [],
    nextPageToken: response.data.nextPageToken,
  };
}
