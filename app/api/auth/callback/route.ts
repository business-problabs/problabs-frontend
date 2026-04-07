/**
 * GET /api/auth/callback?token=<magic-link-jwt>
 *
 * This route is the landing point for magic-link emails.
 * It forwards the token to the backend for verification, receives a session JWT,
 * sets it as an httpOnly cookie, and redirects the user to /dashboard.
 *
 * The cookie is set here (server-side in Next.js) so it is httpOnly and
 * never exposed to client-side JavaScript.
 */
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE    = "pb_session";
const SESSION_DAYS      = 30;
const BACKEND_BASE_URL  = process.env.BACKEND_BASE_URL ?? "http://127.0.0.1:8000";
const SITE_URL          = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/?auth=missing-token", SITE_URL));
  }

  let sessionToken: string;
  let email: string;

  try {
    const res = await fetch(
      `${BACKEND_BASE_URL}/auth/callback?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // Don't follow backend redirects — we want the JSON response
        redirect: "manual",
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const detail = (body as { detail?: string }).detail ?? "Authentication failed";
      return NextResponse.redirect(
        new URL(`/?auth=error&reason=${encodeURIComponent(detail)}`, SITE_URL)
      );
    }

    const data = await res.json() as {
      ok: boolean;
      token: string;
      email: string;
      user_id: number;
    };

    sessionToken = data.token;
    email        = data.email;
  } catch (err) {
    console.error("[auth/callback] backend request failed:", err);
    return NextResponse.redirect(new URL("/?auth=error&reason=server", SITE_URL));
  }

  // Set httpOnly session cookie and redirect to dashboard
  const response = NextResponse.redirect(new URL("/dashboard", SITE_URL));
  response.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   SESSION_DAYS * 24 * 60 * 60,
    path:     "/",
  });

  return response;
}
