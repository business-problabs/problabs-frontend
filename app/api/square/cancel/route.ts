import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "https://problabs-backend.onrender.com";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("problabs_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const resp = await fetch(`${BACKEND_URL}/square/cancel-subscription`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json(
        { error: data.detail || "Cancellation failed" },
        { status: resp.status }
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
