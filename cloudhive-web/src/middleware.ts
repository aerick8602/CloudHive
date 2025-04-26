// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/auth/sign-in");

  if (isAuthPage) {
    if (token) {
      // Already authenticated, rewrite to home before hitting auth page
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    }
    // If not authenticated, allow to continue to auth page
    return NextResponse.next();
  }

  // If visiting other protected pages
  if (!token && !pathname.startsWith("/api/auth/set")) {
    const url = new URL("/auth/sign-in", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|woff2?|ttf|eot)).*)",
  ],
};
