import { Hive } from "@/app/interface";
import { connectToDatabase } from "@/lib/db/mongo.config";

export async function saveDriveItem(item: Hive) {
  const { db } = await connectToDatabase();
  const HiveCollection = db.collection("hive");

  return HiveCollection.updateOne(
    { id: item.id, e: item.e },
    { $set: item },
    { upsert: true }
  );
}

export async function getDriveItemsByEmail(email: string) {
  const { db } = await connectToDatabase();
  const HiveCollection = db.collection("hive");

  return HiveCollection.find<Hive>({ e: email }).toArray();
}

export async function getDriveItemById(id: string, email: string) {
  const { db } = await connectToDatabase();
  const HiveCollection = db.collection("hive");

  return HiveCollection.findOne<Hive>({ id, e: email });
}
