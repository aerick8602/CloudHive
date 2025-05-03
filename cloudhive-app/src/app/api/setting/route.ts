import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Set cookies for app_mode and session
export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode");
  const password = url.searchParams.get("password");

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  // 1. If password is missing or incorrect, return Unauthorized
  if (password && password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Unauthorized: Incorrect password" },
      { status: 403 }
    );
  }

  // 2. Default to "production" if mode or password is missing
  const finalMode = mode && mode !== "" ? mode : "production";

  // 3. Set the app_mode cookie
  const response = NextResponse.json({ mode: finalMode });

  // Set cookie for app_mode (default to production if not provided)
  (await cookies()).set({
    name: "APP_MODE",
    value: finalMode,
    maxAge: 5 * 60, // 5 min in seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  // Return the response with the mode
  return response;
}
