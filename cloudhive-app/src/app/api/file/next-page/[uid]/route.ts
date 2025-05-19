import { NextRequest, NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";
import { FileData } from "@/interface";
import redis from "@/lib/cache/redis.config";
import { adminAuth } from "@/lib/firebase/firebase-admin";

export async function GET(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const accounts = searchParams.get("accounts")?.split(",") || [];
    if (!accounts.length) {
      return NextResponse.json({ error: "No accounts specified" }, { status: 400 });
    }

    // Session handling
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

    // Get accounts from Redis
    const rawAccounts = await redis.get(`accounts:${params.uid}`);
    if (!rawAccounts) {
      return NextResponse.json({ error: "No accounts found" }, { status: 404 });
    }

    let accountList: { e: string; c: boolean; a: boolean }[] = JSON.parse(rawAccounts);
    accountList = accountList.filter(acc => acc.c && acc.a && accounts.includes(acc.e));

    const allFiles: FileData[] = [];
    const nextTokens: Record<string, string> = {};

    for (const account of accountList) {
      const email = account.e;
      try {
        const drive = await createOAuthClient(email);
        const { files, nextPageToken } = await getDriveFilesWithQuery(drive);

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
                fields: "permissions(displayName,photoLink,id,type,emailAddress,role)",
              });

              updatedPermissions = permRes.data.permissions || [];
            } catch (permError) {
              console.error(`Failed to update permissions for ${file.name}:`, permError);
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
        console.error(`Error processing account ${email}:`, err);
      }
    }

    allFiles.sort(
      (a, b) => new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime()
    );

    return NextResponse.json({ files: allFiles, nextPageTokens: nextTokens });
  } catch (error) {
    console.error("Error fetching next page:", error);
    return NextResponse.json({ error: "Failed to fetch next page" }, { status: 500 });
  }
}

async function getDriveFilesWithQuery(drive: any) {
  const response = await drive.files.list({
    pageSize: 25,
    q: "'me' in owners and trashed = false",
    orderBy: "modifiedTime desc",
    fields: "nextPageToken, files(id,name,mimeType,thumbnailLink,parents,starred,trashed,createdTime,modifiedTime,permissions(displayName,photoLink,id,type,emailAddress,role),quotaBytesUsed,viewedByMe,viewedByMeTime)",
  });

  return {
    files: response.data.files || [],
    nextPageToken: response.data.nextPageToken,
  };
} 