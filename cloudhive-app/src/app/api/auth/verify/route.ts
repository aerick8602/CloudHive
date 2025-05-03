import { adminAuth } from "@/lib/firebase/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Firebase session cookie name
const SESSION_COOKIE_NAME = "_CLOUD_HIVE__SESSION";

// Session Verification API handler
export async function GET() {
  try {
    // Get the session cookie from the request headers
    const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME);

    if (!sessionCookie) {
      return NextResponse.json(false, { status: 401 });
    }

    // Verify the session cookie using Firebase Admin SDK
    const decodedToken = await adminAuth.verifySessionCookie(
      sessionCookie.value,
      true
    ); // true ensures it checks for expiration

    // Return the decoded token (user information)
    return NextResponse.json(true);
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      { success: false, error: "Session verification failed." },
      { status: 401 }
    );
  }
}
