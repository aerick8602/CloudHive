// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;
  // const sessionCookie = request.cookies.get("_CLOUD_HIVE__SESSION")?.value;
  // const isAuthPage =
  //   pathname.startsWith("/auth/sign-in") ||
  //   pathname.startsWith("/auth/sign-up");
  // const isApiAuthRoute = pathname.startsWith("/api/auth/");

  // // 1. Allow all /api/auth/* requests
  // if (isApiAuthRoute) {
  //   return NextResponse.next();
  // }

  // // 2. If user has a session
  // if (sessionCookie) {
  //   if (isAuthPage) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  //   return NextResponse.next();
  // }

  // // 3. If no session and not on auth pages
  // if (!isAuthPage) {
  //   return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  // }

  // 4. Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|woff2?|ttf|eot)).*)",
  ],
};
