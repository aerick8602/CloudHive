import { adminAuth } from "@/firebase/config/firebase-admin";

const COOKIE_EXPIRES_IN = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return new Response("ID token is required", { status: 400 });
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: COOKIE_EXPIRES_IN,
    });

    // Set session cookie
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
