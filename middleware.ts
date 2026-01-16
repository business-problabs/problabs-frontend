import { NextResponse, type NextRequest } from "next/server";

/**
 * Admin lock:
 * 1) Optional IP allowlist via ADMIN_ALLOWED_IPS (comma-separated IPv4/IPv6)
 * 2) Basic auth via ADMIN_BASIC_USER / ADMIN_BASIC_PASS
 * 3) X-Robots-Tag: noindex on ALL admin responses
 *
 * Optional:
 * - ADMIN_DEBUG_IP=1 will add X-Debug-IP header on 403 responses
 */

const NOINDEX = "noindex, nofollow";

function withNoIndex(res: NextResponse) {
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

function unauthorized(realm = 'Basic realm="Probability Labs Admin"') {
  return withNoIndex(
    new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": realm },
    })
  );
}

function forbidden(debugHeader?: string) {
  const res = new NextResponse("Forbidden", { status: 403 });
  res.headers.set("X-Robots-Tag", NOINDEX);
  if (debugHeader) res.headers.set("X-Debug-IP", debugHeader);
  return res;
}

function parseAllowedIPs(envValue: string | undefined): string[] {
  if (!envValue) return [];
  return envValue
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Prefer Cloudflare's real client IP when available.
 * - cf-connecting-ip: real visitor IP (IPv4/IPv6)
 * - x-real-ip: sometimes set by proxies
 * - x-forwarded-for: first IP can be client, but behind Cloudflare can be noisy
 */
function getClientIP(req: NextRequest) {
  const cf = req.headers.get("cf-connecting-ip")?.trim() ?? "";
  const real = req.headers.get("x-real-ip")?.trim() ?? "";
  const xff = (req.headers.get("x-forwarded-for") ?? "")
    .split(",")[0]
    ?.trim();

  const client =
    cf ||
    real ||
    xff ||
    req.ip ||
    "";

  return { client, cf, real, xff: xff ?? "" };
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isAdminRoute =
    pathname.startsWith("/admin-stats") ||
    pathname.startsWith("/api/admin/leads");

  if (!isAdminRoute) return NextResponse.next();

  // --- 1) IP allowlist (optional) ---
  const allowed = parseAllowedIPs(process.env.ADMIN_ALLOWED_IPS);
  const { client, cf, real, xff } = getClientIP(req);

  if (allowed.length > 0 && !allowed.includes(client)) {
    const debugOn = process.env.ADMIN_DEBUG_IP === "1";
    const debug = debugOn
      ? `client=${client} | cf=${cf} | real=${real} | xff=${xff}`
      : undefined;

    return forbidden(debug);
  }

  // --- 2) Basic Auth ---
  const user = process.env.ADMIN_BASIC_USER;
  const pass = process.env.ADMIN_BASIC_PASS;

  // Safety: if creds missing, don't lock yourself out
  if (!user || !pass) {
    return withNoIndex(NextResponse.next());
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  const decoded = Buffer.from(auth.slice("Basic ".length), "base64").toString("utf8");
  const [u, p] = decoded.split(":");

  if (u !== user || p !== pass) return unauthorized();

  // --- 3) Success: pass through + noindex header ---
  return withNoIndex(NextResponse.next());
}

export const config = {
  matcher: ["/admin-stats/:path*", "/api/admin/leads/:path*"],
};

