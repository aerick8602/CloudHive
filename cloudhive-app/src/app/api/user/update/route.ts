import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongo.config";

export async function POST(req: NextRequest) {
  try {
    const { uid, username } = await req.json();

    if (!uid || !username) {
      return NextResponse.json(
        { error: "UID and username are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Update the user's username
    const result = await usersCollection.updateOne(
      { email: uid },
      { $set: { username: username } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, username });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
} 