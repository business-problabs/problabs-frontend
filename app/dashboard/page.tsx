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
      <nav className="mb-8">
        <Link href="/" className="text-base font-semibold text-white/70 hover:text-white transition-colors flex w-fit items-center gap-2 py-2">
          <span className="text-xl leading-none">←</span> Back to Home
        </Link>
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
          <h2 className="text-xl font-semibold text-white mb-2">Pro features</h2>
          <p className="text-white/60 text-sm">Your Pro features are active. More tools coming soon.</p>
        </div>
      )}
    </main>
  );
}
