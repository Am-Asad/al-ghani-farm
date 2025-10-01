// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/farms",
  "/flocks",
  "/vehicles",
  "/ledgers",
  "/reports",
  "/users",
  "/settings",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // frontend/middleware.ts (add before the protected-routes block)
  if (req.nextUrl.pathname.startsWith("/sign-in")) {
    const token = req.cookies.get("access_token")?.value;
    if (token) return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/farms/:path*",
    "/flocks/:path*",
    "/vehicles/:path*",
    "/ledgers/:path*",
    "/reports/:path*",
    "/users/:path*",
    "/settings/:path*",
  ],
};
