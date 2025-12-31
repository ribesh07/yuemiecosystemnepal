import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = [
  "/orders",
  "/account",
  "/settings",
  "/admin",
];

// paths that should ALWAYS be accessible
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/login-admin",
  "/register",
  "/about",
  "/contact",
  "/api/public",
];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  const isPublic = PUBLIC_PATHS.some((path) =>
    pathname === path || pathname.startsWith(path + "/")
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // Check protected paths
  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
   
    "/orders/:path*",
    "/account/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
