import { NextResponse, type NextRequest } from "next/server";

/**
 * Admin security middleware
 *
 * Protects:
 *  - /admin-stats/*
 *  - /api/admin/leads/*
 *
 * Layers:
 * 1) Optional IP allowlist (ADMIN_ALLOWED_IPS)
 * 2) Basic Auth (ADMIN_BASIC_USER / ADMIN_BASIC_PASS)
 * 3) X-Robots-Tag: noindex, nofollow
 */

const NOINDEX = "noindex, nofollow";
const REALM = 'Basic realm="Probability Labs Admin"';

/* ----------------------------------------
   Helpers
----------------------------------------- */

function getClientIp(req: NextRequest): string {
  // Cloudflare (most reliable)
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();

  // Proxy chain
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();

  // Fallback
  // @ts-ignore
  return (req.ip || "").trim();
}

function getAllowlist(): string[] {
  const raw = process.env.ADMIN_ALLOWED_IPS || "";
  return raw
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);
}

function ipAllowed(clientIp: string, allowlist: string[]): boolean {
  // Allowlist disabled
  if (!allowlist.length) return true;
  if (!clientIp) return false;

  for (const entry of allowlist) {
    // IPv6 wildcard prefix support
    // Example: 2603:9001:5500:f301:*
    if (entry.includes("*")) {
      const prefix = entry.replace("*", "");
      if (clientIp.startsWith(prefix)) return true;
      continue;
    }

    // Exact match (IPv4 or IPv6)
    if (clientIp === entry) return true;
  }

  return false;
}

/* ----------------------------------------
   Responses
----------------------------------------- */

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": REALM,
      "X-Robots-Tag": NOINDEX,
    },
  });
}

function forbidden(req: NextRequest, clientIp: string) {
  const res = new NextResponse("Forbidden", {
    status: 403,
    headers: {
      "X-Robots-Tag": NOINDEX,
    },
  });

  // TEMP debug — remove once finished
  if (process.env.ADMIN_DEBUG_IP === "1") {
    const debug = [
      `client=${clientIp}`,
      `cf=${req.headers.get("cf-connecting-ip") ?? ""}`,
      `real=${req.headers.get("x-real-ip") ?? ""}`,
      `xff=${req.headers.get("x-forwarded-for") ?? ""}`,
    ].join(" | ");
    res.headers.set("X-Debug-IP", debug);
  }

  return res;
}

/* ----------------------------------------
   Middleware
----------------------------------------- */

export function middleware(req: NextRequest) {
  const clientIp = getClientIp(req);
  const allowlist = getAllowlist();

  // 1) IP allowlist
  if (!ipAllowed(clientIp, allowlist)) {
    return forbidden(req, clientIp);
  }

  // 2) Basic Auth
  const user = process.env.ADMIN_BASIC_USER;
  const pass = process.env.ADMIN_BASIC_PASS;

  // Safety: never hard-lock prod if env vars missing
  if (!user || !pass) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", NOINDEX);
    return res;
  }

  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) {
    return unauthorized();
  }

  let decoded = "";
  try {
    decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
  } catch {
    return unauthorized();
  }

  const sep = decoded.indexOf(":");
  const u = decoded.slice(0, sep);
  const p = decoded.slice(sep + 1);

  if (u !== user || p !== pass) {
    return unauthorized();
  }

  // 3) Success
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

/* ----------------------------------------
   Routes protected
----------------------------------------- */

export const config = {
  matcher: ["/admin-stats/:path*", "/api/admin/leads/:path*"],
};

