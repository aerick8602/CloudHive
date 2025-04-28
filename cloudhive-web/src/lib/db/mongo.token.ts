import { connectToDatabase } from "@/lib/db/mongo.config";

interface Token {
  accessToken: string;
  refreshToken: string;
  expiryDate: number;
  sync: number;
}

export async function getTokenFromMongo(email: string): Promise<Token | null> {
  try {
    const { db } = await connectToDatabase();
    const accountsCollection = db.collection("accounts");

    // Fetch account data by email
    const account = await accountsCollection.findOne({ email });

    // Return null if no account is found
    if (!account) {
      return null;
    }

    // Extract and return relevant token data
    const { accessToken, refreshToken, expiryDate, sync } = account;
    return { accessToken, refreshToken, expiryDate, sync };
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
}

export async function updateTokenToMongo(
  email: string,
  accessToken: string,
  expiryDate: number
): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    const accountsCollection = db.collection("accounts");

    // Update the token and expiry date for the given email
    await accountsCollection.updateOne(
      { email },
      {
        $set: {
          accessToken,
          expiryDate,
          sync: Date.now(),
        },
      }
    );
  } catch (error) {
    console.error("Error updating token:", error);
    throw new Error("Failed to update token");
  }
}
