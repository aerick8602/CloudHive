import { connectToDatabase } from "@/lib/db/mongo.config";

export interface Account {
  e: string; // email
  at: string; // access token
  rt: string; // refresh token
  v: number | null; // validity (or TTL)
  rf: string | null; // root folder ID
  sync: number; // sync status
  q: {
    l: number; // quota limit
    u: number; // quota usage
  } | null;
  uids: string[]; // user IDs
}

export async function findAccountByEmail(
  email: string
): Promise<Account | null> {
  const { db } = await connectToDatabase();
  const accountsCollection = db.collection("accounts");
  return accountsCollection.findOne<Account>({ e: email });
}

export async function updateAccount(email: string, updates: Partial<Account>) {
  const { db } = await connectToDatabase();
  const accountsCollection = db.collection("accounts");
  return accountsCollection.updateOne(
    { e: email },
    { $set: updates },
    { upsert: true }
  );
}
