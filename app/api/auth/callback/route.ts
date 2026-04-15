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

    // Return a 200 HTML page that sets the cookie and immediately redirects.
    // Using 200 (not 307) prevents Vercel's edge from stripping Set-Cookie headers
    // that are dropped on redirect responses.
    const cookieHeader = `${COOKIE_NAME}=${jwt}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
    const html = `<!DOCTYPE html><html><head>
<meta http-equiv="refresh" content="0;url=/dashboard">
<script>window.location.replace("/dashboard");</script>
</head><body>Signing in...</body></html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Set-Cookie": cookieHeader,
      },
    });
  } catch (err) {
    return NextResponse.redirect(new URL("/login?error=fetch_error", request.url));
  }
}
