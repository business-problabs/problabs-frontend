import { NextRequest, NextResponse } from "next/server";

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
    headers: {
      "WWW-Authenticate": 'Basic realm="ProbLabs Admin"',
    },
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
  // IMPORTANT: do not leave ADMIN_DEBUG_IP=1 in production
  if (process.env.ADMIN_DEBUG_IP === "1") return true;

  const allowed = (process.env.ADMIN_ALLOWED_IPS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // If you want "fail closed", keep this:
  if (allowed.length === 0) return false;

  const ip = getClientIp(req);
  return allowed.includes(ip);
}

function protect(req: NextRequest) {
  if (!ipAllowed(req)) return forbidden();
  if (!isValidBasicAuth(req)) return unauthorized();
  return NextResponse.next();
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Always protect these two surfaces:
  if (pathname === "/admin-stats") return protect(req);
  if (pathname.startsWith("/api/admin/")) return protect(req);

  // Optional: also protect any hidden admin path, if you use it
  const ADMIN_PATH = (process.env.ADMIN_PATH || "").trim(); // e.g. "/a9f3d-admin"
  if (ADMIN_PATH && pathname.startsWith(ADMIN_PATH)) return protect(req);

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-stats", "/api/admin/:path*", "/:path*"],
};

