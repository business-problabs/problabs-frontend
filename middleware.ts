import { NextRequest, NextResponse } from "next/server";

/**
 * Admin protection middleware
 * Layers:
 * 1) IP allowlist (Cloudflare/Vercel robust, IPv4/IPv6)
 * 2) Basic Auth
 * 3) X-Robots-Tag: noindex, nofollow
 */

const NOINDEX = "noindex, nofollow";

// ✅ Allow BOTH your IPv4 and IPv6
const ALLOWED_IPS = new Set<string>([
  "107.145.105.136",
  "2603:9001:5500:f301:61f6:7e9b:9619:62bd",
]);

function normalizeIp(ip: string): string {
  return ip.trim().toLowerCase().replace(/^::ffff:/, "");
}

function getClientIps(req: NextRequest): string[] {
  // 1) Cloudflare (best / most accurate)
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return [normalizeIp(cf)];

  // 2) Other proxy headers
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return [normalizeIp(realIp)];

  // 3) x-forwarded-for chain (may include multiple)
  const xff = req.headers.get("x-forwarded-for");
  if (!xff) return [];

  return xff
    .split(",")
    .map((s) => normalizeIp(s))
    .filter(Boolean);
}

function parseBasicAuth(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) return null;

  const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
  const idx = decoded.indexOf(":");
  if (idx < 0) return null;

  return {
    user: decoded.slice(0, idx),
    pass: decoded.slice(idx + 1),
  };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdmin =
    pathname.startsWith("/admin-stats") ||
    pathname.startsWith("/api/admin");

  if (!isAdmin) return NextResponse.next();

  // 1) IP allowlist
  const ips = getClientIps(req);
  const allowed = ips.length > 0 && ips.some((ip) => ALLOWED_IPS.has(ip));

  if (!allowed) {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: { "X-Robots-Tag": NOINDEX },
    });
  }

  // 2) Basic Auth
  const ADMIN_USER = process.env.ADMIN_BASIC_USER || "";
  const ADMIN_PASS = process.env.ADMIN_BASIC_PASS || "";

  // fail-closed if creds missing (still noindex)
  if (!ADMIN_USER || !ADMIN_PASS) {
    return new NextResponse("Misconfigured admin auth", {
      status: 500,
      headers: { "X-Robots-Tag": NOINDEX },
    });
  }

  const creds = parseBasicAuth(req);
  if (!creds || creds.user !== ADMIN_USER || creds.pass !== ADMIN_PASS) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Probability Labs Admin"',
        "X-Robots-Tag": NOINDEX,
      },
    });
  }

  // 3) Success
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

export const config = {
  matcher: ["/admin-stats/:path*", "/api/admin/:path*"],
};
