import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "problabs_session";
const PROTECTED_PATHS = ["/dashboard"];

// Vercel's default project domains — these serve the exact same production
// content as www.problabs.net with no host-aware canonical, which Google
// flagged as "Duplicate without user-selected canonical". Redirect them to
// the one canonical host instead of leaving them live as indexable mirrors.
const CANONICAL_HOST = "www.problabs.net";
const REDIRECT_HOSTS = new Set([
  "problabs-frontend.vercel.app",
  "problabs-frontend-problabs-projects.vercel.app",
  "problabs-frontend-git-main-problabs-projects.vercel.app",
]);

function redirectToCanonicalHost(req: NextRequest): NextResponse | null {
  const host = req.headers.get("host");
  if (host && REDIRECT_HOSTS.has(host)) {
    const url = req.nextUrl.clone();
    url.protocol = "https";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }
  return null;
}

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
  // IP check is optional — only enforced if ADMIN_ALLOWED_IPS is configured
  const hasIpList = (process.env.ADMIN_ALLOWED_IPS || "").trim().length > 0;
  if (hasIpList && !ipAllowed(req)) return forbidden();
  // Basic Auth is always required in production
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
  const hostRedirect = redirectToCanonicalHost(req);
  if (hostRedirect) return hostRedirect;

  const pathname = req.nextUrl.pathname;

  // Auth-protected routes
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    return protectAuth(req);
  }

  // Admin-protected routes (pages only — API routes are secured by backend ADMIN_API_KEY)
  if (pathname === "/admin-stats") return protectAdmin(req);
  if (pathname === "/admin-pro") return protectAdmin(req);
  if (pathname.startsWith("/admin/social")) return protectAdmin(req);

  const ADMIN_PATH = (process.env.ADMIN_PATH || "").trim();
  if (ADMIN_PATH && pathname.startsWith(ADMIN_PATH)) return protectAdmin(req);

  return NextResponse.next();
}

export const config = {
  // Runs on every path (excluding static assets/images) so the canonical-host
  // redirect applies site-wide; the auth/admin checks above still only act on
  // their specific paths.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
