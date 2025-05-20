import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongo.config";
import { convertISTToMillis } from "@/utils/time";
import redis from "@/lib/cache/redis.config";

export async function GET(request: Request) {
  console.log("[CRON] Starting token check cron job at:", new Date().toISOString());

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error("[CRON] Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[CRON] Connecting to database...");
    const { db } = await connectToDatabase();
    const accountsCollection = db.collection("accounts");
    const currentTime = Date.now();

    const accounts = await accountsCollection.find({
      rtv: { $exists: true },
      a: true, 
    }).toArray();

    let updatedCount = 0;
    const updatePromises = [];
    const affectedUids = new Set<string>();

    for (const account of accounts) {
      const refreshTokenExpiry = convertISTToMillis(account.rtv);

      if (currentTime >= refreshTokenExpiry - 24 * 60 * 60 * 1000) {
        console.log(`[CRON] Account ${account.e} needs update - token expiring soon`);
        // Update account status
        updatePromises.push(
          accountsCollection.updateOne(
            { _id: account._id },
            {
              $set: {
                a: false, 
                c: false, 
              },
            }
          ).then(() => {
            console.log(`[CRON] Successfully updated account ${account.e}`);
          })
        );
        updatedCount++;

        if (account.uids && Array.isArray(account.uids)) {
          account.uids.forEach((uid: string) => affectedUids.add(uid));
        }
      }
    }


    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }

    
    if (affectedUids.size > 0) {
      const cacheClearPromises = Array.from(affectedUids).map(async (uid) => {
        const cacheKey = `accounts:${uid}`;
        await redis.del(cacheKey);
        console.log(`[CRON] Cleared cache for user ${uid}`);
      });

      await Promise.all(cacheClearPromises);
    } else {
      console.log("[CRON] No cache clearing needed");
    }

    const response = {
      success: true,
      message: `Updated ${updatedCount} accounts and cleared cache for ${affectedUids.size} users`,
      timestamp: new Date().toISOString(),
    };
    console.log("[CRON] Job completed successfully:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("[CRON] Error in token check cron job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 