import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Next.js 16 renamed "middleware" to "proxy" (same mechanism, new name/file).
// Gates every /admin route behind a signed-in session. Login lives at
// /login (outside the matcher below) so it isn't caught in a redirect loop.
export const proxy = auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
