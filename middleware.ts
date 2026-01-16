import { NextResponse, type NextRequest } from "next/server";

const NOINDEX = "noindex, nofollow";
const REALM = 'Basic realm="Probability Labs Admin"';

function withNoIndex(res: NextResponse) {
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

function unauthorized(req?: NextRequest) {
  const res = new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": REALM },
  });

  // Optional debug
  if (process.env.ADMIN_DEBUG_IP === "1" && req) {
    res.headers.set("X-PL-Debug", debugIp(req, "401"));
  }

  return withNoIndex(res);
}

function forbidden(req: NextRequest) {
  const res = new NextResponse("Forbidden", { status: 403 });

  // Optional debug
  if (process.env.ADMIN_DEBUG_IP === "1") {
    res.headers.set("X-PL-Debug", debugIp(req, "403"));
  }

  return withNoIndex(res);
}

function parseAllowedIps(): string[] {
  const raw = process.env.ADMIN_ALLOWED_IPS ?? "";
  return raw
    .split(/[\s,]+/g) // commas OR whitespace/newlines
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Best-effort client IP extraction behind Cloudflare/Vercel:
 * 1) cf-connecting-ip (Cloudflare real visitor IP) ✅
 * 2) x-forwarded-for (first hop)
 * 3) x-real-ip
 */
function getClientIp(req: NextRequest): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();

  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "";

  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();

  return "";
}

function isIPv4(ip: string) {
  return ip.includes(".") && !ip.includes(":");
}

function debugIp(req: NextRequest, code: string) {
  const cf = req.headers.get("cf-connecting-ip") ?? "";
  const real = req.headers.get("x-real-ip") ?? "";
  const xff = req.headers.get("x-forwarded-for") ?? "";
  const client = getClientIp(req);
  const allowed = parseAllowedIps().join(",");
  return `code=${code} client=${client} cf=${cf} real=${real} xff=${xff} allowed=${allowed}`;
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Only protect admin routes
  const isAdmin =
    path.startsWith("/admin-stats") || path.startsWith("/api/admin/leads");
  if (!isAdmin) return NextResponse.next();

  // 1) Optional IP allowlist — but only enforce for IPv4 (stable).
  // IPv6 often rotates on home ISPs and causes random lockouts.
  const allowed = parseAllowedIps();
  if (allowed.length > 0) {
    const client = getClientIp(req);

    if (client && isIPv4(client)) {
      // enforce allowlist for IPv4 only
      if (!allowed.includes(client)) return forbidden(req);
    }
    // if IPv6 (or unknown), skip allowlist and fall through to Basic Auth
  }

  // 2) Basic Auth
  const user = process.env.ADMIN_BASIC_USER;
  const pass = process.env.ADMIN_BASIC_PASS;

  // Safety: if creds missing, don't lock yourself out
  if (!user || !pass) {
    return withNoIndex(NextResponse.next());
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized(req);

  let decoded = "";
  try {
    decoded = Buffer.from(auth.slice("Basic ".length), "base64").toString("utf8");
  } catch {
    return unauthorized(req);
  }

  const idx = decoded.indexOf(":");
  const u = idx >= 0 ? decoded.slice(0, idx) : "";
  const p = idx >= 0 ? decoded.slice(idx + 1) : "";

  if (u !== user || p !== pass) return unauthorized(req);

  // 3) Success
  const res = NextResponse.next();
  return withNoIndex(res);
}

export const config = {
  matcher: ["/admin-stats/:path*", "/api/admin/leads/:path*"],
};

