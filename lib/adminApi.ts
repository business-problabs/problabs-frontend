import "server-only";

function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const BACKEND_BASE_URL = mustGetEnv("BACKEND_BASE_URL").replace(/\/+$/, "");
const ADMIN_API_KEY = mustGetEnv("ADMIN_API_KEY");
const ADMIN_PATH = mustGetEnv("ADMIN_PATH").replace(/^\/+|\/+$/g, "");

function adminUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_BASE_URL}/${ADMIN_PATH}${clean}`;
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(adminUrl(path), {
    ...init,
    headers: {
      "X-Admin-Key": ADMIN_API_KEY,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Admin fetch failed: ${res.status} ${res.statusText} (${path}) ${body}`
    );
  }

  return res.json() as Promise<T>;
}

export type AdminStats = {
  range_days?: number;
  start_date?: string;
  end_date?: string;
  total_30d?: number;
  total_all?: number;
  today_count?: number;
  yesterday_count?: number;
  last_7d_total?: number;
  avg_7d_per_day?: number;
  avg_30d_per_day?: number;
  daily?: Array<{ date: string; count: number }>;
};

export async function getAdminStats(): Promise<AdminStats> {
  return adminFetch<AdminStats>("/stats");
}

