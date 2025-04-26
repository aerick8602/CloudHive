import { NextResponse } from "next/server";

// This will handle the POST request for clearing the session cookie
export async function POST() {
  try {
    // Clear the session cookie by setting its expiration date to the past
    const headers = new Headers();
    headers.set(
      "Set-Cookie",
      "session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict"
    );

    // Return a success response
    return NextResponse.json(
      { message: "Session cleared successfully" },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error clearing session cookie:", error);
    return NextResponse.json(
      { message: "Error clearing session cookie" },
      { status: 500 }
    );
  }
}
