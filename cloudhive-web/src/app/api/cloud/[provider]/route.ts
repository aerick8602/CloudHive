import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req: Request) {
  const urlParams = new URL(req.url).searchParams;
  const uid = urlParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  const scopes = process.env.GOOGLE_SCOPES!;
  if (!scopes) {
    return NextResponse.json({ error: "Scopes are required" }, { status: 400 });
  }

  // Generate the auth URL with the necessary parameters
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // Request offline access to get refresh token
    scope: scopes,
    state: uid, // Pass the UID as state to keep track of user
    // prompt: "consent", // Force the consent screen every time
  });

  return NextResponse.json({ authUrl });
}
