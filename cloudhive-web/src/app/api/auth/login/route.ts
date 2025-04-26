// pages/api/auth/set.ts

import { adminAuth } from "@/firebase/config/firebase-admin";

const COOKIE_EXPIRES_IN = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

export async function POST(req: any) {
  const { idToken } = await req.json();
  if (!idToken) {
    return new Response("ID token is required", { status: 400 });
  }

  try {
    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Create the session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: COOKIE_EXPIRES_IN,
    });

    // Set the session cookie in the response header
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure flag in production
      maxAge: COOKIE_EXPIRES_IN,
      path: "/", // Available for the entire app
    };

    return new Response("Session cookie set successfully", {
      status: 200,
      headers: {
        "Set-Cookie": `session=${sessionCookie}; Path=/; Max-Age=${
          COOKIE_EXPIRES_IN / 1000
        }; HttpOnly; Secure; SameSite=Strict`,
      },
    });
  } catch (error) {
    console.error("Error setting session cookie:", error);
    return new Response("Error setting session cookie", { status: 500 });
  }
}
