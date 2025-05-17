import { NextRequest, NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";
import redis from "@/lib/cache/redis.config";
import { adminAuth } from "@/lib/firebase/firebase-admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;

  if (!uid) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  try {
 
    const rawAccounts = await redis.get(`accounts:${uid}`);
    if (!rawAccounts) {
      return NextResponse.json(
        { error: "No accounts found for this UID" },
        { status: 404 }
      );
    }

    let accounts: { e: string }[] = JSON.parse(rawAccounts);
    let storageInfo: Record<string, any> = {};

    for (const account of accounts) {
      const email = account.e;
      try {
        const drive = await createOAuthClient(email);
        const about = await drive.about.get({
          fields: "storageQuota,user",
        });

        storageInfo[email] = {
          limit: about.data.storageQuota?.limit,
          usage: about.data.storageQuota?.usage,
          usageInDrive: about.data.storageQuota?.usageInDrive,
          usageInDriveTrash: about.data.storageQuota?.usageInDriveTrash,
          user: {
            displayName: about.data.user?.displayName,
            emailAddress: about.data.user?.emailAddress,
            photoLink: about.data.user?.photoLink,
          },
        };
      } catch (err) {
        console.error(`⚠️ Error fetching storage info for account ${email}:`, err);
        storageInfo[email] = { error: "Failed to fetch storage information" };
      }
    }

    return NextResponse.json({ storageInfo }, { status: 200 });
  } catch (error) {
    console.error("❌ Internal error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 