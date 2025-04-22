import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateSession } from "./app/firebase/validate-session";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  const { pathname } = new URL(request.url);

  const isAuthRoute = pathname.startsWith("/auth");

  // If session exists and is valid
  if (sessionCookie && (await validateSession(sessionCookie))) {
    // Block access to /auth/* pages for authenticated users
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next(); // Allow all other routes
  }

  // If no valid session and trying to access a protected route
  if (!isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next(); // Allow access to auth pages for unauthenticated users
}

// Match everything so we can handle all routes, but exclude static files
export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|woff2?|ttf|eot)).*)",
  ],
};
