import { connectToDatabase } from "@/lib/db/mongo.config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;

  if (!uid) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  const { db } = await connectToDatabase();
  const accountsCollection = db.collection("accounts");
  try {
    // Fetch accounts linked to the UID
    const accounts = await accountsCollection.find({ uids: uid }).toArray();

    const accountsList = accounts.map((account: any) => ({
      email: account.e,
      _id: account._id.toString(),
    }));

    // console.log("Accounts found:", accountsList);

    return NextResponse.json({ accounts: [accountsList] });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
