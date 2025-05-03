import redis from "@/lib/cache/redis.config";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;

  if (!uid) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  const redisKey = `oauth-url:${uid}`;

  // Check if the OAuth URL is cached
  const cachedAuthUrl = await redis.get(redisKey);
  if (cachedAuthUrl) {
    console.log("Serving authUrl from Redis cache");
    return NextResponse.json(cachedAuthUrl);
  }

  // Generate OAuth URL
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  const scopes = process.env.GOOGLE_SCOPES!;
  if (!scopes) {
    return NextResponse.json({ error: "Scopes are required" }, { status: 400 });
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: uid,
    prompt: "consent",
  });

  // Cache in Redis for 24 hours
  await redis.set(redisKey, authUrl, "EX", 3600 * 24);

  console.log("Auth URL generated and cached");

  return NextResponse.json(authUrl);
}
