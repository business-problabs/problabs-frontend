import { NextRequest, NextResponse } from "next/server";
const BACKEND_URL = process.env.BACKEND_URL || "https://problabs-backend.onrender.com";
export async function POST(request: NextRequest) {
  let email = "";
  const ct = request.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const b = await request.json().catch(() => ({}));
    email = b.email || "";
  } else {
    const fd = await request.formData().catch(() => new FormData());
    email = fd.get("email")?.toString() || "";
  }
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  const resp = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!resp.ok) return NextResponse.json({ error: "Failed to send magic link" }, { status: 502 });
  return NextResponse.redirect(new URL("/login?sent=true", request.url));
}
