import { NextRequest, NextResponse } from "next/server";
const COOKIE_NAME = "problabs_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/login?error=missing_token", request.url));
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: COOKIE_MAX_AGE, path: "/" });
  return response;
}
