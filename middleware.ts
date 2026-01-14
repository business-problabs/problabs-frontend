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
import { NextRequest, NextResponse } from "next/server";

/**
 * Admin protection middleware
 *
 * Layers:
 * 1) IP allowlist (IPv4 + IPv6, Cloudflare-aware)
 * 2) Basic Auth
 * 3) X-Robots-Tag: noindex, nofollow
 */

const ADMIN_USER = process.env.ADMIN_BASIC_USER || "";
const ADMIN_PASS = process.env.ADMIN_BASIC_PASS || "";

// 🔒 Allowed IPs (IPv4 + IPv6)
const ALLOWED_IPS = [
  "107.145.105.136",
  "2603:9001:5500:f301:61f6:7e9b:9619:62bd",
];

const NOINDEX = "noindex, nofollow";

// Decode Basic Auth header
function parseBasicAuth(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) return null;

  const decoded = Buffer.from(auth.slice(6), "base64").toString();
  const [user, pass] = decoded.split(":");
  return { user, pass };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin routes
  if (
    !pathname.startsWith("/admin-stats") &&
    !pathname.startsWith("/api/admin")
  ) {
    return NextResponse.next();
  }

  // 🔍 Get real client IP (Cloudflare-first)
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim() ??
    "";

  // 1️⃣ IP allowlist check
  if (!ALLOWED_IPS.includes(ip)) {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: {
        "X-Robots-Tag": NOINDEX,
      },
    });
  }

  // 2️⃣ Basic Auth check
  const creds = parseBasicAuth(req);
  if (
    !creds ||
    creds.user !== ADMIN_USER ||
    creds.pass !== ADMIN_PASS
  ) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="ProbLabs Admin"',
        "X-Robots-Tag": NOINDEX,
      },
    });
  }

  // 3️⃣ Success — allow request + block indexing
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

// Apply middleware only to admin routes
export const config = {
  matcher: ["/admin-stats", "/api/admin/:path*"],
};



