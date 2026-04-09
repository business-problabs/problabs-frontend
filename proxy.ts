import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "problabs_token";
const PROTECTED_PATHS = ["/dashboard"];

function getClientIp(req: NextRequest): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "0.0.0.0";
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="ProbLabs Admin"' },
  });
}

function forbidden() {
  return new NextResponse("Forbidden", { status: 403 });
}

function isValidBasicAuth(req: NextRequest): boolean {
  const user = process.env.ADMIN_BASIC_USER || "";
  const pass = process.env.ADMIN_BASIC_PASS || "";
  if (!user || !pass) return false;
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;
  try {
    const decoded = atob(auth.slice("Basic ".length));
    const [u, p] = decoded.split(":");
    return u === user && p === pass;
  } catch {
    return false;
  }
}

function ipAllowed(req: NextRequest): boolean {
  if (process.env.ADMIN_DEBUG_IP === "1") return true;
  const allowed = (process.env.ADMIN_ALLOWED_IPS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (allowed.length === 0) return false;
  const ip = getClientIp(req);
  return allowed.includes(ip);
}

function protectAdmin(req: NextRequest) {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();
  if (!ipAllowed(req)) return forbidden();
  if (!isValidBasicAuth(req)) return unauthorized();
  return NextResponse.next();
}

function protectAuth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  const headers = new Headers(req.headers);
  headers.set("x-auth-token", token);
  return NextResponse.next({ request: { headers } });
}

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Auth-protected routes
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    return protectAuth(req);
  }

  // Admin-protected routes
  if (pathname === "/admin-stats") return protectAdmin(req);
  if (pathname.startsWith("/api/admin/")) return protectAdmin(req);

  const ADMIN_PATH = (process.env.ADMIN_PATH || "").trim();
  if (ADMIN_PATH && pathname.startsWith(ADMIN_PATH)) return protectAdmin(req);

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/pro/:path*", "/admin-stats", "/api/admin/:path*", "/:path*"],
};
