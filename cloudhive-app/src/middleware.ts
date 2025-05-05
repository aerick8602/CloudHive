// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "_CLOUD_HIVE__SESSION";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isPublicPath =
    pathname.startsWith("/auth/sign-in") ||
    pathname.startsWith("/auth/sign-up") ||
    pathname.startsWith("/api/auth/");

  // ✅ Allow public paths always
  if (isPublicPath) {
    return NextResponse.next();
  }

  // ✅ Allow if session cookie exists
  if (sessionCookie) {
    return NextResponse.next();
  }

  // ❌ Block access to protected routes if no session
  return NextResponse.redirect(new URL("/auth/sign-in", request.url));
}

export const config = {
  matcher: [
    // Exclude _next/static, image files, etc.
    "/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|woff2?|ttf|eot|map)).*)",
  ],
};
