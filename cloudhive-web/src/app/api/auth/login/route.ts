import { adminAuth } from "@/lib/firebase/firebase-admin";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Firebase session cookie name
const SESSION_COOKIE_NAME = "__SESSION";
// Session expiration time (24 hours)
const SESSION_EXPIRES_IN = 60 * 60 * 24 * 1000;

// Sign In API handler
export async function POST(request: NextRequest) {
  try {
    // Extract ID token from request body
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: "ID token is required." },
        { status: 400 }
      );
    }

    // Verify ID token using Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Create session cookie (valid for 2 weeks)
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_IN,
    });

    // Set cookie
    (await cookies()).set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      maxAge: SESSION_EXPIRES_IN / 1000, // Convert to seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true, uid: decodedToken.uid });
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed." },
      { status: 401 }
    );
  }
}
