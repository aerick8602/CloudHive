// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "./firebase/config/firebase-admin";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/auth/sign-in");

  if (sessionCookie) {
    try {
      // Verify the Firebase session cookie
      await adminAuth.verifySessionCookie(sessionCookie, true);

      // Cookie is valid
      if (isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    } catch (error) {
      console.error("Invalid Firebase session cookie:", error);
      // Invalid token, treat as unauthenticated
    }
  }

  // If not authenticated and trying to access protected routes
  if (!isAuthPage && !pathname.startsWith("/api/auth/set")) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|woff2?|ttf|eot)).*)",
  ],
};
