import { NextRequest, NextResponse } from "next/server";
import { grantPro } from "@/lib/adminApi";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, days, note } = body as {
      email: string;
      days?: number | null;
      note?: string | null;
    };

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const result = await grantPro(email, days ?? null, note ?? null);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
