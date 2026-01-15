cd ~/Desktop/problabs-frontend

cat > middleware.ts <<'EOF'
import { NextRequest, NextResponse } from "next/server";

const NOINDEX = "noindex, nofollow";

// ✅ Allowed IPs (IPv4 + IPv6)
const ALLOWED_IPS = new Set<string>([
  "107.145.105.136",
  "2603:9001:5500:f301:61f6:7e9b:9619:62bd",
]);

function stripBrackets(ip: string): string {
  // [IPv6] or [IPv6]:port
  const m = ip.match(/^\[([0-9a-fA-F:]+)\](?::\d+)?$/);
  return m ? m[1] : ip;
}

function stripPort(ip: string): string {
  // IPv4:port
  if (ip.includes(".") && ip.includes(":")) return ip.split(":")[0];

  // IPv6 usually contains ":" so we only strip port if bracket form handled above.
  return ip;
}

function normalizeIp(raw: string): string {
  return stripPort(stripBrackets(raw.trim()))
    .toLowerCase()
    .replace(/^::ffff:/, "")        // IPv4-mapped IPv6
    .replace(/%[0-9a-z]+$/i, "")    // IPv6 zone index (rare, but safe)
    .replace(/^"|"$/g, "")          // stray quotes
    .trim();
}

function splitIpList(v: string): string[] {
  // Could be comma-separated list of IPs, sometimes with spaces
  return v
    .split(",")
    .map((s) => normalizeIp(s))
    .filter(Boolean);
}

function collectClientIps(req: NextRequest): string[] {
  const ips: string[] = [];

  // Cloudflare real client IP (if present)
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) ips.push(normalizeIp(cf));

  // Some stacks provide these
  const real = req.headers.get("x-real-ip");
  if (real) ips.push(normalizeIp(real));

  // Forwarded header (RFC 7239): for=...
  const forwarded = req.headers.get("forwarded");
  // Example: for=192.0.2.60;proto=https;by=203.0.113.43
  if (forwarded) {
    const m = forwarded.match(/for="?(\[[0-9a-fA-F:]+\]|[0-9a-fA-F:.]+)"?/i);
    if (m?.[1]) ips.push(normalizeIp(m[1]));
  }

  // Standard proxy chain
  const xff = req.headers.get("x-forwarded-for");
  if (xff) ips.push(...splitIpList(xff));

  // Remove empties & dedupe
  return Array.from(new Set(ips.filter(Boolean)));
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
  const clientIps = collectClientIps(req);
  const ipAllowed = clientIps.some((ip) => ALLOWED_IPS.has(ip));

  if (!ipAllowed) {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: { "X-Robots-Tag": NOINDEX },
    });
  }

  // 2) Basic Auth
  const ADMIN_USER = process.env.ADMIN_BASIC_USER || "";
  const ADMIN_PASS = process.env.ADMIN_BASIC_PASS || "";

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
EOF

wc -l middleware.ts

