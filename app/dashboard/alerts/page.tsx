import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import AlertToggles from "./AlertToggles";

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

async function getSubscribedGames(token: string): Promise<string[]> {
  try {
    const resp = await fetch(`${BACKEND_URL}/api/v1/alerts/subscriptions`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    return data.subscribed_games ?? [];
  } catch {
    return [];
  }
}

export default async function AlertsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("problabs_session")?.value;
  if (!token) redirect("/login");

  const user = await getUser(token);
  if (!user) redirect("/login");
  if (!user.is_pro) redirect("/dashboard");

  const subscribedGames = await getSubscribedGames(token);

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <nav className="mb-8 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-xl font-bold text-blue-400 hover:text-blue-200 transition-colors flex w-fit items-center gap-2 py-2"
        >
          <span className="text-3xl leading-none">←</span> Dashboard
        </Link>
        <form method="POST" action="/api/auth/logout">
          <button
            type="submit"
            className="text-sm font-semibold text-white/50 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
          >
            Sign out
          </button>
        </form>
      </nav>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
          Draw Alerts
        </h1>
        <p className="text-white/50 text-sm">
          Get an email the moment a new draw is posted. Toggle alerts per game below.
        </p>
        <p className="text-white/40 text-xs mt-1">{user.email}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-base font-semibold text-white mb-4">Florida Lottery games</h2>
        <AlertToggles initialSubscribed={subscribedGames} />
      </div>
    </main>
  );
}
