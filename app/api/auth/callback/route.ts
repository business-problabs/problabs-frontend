import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "https://problabs-backend.onrender.com";
const COOKIE_NAME = "problabs_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", request.url));
  }

  // Exchange magic token for session JWT via backend
  const resp = await fetch(`${BACKEND_URL}/auth/callback?token=${token}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!resp.ok) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", request.url));
  }

  const data = await resp.json();
  const jwt = data.jwt || data.access_token || data.token;

  if (!jwt) {
    return NextResponse.redirect(new URL("/login?error=no_token", request.url));
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set(COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}
