import { connectToDatabase } from "@/lib/db/mongo.config";
import { convertMillisToIST } from "@/utils/time";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

interface GoogleTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
  refresh_token_expires_in?: number;
  expiry_date?: number;
}

export async function GET(req: NextRequest) {
  console.log("⚡ [Callback] Starting GET handler");

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    console.error("❌ Missing code or state");
    return NextResponse.json(
      { error: "Missing code or state" },
      { status: 400 }
    );
  }

  console.log("✅ Authorization code and state received:", { code, state });

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("✅ Tokens received :", tokens);

    const typedTokens = tokens as GoogleTokens;
    oauth2Client.setCredentials(typedTokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data: userinfo } = await oauth2.userinfo.get();
    const email = userinfo.email;

    if (!email || typeof email !== "string") {
      console.error("❌ Unable to fetch valid email");
      return NextResponse.json(
        { error: "Unable to fetch email" },
        { status: 400 }
      );
    }

    console.log("✅ User info fetched:", { email });

    // 🚀 FIRE-AND-FORGET background DB task
    // using await because ux is not ready yet
    await (async () => {
      console.log("🛠️ [Background] Starting database update task");
      try {
        const { db } = await connectToDatabase();
        const accountsCollection = db.collection("accounts");
        const usersCollection = db.collection("users");

        console.log("✅ Database connected");

        const drive = google.drive({ version: "v3", auth: oauth2Client });
        const about = await drive.about.get({ fields: "storageQuota" });
        const storageQuota = about.data.storageQuota;

        const totalQuota = storageQuota?.limit ? Number(storageQuota.limit) : 0;
        const usedQuota = storageQuota?.usage ? Number(storageQuota.usage) : 0;

        console.log("✅ Storage quota fetched:", { totalQuota, usedQuota });

        let account = await accountsCollection.findOne({ e: email });

        if (account) {
          console.log("🔄 Updating existing account:", account._id);
          await accountsCollection.updateOne(
            { _id: account._id },
            {
              $set: {
                at: typedTokens.access_token,
                rt: typedTokens.refresh_token || account.rt,
                atv: convertMillisToIST(typedTokens.expiry_date!),
                rtv: convertMillisToIST(
                  Date.now() +
                    (typedTokens.refresh_token_expires_in ?? 0) * 1000
                ),
                q: { l: totalQuota, u: usedQuota },
                sync: convertMillisToIST(Date.now()),
              },
              $addToSet: { uids: state },
            }
          );
          console.log("✅ Existing account updated");
        } else {
          console.log("➕ Creating new account for email:", email);
          const result = await accountsCollection.insertOne({
            e: email,
            at: typedTokens.access_token,
            rt: typedTokens.refresh_token,
            atv: convertMillisToIST(typedTokens.expiry_date!),
            rtv: convertMillisToIST(
              Date.now() + (typedTokens.refresh_token_expires_in ?? 0) * 1000
            ),
            q: { l: totalQuota, u: usedQuota },
            sync: convertMillisToIST(Date.now()),
            uids: [state],
          });
          account = await accountsCollection.findOne({
            _id: result.insertedId,
          });
          console.log("✅ New account created:", result.insertedId);
        }

        (async () => {
          if (account) {
            console.log("🔗 Linking account to user...");
            await usersCollection.updateOne(
              { uid: state },
              { $addToSet: { aids: account._id } },
              { upsert: true }
            );
            console.log("✅ User document updated/created");
          } else {
            console.error(
              "❌ Failed to find or create account after insert/update"
            );
          }
        })();
      } catch (dbError) {
        console.error("❌ Background database task error:", dbError);
      }
    })();

    console.log("🚀 Redirecting user immediately");
    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    console.error("❌ Callback processing error:", error);
    return NextResponse.json({ error: "Callback error" }, { status: 500 });
  }
}
