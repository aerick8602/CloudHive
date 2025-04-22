import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateSession } from "./app/firebase/validate-session";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
  const isValid = await validateSession(sessionCookie);
  if (isValid) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/auth/sign-in", request.url));
}

// matcher config to exclude static assets (CSS, JS, _next) and auth pages
export const config = {
  matcher: [
    // Match all routes except for:
    // - _next (Next.js internals)
    // - static file types (js, css, images, fonts, etc.)
    // - auth routes like /auth/sign-in
    "/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|woff2?|ttf|eot)|auth).*)",
    "/(api|trpc)(.*)",
  ],
};
