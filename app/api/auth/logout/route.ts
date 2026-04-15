import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "problabs_session";

export async function POST(request: NextRequest) {
  // Clear the session cookie and redirect to login.
  // Using a 200 HTML response (not a redirect) to ensure Set-Cookie is not stripped.
  const html = `<!DOCTYPE html><html><head>
<meta http-equiv="refresh" content="0;url=/login">
<script>window.location.replace("/login");</script>
</head><body>Signing out...</body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Set-Cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    },
  });
}
