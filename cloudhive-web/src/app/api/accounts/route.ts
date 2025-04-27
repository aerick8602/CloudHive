// app/api/cloud/google/accounts/route.ts
import { connectToDatabase } from "@/lib/db/mongo.config";
import { NextRequest, NextResponse } from "next/server";

// Get a list of accounts linked to the current user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid"); // Get the user ID (UID) from the query string

  if (!uid) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  // Connect to MongoDB
  const { db } = await connectToDatabase();
  const accountsCollection = db.collection("accounts");

  try {
    // Fetch accounts linked to the UID
    const accounts = await accountsCollection.find({ userIds: uid }).toArray();

    if (!accounts.length) {
      return NextResponse.json({ error: "No accounts found" }, { status: 404 });
    }

    // Map accounts to include email and accountId for deletion purposes
    const accountsList = accounts.map((account: any) => ({
      email: account.email,
    }));

    return NextResponse.json({ accounts: accountsList });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete an account linked to the user
export async function DELETE(req: NextRequest) {
  const { accountId, uid } = await req.json();

  if (!accountId || !uid) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Connect to MongoDB
  const { db } = await connectToDatabase();
  const accountsCollection = db.collection("accounts");
  const usersCollection = db.collection("users");

  try {
    // Remove the account from the 'accounts' collection
    const result = await accountsCollection.deleteOne({ _id: accountId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Remove account reference from the user's document
    await usersCollection.updateOne(
      { uid },
      {
        $pull: { driveAccounts: accountId }, // Remove the account ID from the user's document
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
