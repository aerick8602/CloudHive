// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  const isAuthPage = ["/auth/sign-in"].some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // If user has token and tries to visit auth page, redirect to home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user doesn't have token and is visiting protected page, redirect to sign-in
  if (
    !token &&
    !isAuthPage &&
    !request.nextUrl.pathname.startsWith("/api/auth/set")
  ) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

// Match all routes except static files
export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|woff2?|ttf|eot)).*)",
  ],
};
