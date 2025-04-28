import { connectToDatabase } from "@/lib/db/mongo.config";

export interface DriveItem {
  id: string;
  e: string; // email (user identifier)
  n: string; // name of the file or folder
  m: string; // mimeType of the item
  p: string[]; // parent folder IDs
  s: boolean; // whether the item is starred
  t: boolean; // whether the item is trashed
  ct: string; // createdTime (ISO format)
  mt: string; // modifiedTime (ISO format)

  tl?: string; // thumbnailLink (files only, optional)
  wvl?: string; // webViewLink (files only, optional)
  wcl?: string; // webContentLink (files only, optional)
  q?: number; // quotaBytesUsed (files only, optional)
}

/**
 * Store or update a CloudDriveItem in the database.
 * @param item - The CloudDriveItem to be stored or updated.
 * @returns The result of the database operation.
 */
export async function saveDriveItem(item: DriveItem) {
  const { db } = await connectToDatabase();
  const driveItemsCollection = db.collection("metadrive");

  return driveItemsCollection.updateOne(
    { id: item.id, e: item.e },
    { $set: item },
    { upsert: true }
  );
}

/**
 * Get all CloudDriveItems associated with a user's email.
 * @param email - The email of the user whose items need to be fetched.
 * @returns An array of CloudDriveItems associated with the email.
 */
export async function getDriveItemsByEmail(email: string) {
  const { db } = await connectToDatabase();
  const driveItemsCollection = db.collection("metadrive");

  return driveItemsCollection.find<DriveItem>({ e: email }).toArray();
}

/**
 * Get a specific CloudDriveItem by its ID and associated email.
 * @param id - The ID of the CloudDriveItem to be fetched.
 * @param email - The email of the user who owns the item.
 * @returns The CloudDriveItem or null if not found.
 */
export async function getDriveItemById(id: string, email: string) {
  const { db } = await connectToDatabase();
  const driveItemsCollection = db.collection("metadrive");

  return driveItemsCollection.findOne<DriveItem>({ id, e: email });
}
