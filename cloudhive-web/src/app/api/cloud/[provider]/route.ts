// app/api/cloud/google/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const urlParams = new URL(req.url).searchParams;
  const uid = urlParams.get("uid"); // Retrieve uid from query string

  if (!uid) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  // Get the environment variables for client_id, redirect_uri, and scopes
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!;
  const scopes = process.env.GOOGLE_SCOPES!;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Client ID and Redirect URI are required" },
      { status: 400 }
    );
  }

  // Generate the auth URL using environment variables
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&state=${uid}&access_type=offline`;

  return NextResponse.json({ authUrl: authUrl });
}
