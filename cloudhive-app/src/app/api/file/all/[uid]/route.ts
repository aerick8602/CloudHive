import { NextRequest, NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";
import { CATEGORY_MIME_MAP } from "@/utils/mimetypes";
import { FileData } from "@/interface";
import redis from "@/lib/cache/redis.config";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;

  if (!uid) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(req.url);

    const parentId = searchParams.get("parentId") || "root";
    const pageToken = searchParams.get("pageToken") || undefined;

    const starredParam = searchParams.get("starred");
    const starred = starredParam === null ? undefined : starredParam === "true";

    const trashedParam = searchParams.get("trashed");
    const trashed = trashedParam === null ? undefined : trashedParam === "true";

    const type = searchParams.get("type") || undefined;

    // 🔐 Fetch connected accounts from Redis
    const rawAccounts = await redis.get(`accounts:${uid}`);
    if (!rawAccounts) {
      return NextResponse.json(
        { error: "No accounts found for this UID" },
        { status: 404 }
      );
    }

    let accounts: { e: string }[] = JSON.parse(rawAccounts);

    let allFiles: FileData[] = [];
    let nextTokens: Record<string, string | undefined> = {};

    for (const account of accounts) {
      const email = account.e;
      try {
        const drive = await createOAuthClient(email);
        const { files, nextPageToken } = await getDriveFilesWithQuery(drive, {
          parentId,
          pageToken,
          starred,
          trashed,
          type,
        });

        const transformedFiles = files.map((file: FileData) => ({
          id: file.id,
          email,
          name: file.name,
          mimeType: file.mimeType,
          parents: file.parents || [],
          starred: file.starred || false,
          trashed: file.trashed || false,
          createdTime: file.createdTime,
          modifiedTime: file.modifiedTime,
          permissions: (file.permissions || []).map((perm) => ({
            id: perm.id,
            type: perm.type,
            role: perm.role,
            emailAddress: perm.emailAddress || null,
            displayName: perm.displayName || null,
            photoLink: perm.photoLink || null,
          })),
          quotaBytesUsed: file.quotaBytesUsed,
        }));

        allFiles.push(...transformedFiles);
        if (nextPageToken) {
          nextTokens[email] = nextPageToken;
        }
      } catch (err) {
        console.error(`Error fetching files for ${email}:`, err);
      }
    }

    // Optional: Sort all files by modifiedTime
    allFiles.sort(
      (a, b) =>
        new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime()
    );

    return NextResponse.json(
      { files: allFiles, nextPageTokens: nextTokens },
      { status: 200 }
    );
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

  let qParts: string[] = ["'me' in owners"];

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
      "nextPageToken, files(id,name,mimeType,parents,starred,trashed,createdTime,modifiedTime,permissions(displayName,photoLink,id,type,emailAddress,role),quotaBytesUsed,viewedByMe,viewedByMeTime)",
    pageToken,
  });

  return {
    files: response.data.files || [],
    nextPageToken: response.data.nextPageToken,
  };
}
