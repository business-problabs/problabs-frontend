import { NextRequest, NextResponse } from "next/server";

const REALM = "Probability Labs Admin";
const NOINDEX = "noindex, nofollow";

function firstIpFromXff(xff: string | null): string {
  if (!xff) return "";
  // x-forwarded-for can be "client, proxy1, proxy2"
  return xff.split(",")[0].trim();
}

function getClientIp(req: NextRequest): string {
  // Cloudflare -> Vercel typically provides cf-connecting-ip
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();

  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();

  const xff = firstIpFromXff(req.headers.get("x-forwarded-for"));
  if (xff) return xff;

  return "";
}

function debugIpHeader(req: NextRequest): string {
  const cf = req.headers.get("cf-connecting-ip") ?? "";
  const real = req.headers.get("x-real-ip") ?? "";
  const xff = req.headers.get("x-forwarded-for") ?? "";
  const ip = getClientIp(req);
  return `client=${ip} | cf=${cf} | real=${real} | xff=${xff}`;
}

function unauthorized(req: NextRequest) {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}"`,
      "X-Robots-Tag": NOINDEX,
      // TEMP DEBUG (safe): shows what IP headers Vercel/Cloudflare provided
      "X-Debug-IP": debugIpHeader(req),
    },
  });
}

function forbidden(req: NextRequest) {
  return new NextResponse("Forbidden", {
    status: 403,
    headers: {
      "X-Robots-Tag": NOINDEX,
      // TEMP DEBUG (safe): shows what IP headers Vercel/Cloudflare provided
      "X-Debug-IP": debugIpHeader(req),
    },
  });
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Only guard admin routes
  const isAdmin =
    pathname === "/admin-stats" ||
    pathname.startsWith("/admin-stats/") ||
    pathname.startsWith("/api/admin/");

  if (!isAdmin) return NextResponse.next();

  // 1) Optional IP allowlist (exact match)
  // Put BOTH IPv4 + IPv6 in this env var (comma-separated)
  const allowRaw = process.env.ADMIN_ALLOWED_IPS ?? "";
  const allowed = allowRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (allowed.length > 0) {
    const ip = getClientIp(req);
    if (!ip || !allowed.includes(ip)) {
      return forbidden(req);
    }
  }

  // 2) Basic auth
  const user = process.env.ADMIN_BASIC_USER ?? "";
  const pass = process.env.ADMIN_BASIC_PASS ?? "";

  const auth = req.headers.get("authorization") ?? "";
  const [scheme, encoded] = auth.split(" ");

  if (scheme !== "Basic" || !encoded) return unauthorized(req);

  let decoded = "";
  try {
    decoded = Buffer.from(encoded, "base64").toString("utf8");
  } catch {
    return unauthorized(req);
  }

  const idx = decoded.indexOf(":");
  const givenUser = idx >= 0 ? decoded.slice(0, idx) : "";
  const givenPass = idx >= 0 ? decoded.slice(idx + 1) : "";

  if (givenUser !== user || givenPass !== pass) {
    return unauthorized(req);
  }

  // 3) Success: pass through + noindex (+ debug for now)
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", NOINDEX);
  res.headers.set("X-Debug-IP", debugIpHeader(req)); // TEMP DEBUG
  return res;
}

export const config = {
  matcher: ["/admin-stats/:path*", "/api/admin/:path*"],
};

