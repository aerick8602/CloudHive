import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongo.config";
import { convertISTToMillis } from "@/utils/time";
import redis from "@/lib/cache/redis.config";


export async function GET(request: Request) {

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
          )
        );
        updatedCount++;

       
        if (account.uids && Array.isArray(account.uids)) {
          account.uids.forEach((uid: string) => affectedUids.add(uid));
        }
      }
    }

    // Execute all updates
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }

    // Clear cache for all affected users
    const cacheClearPromises = Array.from(affectedUids).map(async (uid) => {
      const cacheKey = `accounts:${uid}`;
      await redis.del(cacheKey);
    });

    if (cacheClearPromises.length > 0) {
      await Promise.all(cacheClearPromises);
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} accounts and cleared cache for ${affectedUids.size} users`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in token check cron job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 