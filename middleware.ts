import { NextResponse, type NextRequest } from "next/server";

const NOINDEX = "noindex, nofollow";

/**
 * Read allowlist from env:
 * ADMIN_ALLOWED_IPS="107.145.105.136, 2603:9001:..., another-ip"
 *
 * Supports comma/space/newline separated values.
 */
function getAllowedIps(): string[] {
  const raw = process.env.ADMIN_ALLOWED_IPS ?? "";
  return raw
    .split(/[\s,]+/g) // split on commas OR any whitespace/newlines
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Best-effort client IP extraction behind Cloudflare/Vercel:
 * 1) cf-connecting-ip (Cloudflare)  ✅ best for real client IPv4/IPv6
 * 2) x-forwarded-for (first hop)
 * 3) x-real-ip
 * 4) req.ip (may be empty in Edge)
 */
function getClientIp(req: NextRequest): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim().toLowerCase();

  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim().toLowerCase() ?? "";

  const real = req.headers.get("x-real-ip");
  if (real) return real.trim().toLowerCase();

  return (req.ip ?? "").trim().toLowerCase();
}

function withNoIndex(res: NextResponse) {
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

function unauthorized() {
  return withNoIndex(
    new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Probability Labs Admin"',
      },
    })
  );
}

function forbidden(req: NextRequest, clientIp: string, allowedIps: string[]) {
  const res = new NextResponse("Forbidden", { status: 403 });
  res.headers.set("X-Robots-Tag", NOINDEX);

  // Optional debug header (DO NOT leave enabled long-term)
  if ((process.env.ADMIN_DEBUG_IP ?? "") === "1") {
    const cf = req.headers.get("cf-connecting-ip") ?? "";
    const real = req.headers.get("x-real-ip") ?? "";
    const xff = req.headers.get("x-forwarded-for") ?? "";
    res.headers.set(
      "X-Debug-IP",
      `client=${clientIp} | cf=${cf} | real=${real} | xff=${xff} | allowed=${allowedIps.join(",")}`
    );
  }

  return res;
}

export function middleware(req: NextRequest) {
  const allowedIps = getAllowedIps();
  const clientIp = getClientIp(req);

  // 1) Optional IP allowlist
  // If ADMIN_ALLOWED_IPS is empty/not set, we do NOT block by IP.
  if (allowedIps.length > 0 && !allowedIps.includes(clientIp)) {
    return forbidden(req, clientIp, allowedIps);
  }

  // 2) Basic Auth
  const user = process.env.ADMIN_BASIC_USER;
  const pass = process.env.ADMIN_BASIC_PASS;

  // Safety: if creds are missing in an environment, don't lock yourself out
  if (!user || !pass) {
    return withNoIndex(NextResponse.next());
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  const decoded = Buffer.from(auth.slice("Basic ".length), "base64").toString("utf8");
  const idx = decoded.indexOf(":");
  const u = idx >= 0 ? decoded.slice(0, idx) : decoded;
  const p = idx >= 0 ? decoded.slice(idx + 1) : "";

  if (u !== user || p !== pass) return unauthorized();

  // 3) Success
  return withNoIndex(NextResponse.next());
}

export const config = {
  matcher: ["/admin-stats/:path*", "/api/admin/leads/:path*"],
};

