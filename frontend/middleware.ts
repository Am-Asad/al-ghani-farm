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

// // middleware.ts
// import { NextResponse, NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Define public routes
//   const publicRoutes = ["/", "/sign-in", "/sign-up"];

//   // // Skip protection for public routes
//   if (publicRoutes.some((route) => pathname.startsWith(route))) {
//     return NextResponse.next();
//   }

//   // Check auth cookies
//   const accessToken = req.cookies.get("access_token")?.value;
//   console.log("🚀 ~ middleware ~ accessToken:", accessToken);

//   if (!accessToken) {
//     // Redirect to login
//     const loginUrl = new URL("/sign-in", req.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   // All good → continue request
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };
