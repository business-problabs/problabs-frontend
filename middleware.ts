import { NextResponse, type NextRequest } from "next/server";

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="ProbLabs Admin"',
    },
  });
}

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_BASIC_USER;
  const pass = process.env.ADMIN_BASIC_PASS;

  // Safety: do not lock site if env vars missing
  if (!user || !pass) {
    return NextResponse.next();
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return unauthorized();
  }

  const decoded = Buffer.from(
    auth.slice("Basic ".length),
    "base64"
  ).toString("utf8");

  const [u, p] = decoded.split(":");

  if (u !== user || p !== pass) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-stats/:path*", "/api/admin/leads/:path*"],
};

