import { Account } from "@/interface";
import { connectToDatabase } from "./mongo.config";
import { convertMillisToIST } from "@/utils/time";

export async function getTokenFromMongo(
  email: string
): Promise<Partial<Account> | null> {
  try {
    console.log(
      `[getTokenFromMongo] Connecting to DB to fetch token for: ${email}`
    );
    const { db } = await connectToDatabase();
    const accountsCollection = db.collection("accounts");

    const account = await accountsCollection.findOne({ e: email });
    console.log(`[getTokenFromMongo] Account fetched:`, account);

    if (!account) {
      console.warn(`[getTokenFromMongo] No account found for email: ${email}`);
      return null;
    }

    const { at, rt, atv, rtv } = account;
    console.log(`[getTokenFromMongo] Token details extracted for: ${email}`);
    return { at, rt, atv, rtv };
  } catch (error) {
    console.error("[getTokenFromMongo] Error fetching token:", error);
    return null;
  }
}

export async function updateTokenToMongo(
  email: string,
  accessToken: string,
  accessExpiry: string,
  refreshExpiry: string
): Promise<void> {
  try {
    console.log(
      `[updateTokenToMongo] Connecting to DB to update token for: ${email}`
    );
    const { db } = await connectToDatabase();
    const accountsCollection = db.collection("accounts");

    const result = await accountsCollection.updateOne(
      { e: email },
      {
        $set: {
          at: accessToken,
          atv: accessExpiry,
          rtv: refreshExpiry,
          sync: convertMillisToIST(Date.now()),
        },
      }
    );

    console.log(`[updateTokenToMongo] Update result for ${email}:`, result);
  } catch (error) {
    console.error("[updateTokenToMongo] Error updating token:", error);
    throw new Error("Failed to update token");
  }
}
