import { NextResponse, type NextRequest } from "next/server";

/**
 * Admin-route hardening:
 * 1) IP allowlist (403 if not allowed)
 * 2) Basic Auth (401 challenge)
 * 3) X-Robots-Tag: noindex (on ALL admin responses)
 *
 * Routes protected:
 * - /admin-stats/*
 * - /api/admin/leads/*
 */

// ✅ Put your current public IP(s) here
const ALLOWED_IPS = [
  "107.145.105.136",
  // "x.x.x.x", // add your hotspot / office IP if needed
];

const NOINDEX = "noindex, nofollow";

function unauthorized(message = "Unauthorized") {
  return new NextResponse(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="ProbLabs Admin"',
      "X-Robots-Tag": NOINDEX,
    },
  });
}

function forbidden() {
  return new NextResponse("Forbidden", {
    status: 403,
    headers: {
      "X-Robots-Tag": NOINDEX,
    },
  });
}

export function middleware(req: NextRequest) {
  // Vercel provides x-forwarded-for; first IP is the client
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    (req as any).ip ??
    "";

  // 1) IP allowlist
  if (ALLOWED_IPS.length && !ALLOWED_IPS.includes(ip)) {
    return forbidden();
  }

  // 2) Basic Auth
  const user = process.env.ADMIN_BASIC_USER;
  const pass = process.env.ADMIN_BASIC_PASS;

  // Safety: if creds missing, do not lock yourself out
  if (!user || !pass) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", NOINDEX);
    return res;
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return unauthorized();
  }

  let decoded = "";
  try {
    decoded = Buffer.from(auth.slice("Basic ".length), "base64").toString("utf8");
  } catch {
    return unauthorized();
  }

  const [u, p] = decoded.split(":");
  if (u !== user || p !== pass) {
    return unauthorized();
  }

  // 3) Success: pass through + noindex header
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

export const config = {
  matcher: ["/admin-stats/:path*", "/api/admin/leads/:path*"],
};

