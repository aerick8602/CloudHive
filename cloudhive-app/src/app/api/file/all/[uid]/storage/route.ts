import { NextRequest, NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google/google.client";
import { connectToDatabase } from "@/lib/db/mongo.config";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;

  if (!uid) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    const accountsCollection = db.collection("accounts");

    // Fetch accounts from MongoDB
    const accounts = await accountsCollection.find({ uids: uid }).toArray();

    if (!accounts || accounts.length === 0) {
      return NextResponse.json(
        { error: "No accounts found for this UID" },
        { status: 404 }
      );
    }

    let storageInfo: Record<string, any> = {};

    for (const account of accounts) {
      const email = account.e;
      try {
        if (account.c) {
          const drive = await createOAuthClient(email);
          const about = await drive.about.get({
            fields: "storageQuota,user",
          });

          storageInfo[email] = {
            active: account.a,
            connected: account.c,
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
        } else {
          storageInfo[email] = {
            active: account.a,
            connected: account.c,
            error: "Account is disconnected",
            user: {
              emailAddress: email,
            },
          };
        }
      } catch (err) {
        console.error(
          `⚠️ Error fetching storage info for account ${email}:`,
          err
        );
        storageInfo[email] = {
          active: account.a,
          connected: account.c,
          error: "Failed to fetch storage information",
          errorDetails: err instanceof Error ? err.message : "Unknown error",
          user: {
            emailAddress: email,
          },
        };
      }
    }

    const updatedAccounts = accounts.map((account) => ({
      e: account.e,
      c: account.c,
      a: account.a,
      _id: account._id.toString(),
    }));

    return NextResponse.json(
      {
        storageInfo,
        accounts: [updatedAccounts],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Internal error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
