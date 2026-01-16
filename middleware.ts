import { NextRequest, NextResponse } from "next/server";

const NOINDEX = "noindex, nofollow";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Probability Labs Admin"',
      "X-Robots-Tag": NOINDEX,
    },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin routes
  if (!pathname.startsWith("/api/admin") && !pathname.startsWith("/admin-stats")) {
    return NextResponse.next();
  }

  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) {
    return unauthorized();
  }

  const decoded = Buffer.from(auth.split(" ")[1], "base64").toString();
  const [user, pass] = decoded.split(":");

  if (
    user !== process.env.ADMIN_BASIC_USER ||
    pass !== process.env.ADMIN_BASIC_PASS
  ) {
    return unauthorized();
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

export const config = {
  matcher: ["/api/admin/:path*", "/admin-stats"],
};

