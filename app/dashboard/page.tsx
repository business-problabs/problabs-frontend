import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

const BACKEND_URL = process.env.BACKEND_URL || "https://problabs-backend.onrender.com";

async function getUser(token: string) {
  try {
    const resp = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("problabs_session")?.value;
  if (!token) redirect("/login");

  const user = await getUser(token);
  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <nav className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-base font-semibold text-white/70 hover:text-white transition-colors flex w-fit items-center gap-2 py-2">
          <span className="text-xl leading-none">←</span> Back to Home
        </Link>
        <form method="POST" action="/api/auth/logout">
          <button type="submit" className="text-sm font-semibold text-white/50 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5">
            Sign out
          </button>
        </form>
      </nav>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back</h1>
        <p className="text-white/60 text-sm">{user.email}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
          <span className={`w-2 h-2 rounded-full ${user.is_pro ? "bg-blue-400" : "bg-white/30"}`}></span>
          <span className="text-xs font-medium text-white/60">{user.is_pro ? "Pro" : "Free plan"}</span>
        </div>
      </div>
      {!user.is_pro && (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-600/10 p-8">
          <h2 className="text-xl font-semibold text-white mb-2">Upgrade to Pro</h2>
          <p className="text-white/60 text-sm mb-6">Unlock historical backtesting, extended variance analysis, and automated draw alerts.</p>
          <Link href="/pro" className="inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors">
            View Pro features — $9.99/mo
          </Link>
        </div>
      )}
      {user.is_pro && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Pro features</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/backtesting"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 hover:bg-white/10 transition-colors group"
            >
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-white">Historical Backtesting</p>
                <p className="text-xs text-white/40 mt-0.5">Digit frequency across 3m, 6m, 1y, all-time</p>
              </div>
              <span className="text-white/30 group-hover:text-white/60 transition-colors">→</span>
            </Link>
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 opacity-50 cursor-not-allowed">
              <div>
                <p className="text-sm font-semibold text-white/50">Extended Variance Analysis</p>
                <p className="text-xs text-white/30 mt-0.5">Coming soon</p>
              </div>
              <span className="text-white/20">→</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 opacity-50 cursor-not-allowed">
              <div>
                <p className="text-sm font-semibold text-white/50">Automated Draw Alerts</p>
                <p className="text-xs text-white/30 mt-0.5">Coming soon</p>
              </div>
              <span className="text-white/20">→</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
