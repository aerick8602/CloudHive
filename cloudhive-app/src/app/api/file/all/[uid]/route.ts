import { NextRequest, NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";
import { CATEGORY_MIME_MAP } from "@/utils/mimetypes";
import { FileData } from "@/interface";
import redis from "@/lib/cache/redis.config";
import { adminAuth } from "@/lib/firebase/firebase-admin"; // Ensure this is your initialized admin SDK

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

    // ✅ Extract session cookie and decode
    const sessionCookie = req.cookies.get(process.env.SESSION!)?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const userEmail = decoded.email;

    const rawAccounts = await redis.get(`accounts:${uid}`);
    if (!rawAccounts) {
      return NextResponse.json(
        { error: "No accounts found for this UID" },
        { status: 404 }
      );
    }

    let accounts: { e: string; c: boolean; a: boolean }[] =
      JSON.parse(rawAccounts);

    // Filter accounts to only include those that are both connected and active
    accounts = accounts.filter((account) => account.c && account.a);

    // if (accounts.length === 0) {
    //   return NextResponse.json(
    //     { error: "No active accounts found for this UID" },
    //     { status: 404 }
    //   );
    // }

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

        for (const file of files) {
          let updatedPermissions = file.permissions || [];

          const hasPermission = updatedPermissions.some(
            (perm: { emailAddress: string }) => perm.emailAddress === userEmail
          );

          if (!hasPermission) {
            try {
              await drive.permissions.create({
                fileId: file.id,
                requestBody: {
                  type: "user",
                  role: "reader",
                  emailAddress: userEmail,
                },
                fields: "id",
              });

              const permRes = await drive.permissions.list({
                fileId: file.id,
                fields:
                  "permissions(displayName,photoLink,id,type,emailAddress,role)",
              });

              updatedPermissions = permRes.data.permissions || [];
            } catch (permError) {
              console.error(
                `❌ Failed to update permissions for ${file.name}:`,
                permError
              );
            }
          }

          allFiles.push({
            id: file.id,
            email,
            name: file.name,
            mimeType: file.mimeType,
            thumbnailLink: file.thumbnailLink,
            parents: file.parents || [],
            starred: file.starred || false,
            trashed: file.trashed || false,
            createdTime: file.createdTime,
            modifiedTime: file.modifiedTime,
            permissions: updatedPermissions,
            quotaBytesUsed: file.quotaBytesUsed,
            viewedByMe: file.viewedByMe,
            viewedByMeTime: file.viewedByMeTime,
          });
        }

        if (nextPageToken) {
          nextTokens[email] = nextPageToken;
        }
      } catch (err) {
        console.error(`⚠️ Error processing account ${email}:`, err);
      }
    }

    allFiles.sort(
      (a, b) =>
        new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime()
    );

    return NextResponse.json(
      { files: allFiles, nextPageTokens: nextTokens },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Internal error:", error);
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
    pageSize: 50,
    q,
    orderBy: "modifiedTime desc",
    fields:
      "nextPageToken, files(id,name,mimeType,thumbnailLink,parents,starred,trashed,createdTime,modifiedTime,permissions(displayName,photoLink,id,type,emailAddress,role),quotaBytesUsed,viewedByMe,viewedByMeTime)",

    pageToken,
  });

  return {
    files: response.data.files || [],
    nextPageToken: response.data.nextPageToken,
  };
}
