import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "https://problabs-backend.onrender.com";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("problabs_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const resp = await fetch(`${BACKEND_URL}/square/subscription-status`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json(
        { error: data.detail || "Failed to fetch status" },
        { status: resp.status }
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
