import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongo.config";
import { ObjectId } from "mongodb";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse("Account ID is required", { status: 400 });
    }

    const { db } = await connectToDatabase();
    const accountsCollection = db.collection("accounts");

    // Update the specific account's validity
    const result = await accountsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { a: false } }
    );

    if (result.matchedCount === 0) {
      return new NextResponse("Account not found", { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: "Account validity updated successfully"
    });

  } catch (error) {
    console.error("[TOGGLE_ACCOUNT_VALIDITY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 