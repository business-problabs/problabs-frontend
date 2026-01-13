import { NextResponse, type NextRequest } from "next/server";

const ALLOWED_IPS = [
  "107.145.105.136", // your current public IP
  // "x.x.x.x",      // optional: add another IP later (home, hotspot, office)
];

function unauthorized(message = "Unauthorized") {
  return new NextResponse(message, {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="ProbLabs Admin"' },
  });
}

function forbidden() {
  return new NextResponse("Forbidden", { status: 403 });
}

export function middleware(req: NextRequest) {
  // Vercel sets x-forwarded-for. Take the first IP.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.ip ??
    "";

  // IP allowlist first
  if (ALLOWED_IPS.length && !ALLOWED_IPS.includes(ip)) {
    return forbidden();
  }

  // Basic Auth second
  const user = process.env.ADMIN_BASIC_USER;
  const pass = process.env.ADMIN_BASIC_PASS;

  // Safety: if creds missing, don't lock yourself out
  if (!user || !pass) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  const decoded = Buffer.from(auth.slice("Basic ".length), "base64").toString("utf8");
  const [u, p] = decoded.split(":");

  if (u !== user || p !== pass) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-stats/:path*", "/api/admin/leads/:path*"],
};

