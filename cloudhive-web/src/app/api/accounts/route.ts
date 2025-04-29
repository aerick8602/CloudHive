import { connectToDatabase } from "@/lib/db/mongo.config";
import { NextRequest, NextResponse } from "next/server";

// Get a list of accounts linked to the current user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid"); // Get the user ID (UID) from the query string

  console.log("⚡ [GET] Request received to fetch accounts for UID:", uid);

  if (!uid) {
    console.error("❌ UID is required");
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  // Connect to MongoDB
  const { db } = await connectToDatabase();
  const accountsCollection = db.collection("accounts");

  try {
    // console.log("✅ Connecting to database and fetching accounts...");
    // Fetch accounts linked to the UID
    const accounts = await accountsCollection.find({ uids: uid }).toArray();

    // Map accounts to include email and accountId for deletion purposes
    const accountsList = accounts.map((account: any) => ({
      email: account.e,
    }));

    console.log("✅ Accounts found:", accountsList);

    return NextResponse.json({ accounts: accountsList });
  } catch (error) {
    console.error("❌ Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete an account linked to the user
export async function DELETE(req: NextRequest) {
  console.log("⚡ [DELETE] Request received to delete account");

  const { accountId, uid } = await req.json();

  if (!accountId || !uid) {
    console.error("❌ Missing required fields: accountId or uid");
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
    console.log(
      "✅ Connecting to database and deleting account with ID:",
      accountId
    );

    // Remove the account from the 'accounts' collection
    const result = await accountsCollection.deleteOne({ _id: accountId });

    if (result.deletedCount === 0) {
      console.warn("⚠️ Account not found for deletion, ID:", accountId);
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    console.log("✅ Account deleted:", accountId);

    // Remove account reference from the user's document
    console.log("✅ Removing account reference from user document UID:", uid);
    await usersCollection.updateOne(
      { uid },
      {
        $pull: { driveAccounts: accountId }, // Remove the account ID from the user's document
      }
    );

    console.log("✅ User document updated to unlink account:", accountId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting account:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
