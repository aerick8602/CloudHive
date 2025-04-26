// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/auth/sign-in");

  if (sessionCookie) {
    if (isAuthPage) {
      // 👇 use rewrite instead of redirect
      return NextResponse.rewrite(new URL("/", request.url));
    }
    return NextResponse.next();
  }

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
