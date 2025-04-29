import { Account } from "@/app/interface";
import { connectToDatabase } from "@/lib/db/mongo.config";

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
