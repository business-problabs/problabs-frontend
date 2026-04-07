/**
 * Next.js Edge Middleware — route protection for ProbLabs.
 *
 * Protected prefixes (anything under these paths requires a valid session):
 *   /dashboard, /pro, /account
 *
 * The session cookie ("pb_session") is a HS256 JWT signed with JWT_SECRET.
 * jose is used for signature verification because Next.js middleware runs in
 * the Edge Runtime, which does not support Node.js crypto.
 *
 * Required env vars (add to .env.local):
 *   JWT_SECRET   – must match the value set on the backend
 */
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "pb_session";

/** Routes that require authentication */
const PROTECTED_PREFIXES = ["/dashboard", "/pro", "/account"];

/** Where to send unauthenticated visitors */
const LOGIN_URL = "/";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL(LOGIN_URL, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return NextResponse.next();
  } catch {
    // Token is expired or invalid — clear the cookie and redirect
    const loginUrl = new URL(LOGIN_URL, request.url);
    loginUrl.searchParams.set("next", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *   - _next/static  (static files)
     *   - _next/image   (image optimisation)
     *   - favicon.ico
     *   - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
