import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "https://problabs-backend.onrender.com";
const COOKIE_NAME = "problabs_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", request.url));
  }
  try {
    const resp = await fetch(`${BACKEND_URL}/auth/callback?token=${encodeURIComponent(token)}`, {
      method: "GET",
      cache: "no-store",
    });
    const text = await resp.text();
    if (!resp.ok) {
      return NextResponse.redirect(new URL(`/login?error=backend_${resp.status}`, request.url));
    }
    const data = JSON.parse(text);
    const jwt = data.token;
    if (!jwt) {
      return NextResponse.redirect(new URL("/login?error=no_jwt", request.url));
    }
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set(COOKIE_NAME, jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return response;
  } catch (err) {
    return NextResponse.redirect(new URL("/login?error=fetch_error", request.url));
  }
}
