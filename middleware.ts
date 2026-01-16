import { NextResponse, type NextRequest } from "next/server";

const NOINDEX = "noindex, nofollow";
const REALM = 'Basic realm="Probability Labs Admin"';

function withNoIndex(res: NextResponse) {
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

function parseAllowedIPs(): string[] {
  const raw = process.env.ADMIN_ALLOWED_IPS ?? "";
  return raw
    .split(/[\s,]+/g) // commas OR whitespace/newlines
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function getClientIP(req: NextRequest): {
  client: string;
  cf: string;
  real: string;
  xff: string;
} {
  const cf = (req.headers.get("cf-connecting-ip") ?? "").trim();
  const xff = (req.headers.get("x-forwarded-for") ?? "").trim();
  const real = (req.headers.get("x-real-ip") ?? "").trim();

  const client =
    (cf || xff.split(",")[0] || real || req.ip || "").trim().toLowerCase();

  return {
    client,
    cf: cf.toLowerCase(),
    real: real.toLowerCase(),
    xff: xff.toLowerCase(),
  };
}

function unauthorized() {
  return withNoIndex(
    new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": REALM },
    })
  );
}

function forbidden(req: NextRequest, debug?: string) {
  const res = new NextResponse("Forbidden", { status: 403 });
  res.headers.set("X-Robots-Tag", NOINDEX);
  if (process.env.ADMIN_DEBUG_IP === "1" && debug) {
    res.headers.set("X-Debug-IP", debug);
  }
  return res;
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Only protect admin routes
  const isAdmin =
    path.startsWith("/admin-stats") || path.startsWith("/api/admin/leads");
  if (!isAdmin) return NextResponse.next();

  // 1) Optional IP allowlist
  const allowed = parseAllowedIPs();
  const { client, cf, real, xff } = getClientIP(req);

  // IMPORTANT FIX:
  // Only enforce allowlist if we successfully detected a client IP.
  // If client IP is empty (can happen on some IPv6/edge paths), fall back to Basic Auth only.
  if (allowed.length > 0 && client && !allowed.includes(client)) {
    const debug = `client=${client} | cf=${cf} | real=${real} | xff=${xff} | allowed=${allowed.join(",")}`;
    return forbidden(req, debug);
  }

  // 2) Basic Auth
  const user = process.env.ADMIN_BASIC_USER;
  const pass = process.env.ADMIN_BASIC_PASS;

  // Safety: if creds missing, don't lock yourself out
  if (!user || !pass) return withNoIndex(NextResponse.next());

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  let decoded = "";
  try {
    decoded = Buffer.from(auth.slice("Basic ".length), "base64").toString("utf8");
  } catch {
    return unauthorized();
  }

  const idx = decoded.indexOf(":");
  const u = idx >= 0 ? decoded.slice(0, idx) : "";
  const p = idx >= 0 ? decoded.slice(idx + 1) : "";

  if (u !== user || p !== pass) return unauthorized();

  // 3) Success
  return withNoIndex(NextResponse.next());
}

export const config = {
  matcher: ["/admin-stats/:path*", "/api/admin/leads/:path*"],
};

