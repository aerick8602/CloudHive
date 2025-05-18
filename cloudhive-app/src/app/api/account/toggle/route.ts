import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongo.config";
import redis from "@/lib/cache/redis.config";

const CACHE_EXPIRES_IN = Number(process.env.CACHE_TTL!);

export async function POST(req: NextRequest) {
  try {
    const { email, uid } = await req.json();
    console.log("📩 Toggle request received:", { email, uid });

    if (!email || !uid) {
      console.warn("⚠️ Missing email or uid");
      return NextResponse.json(
        { error: "Email and UID are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const accountsCollection = db.collection("accounts");
    console.log("✅ Connected to MongoDB");

    // Find and update account
    const account = await accountsCollection.findOne({ e: email });
    if (!account) {
      console.warn("❌ Account not found:", email);
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    console.log("📦 Found account:", { 
      email: account.e, 
      currentStatus: account.c,
      active: account.a 
    });

    const newConnectedStatus = !account.c;
    console.log(`🔄 Toggling connection from ${account.c} → ${newConnectedStatus}`);

    await accountsCollection.updateOne(
      { e: email },
      { $set: { c: newConnectedStatus } }
    );
    console.log("✅ MongoDB update completed");

    // Fetch updated accounts list
    console.log("🔄 Fetching updated accounts list...");
    const accounts = await accountsCollection.find({ uids: uid }).toArray();
    const accountsList = accounts.map((account) => ({
      c: account.c,
      a: account.a,
      e: account.e,
      _id: account._id.toString(),
    }));
    console.log("📦 Updated accounts list:", accountsList);

    // Update Redis cache
    try {
      console.log("🧹 Updating Redis cache...");
      await redis.set(
        `accounts:${uid}`,
        JSON.stringify(accountsList),
        "EX",
        CACHE_EXPIRES_IN
      );
      console.log("✅ Redis cache updated");
    } catch (error) {
      console.error("❌ Redis cache update failed:", error);
      // Continue even if cache update fails
    }

    const response = {
      success: true,
      account: {
        c: newConnectedStatus,
        a: account.a,
        e: account.e,
        _id: account._id.toString(),
      },
      accounts: accountsList,
    };
    console.log("📤 Sending response:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Error in toggle operation:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
