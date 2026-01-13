// app/api/admin/leads/route.ts
import "server-only";

function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const BACKEND_BASE_URL = mustGetEnv("BACKEND_BASE_URL").replace(/\/+$/, "");
const ADMIN_API_KEY = mustGetEnv("ADMIN_API_KEY");
const ADMIN_PATH = mustGetEnv("ADMIN_PATH").replace(/^\/+|\/+$/g, "");

export async function GET() {
  const url = `${BACKEND_BASE_URL}/${ADMIN_PATH}/leads.csv`;

  const res = await fetch(url, {
    headers: { "X-Admin-Key": ADMIN_API_KEY },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return new Response(
      `CSV fetch failed: ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`,
      { status: 500 }
    );
  }

  const headers = new Headers(res.headers);
  headers.set("Content-Type", "text/csv; charset=utf-8");
  headers.set("Content-Disposition", 'attachment; filename="problabs_leads.csv"');
  headers.set("Cache-Control", "no-store");

  return new Response(res.body, {
    status: 200,
    headers,
  });
}

