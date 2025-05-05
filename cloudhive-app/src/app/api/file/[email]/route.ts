import { NextRequest, NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";
import { CATEGORY_MIME_MAP } from "@/utils/mimetypes";
import { FileData } from "@/interface";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);

    const parentId = searchParams.get("parentId") || undefined;
    const pageToken = searchParams.get("pageToken") || undefined;

    const starredParam = searchParams.get("starred");
    const starred = starredParam === null ? undefined : starredParam === "true";

    const trashedParam = searchParams.get("trashed");
    const trashed = trashedParam === null ? undefined : trashedParam === "true";

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

    const {
      files,
      nextPageToken,
    }: { files: FileData[]; nextPageToken?: string } =
      await getDriveFilesWithQuery(drive, {
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
  if (starred !== undefined) qParts.push(`starred = ${starred}`);
  if (trashed !== undefined) qParts.push(`trashed = ${trashed}`);

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
    fields:
      "nextPageToken, files(id,name,mimeType,parents,starred,trashed,createdTime,modifiedTime,permissions(displayName,photoLink,id,type,emailAddress,role),quotaBytesUsed)",
    pageToken,
  });

  return {
    files: response.data.files || [],
    nextPageToken: response.data.nextPageToken,
  };
}
