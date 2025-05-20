import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongo.config";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { accounts } = await req.json();
    if (!accounts || !Array.isArray(accounts)) {
      return new NextResponse("Invalid accounts data", { status: 400 });
    }

    const { db } = await connectToDatabase();
    const accountsCollection = db.collection("accounts");

    const updatedAccounts = await Promise.all(accounts.map(async (acc: any) => {
      await accountsCollection.updateOne(
        { _id: new ObjectId(acc._id.toString()) },
        { $set: { a: false } }
      );
      return { ...acc, a: false };
    }));

    return NextResponse.json({ 
      success: true, 
      accounts: updatedAccounts,
      message: "Account validity updated successfully"
    });

  } catch (error) {
    console.error("[TOGGLE_ACCOUNT_VALIDITY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 