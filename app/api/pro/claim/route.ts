import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "https://problabs-backend.onrender.com";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({} as { email?: string }));
  const email = (body?.email || "").toString().trim();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const resp = await fetch(`${BACKEND_URL}/pro/claim-free`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    return NextResponse.json({ error: data.detail || "Failed to activate Pro" }, { status: resp.status });
  }
  return NextResponse.json(data);
}
