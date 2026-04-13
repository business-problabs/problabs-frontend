import { NextRequest, NextResponse } from "next/server";
const BACKEND_URL = process.env.BACKEND_URL || "https://problabs-backend.onrender.com";
const COOKIE_NAME = "problabs_session";
export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  const resp = await fetch(`${BACKEND_URL}/square/checkout`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
  if (!resp.ok) return NextResponse.json({ error: "Failed to create checkout" }, { status: 502 });
  const data = await resp.json();
  return NextResponse.json({ checkout_url: data.checkout_url });
}
