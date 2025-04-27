// app/api/cloud/google/callback/route.ts
import { connectToDatabase } from "@/lib/db/mongo.config";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    console.log("Error: Missing code or state");
    return NextResponse.json(
      { error: "Missing code or state" },
      { status: 400 }
    );
  }

  console.log("Authorization code and state received:", { code, state });

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens received:", tokens);

    oauth2Client.setCredentials(tokens);

    // Get user information from Google
    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const userinfo = await oauth2.userinfo.get();
    const email = userinfo.data.email;

    console.log("User info:", userinfo.data);

    if (!email) {
      console.log("Error: Unable to fetch email");
      return NextResponse.json(
        { error: "Unable to fetch email" },
        { status: 400 }
      );
    }

    // Asynchronously handle the database updates
    async function handleDatabaseUpdates() {
      const { db } = await connectToDatabase();
      console.log("Connected to MongoDB");

      const accountsCollection = db.collection("accounts");
      const usersCollection = db.collection("users");

      // Check if the account already exists in the database
      let account = await accountsCollection.findOne({ email });

      console.log("Found account:", account);

      if (account) {
        // Update the tokens and add the user if the account exists
        console.log("Updating existing account...");
        await accountsCollection.updateOne(
          { _id: account._id },
          {
            $set: {
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token || account.refreshToken, // Use stored refresh token if not provided
              expiryDate: tokens.expiry_date,
              sync: Date.now(),
            },
            $addToSet: {
              userIds: state, // Link the account to the user using the UID
            },
          }
        );
      } else {
        // Create a new account if it doesn't exist
        console.log("Creating new account...");
        const result = await accountsCollection.insertOne({
          email,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token, // Save the refresh token
          expiryDate: tokens.expiry_date,
          sync: Date.now(),
          userIds: [state], // Link the account to the user using UID
        });
        account = { _id: result.insertedId };
        console.log("New account created:", account);
      }

      // Update or create the user and link the account
      console.log("Updating user document...");
      await usersCollection.updateOne(
        { uid: state },
        {
          $addToSet: {
            driveAccounts: account._id, // Add the account reference to the user's document
          },
        },
        { upsert: true }
      );
      console.log("User document updated or created");
    }

    // Start background task to handle the database update
    handleDatabaseUpdates().catch((error) => {
      console.error("Background task error:", error);
    });

    // Redirect to the dashboard or any desired route after successful linking
    return NextResponse.redirect(new URL("/", req.url)); // Change this as necessary
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json({ error: "Callback error" }, { status: 500 });
  }
}
