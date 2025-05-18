import { adminAuth } from "@/lib/firebase/firebase-admin";

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = process.env.SESSION!;
const SESSION_EXPIRES_IN = Number(process.env.SESSION_TTL!); // 24 hours in ms

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: "ID token is required." },
        { status: 400 }
      );
    }

    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);

      const sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn: SESSION_EXPIRES_IN,
      });

      const response = NextResponse.json({
        success: true,
        uid: decodedToken.uid,
      });

      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: sessionCookie,
        maxAge: SESSION_EXPIRES_IN / 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });

      return response;
    } catch (error: any) {
      console.error("Token verification error:", error);

      // Handle specific Firebase Auth errors
      if (error.code === "auth/invalid-id-token") {
        return NextResponse.json(
          { success: false, error: "Invalid ID token. Please sign in again." },
          { status: 401 }
        );
      }

      if (error.code === "auth/id-token-expired") {
        return NextResponse.json(
          {
            success: false,
            error: "ID token has expired. Please sign in again.",
          },
          { status: 401 }
        );
      }

      throw error; // Re-throw other errors to be caught by outer catch
    }
  } catch (error: any) {
    console.error("Sign in error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Authentication failed.",
        details: error.message || "Unknown error occurred",
      },
      { status: 401 }
    );
  }
}
