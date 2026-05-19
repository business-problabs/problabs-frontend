/**
 * Catch-all server-side proxy for /api/admin/social/[...path]
 * Keeps ADMIN_API_KEY out of the browser — all requests go server→backend.
 */
import { NextRequest, NextResponse } from "next/server";

const BACKEND = (process.env.BACKEND_BASE_URL ?? "").replace(/\/$/, "");
const ADMIN_KEY = process.env.ADMIN_API_KEY ?? "";

type Context = { params: Promise<{ path: string[] }> };

async function proxy(req: NextRequest, context: Context, method: string) {
  const { path } = await Promise.resolve(context.params);
  const tail = path.join("/");
  const search = req.nextUrl.search ?? "";
  const upstreamUrl = `${BACKEND}/api/social/${tail}${search}`;

  const headers: Record<string, string> = {
    "X-Admin-Key": ADMIN_KEY,
  };

  let body: BodyInit | undefined;
  if (method !== "GET" && method !== "HEAD") {
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      body = await req.text();
      headers["Content-Type"] = "application/json";
    }
  }

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, { method, headers, body });
  } catch (err) {
    return NextResponse.json({ error: "upstream unreachable" }, { status: 502 });
  }

  // Binary image pass-through
  const contentType = upstream.headers.get("content-type") ?? "";
  if (contentType.startsWith("image/")) {
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: upstream.status,
      headers: { "Content-Type": contentType },
    });
  }

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": contentType || "application/json" },
  });
}

export async function GET(req: NextRequest, context: Context) {
  return proxy(req, context, "GET");
}
export async function POST(req: NextRequest, context: Context) {
  return proxy(req, context, "POST");
}
export async function DELETE(req: NextRequest, context: Context) {
  return proxy(req, context, "DELETE");
}
