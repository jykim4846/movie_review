import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const isLoggedIn = Boolean(request.auth?.user);
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/diary") ||
    request.nextUrl.pathname.startsWith("/movies") ||
    request.nextUrl.pathname.startsWith("/logs");
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/diary", request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/diary/:path*", "/movies/:path*", "/logs/:path*", "/login", "/signup"],
};
