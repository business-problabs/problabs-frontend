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

// ── Types ────────────────────────────────────────────────────────────────────

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

export type AdminUser = {
  id: number;
  email: string;
  is_pro: boolean;
  effective_pro: boolean;
  pro_gifted: boolean;
  pro_gifted_at: string | null;
  pro_gifted_note: string | null;
  subscription_ends_at: string | null;
  square_subscription_id: string | null;
  created_at: string | null;
  last_login_at: string | null;
};

export type AdminUsersResult = {
  ok: boolean;
  total: number;
  limit: number;
  offset: number;
  items: AdminUser[];
};

export type GrantProResult = {
  ok: boolean;
  user_created: boolean;
  user_id: number;
  email: string;
  is_pro: boolean;
  pro_gifted: boolean;
  permanent: boolean;
  subscription_ends_at: string | null;
  note: string | null;
};

export type RevokeProResult = {
  ok: boolean;
  email: string;
  gift_was_active: boolean;
  is_pro: boolean;
  has_square_subscription: boolean;
};

// ── API calls ────────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  return adminFetch<AdminStats>("/stats");
}

export async function listUsers(
  limit = 100,
  offset = 0
): Promise<AdminUsersResult> {
  return adminFetch<AdminUsersResult>(
    `/users?limit=${limit}&offset=${offset}`
  );
}

export async function grantPro(
  email: string,
  days?: number | null,
  note?: string | null
): Promise<GrantProResult> {
  return adminFetch<GrantProResult>("/users/grant-pro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, days: days ?? null, note: note ?? null }),
  });
}

export async function revokePro(email: string): Promise<RevokeProResult> {
  return adminFetch<RevokeProResult>("/users/revoke-pro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}
