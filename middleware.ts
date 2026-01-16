import { NextRequest, NextResponse } from "next/server";

/**
 * Get client IP safely across Vercel + Cloudflare
 */
function getClientIp(req: NextRequest): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();

  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();

  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();

  return "0.0.0.0";
}

/**
 * Basic Auth check
 */
function isValidBasicAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) return false;

  try {
    const decoded = Buffer.from(auth.split(" ")[1], "base64")
      .toString("utf-8")
      .split(":");

    const user = decoded[0];
    const pass = decoded[1];

    return (
      user === process.env.ADMIN_BASIC_USER &&
      pass === process.env.ADMIN_BASIC_PASS
    );
  } catch {
    return false;
  }
}

/**
 * Main middleware
 */
export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Public routes — do nothing
  if (
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api") === false
  ) {
    return NextResponse.next();
  }

  // Admin path (hidden)
  const ADMIN_PATH = process.env.ADMIN_PATH || "";
  if (!ADMIN_PATH || !pathname.startsWith(ADMIN_PATH)) {
    return NextResponse.next();
  }

  // Debug override
  if (process.env.ADMIN_DEBUG_IP === "1") {
    return NextResponse.next();
  }

  const clientIp = getClientIp(req);

  // IP allowlist
  const allowed =
    process.env.ADMIN_ALLOWED_IPS?.split(",").map((ip) => ip.trim()) || [];

  if (!allowed.includes(clientIp)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Basic Auth
  if (!isValidBasicAuth(req)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="ProbLabs Admin"',
      },
    });
  }

  return NextResponse.next();
}

/**
 * Apply middleware only to admin path
 */
export const config = {
  matcher: ["/:path*"],
};

