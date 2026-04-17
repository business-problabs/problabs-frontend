import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

const BACKEND_URL = process.env.BACKEND_URL || "https://problabs-backend.onrender.com";

const GAMES = [
  { id: "pick-3",    label: "Pick 3" },
  { id: "pick-4",    label: "Pick 4" },
  { id: "pick-5",    label: "Pick 5" },
  { id: "fantasy-5", label: "Fantasy 5" },
  { id: "cash-pop",  label: "Cash Pop" },
];

const PERIODS = [
  { id: "3m",  label: "3 Months" },
  { id: "6m",  label: "6 Months" },
  { id: "1y",  label: "1 Year" },
  { id: "all", label: "All-Time" },
];

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

async function getVariance(game: string, period: string) {
  try {
    const resp = await fetch(
      `${BACKEND_URL}/api/v1/results/${game}/variance?period=${period}`,
      { cache: "no-store" }
    );
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}

type SearchParams = Promise<{ game?: string; period?: string }>;

export default async function BacktestingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("problabs_session")?.value;
  if (!token) redirect("/login");

  const user = await getUser(token);
  if (!user) redirect("/login");
  if (!user.is_pro) redirect("/pro");

  const params = await searchParams;
  const game   = GAMES.find(g => g.id === params.game)?.id  ?? "pick-3";
  const period = PERIODS.find(p => p.id === params.period)?.id ?? "3m";

  const data = await getVariance(game, period);

  const ranked: { digit: string; count: number; rate: string }[] =
    data?.ranked ?? [];
  const maxCount = ranked.length > 0 ? ranked[0].count : 1;

  const gameLabel   = GAMES.find(g => g.id === game)?.label   ?? game;
  const periodLabel = PERIODS.find(p => p.id === period)?.label ?? period;

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      {/* Nav */}
      <nav className="mb-8 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-base font-semibold text-white/70 hover:text-white transition-colors flex items-center gap-2 py-2"
        >
          <span className="text-xl leading-none">←</span> Dashboard
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

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-0.5">
            Pro
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Historical Backtesting
        </h1>
        <p className="mt-2 text-white/50 text-sm">
          Digit frequency analysis across extended time windows. Describes what happened — not what will happen.
        </p>
      </div>

      {/* Game Selector */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Game</p>
        <div className="flex flex-wrap gap-2">
          {GAMES.map(g => {
            const active = g.id === game;
            return (
              <Link
                key={g.id}
                href={`/dashboard/backtesting?game=${g.id}&period=${period}`}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {g.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Period Selector */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Period</p>
        <div className="flex flex-wrap gap-2">
          {PERIODS.map(p => {
            const active = p.id === period;
            return (
              <Link
                key={p.id}
                href={`/dashboard/backtesting?game=${game}&period=${p.id}`}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {p.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Summary Card */}
      {data ? (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Draws analyzed</p>
              <p className="text-2xl font-bold text-white">{data.total_draws.toLocaleString()}</p>
              <p className="text-xs text-white/30 mt-1">{gameLabel} · {periodLabel}</p>
            </div>
            <div className="rounded-2xl border border-orange-500/20 bg-orange-600/10 p-5">
              <p className="text-xs text-orange-400/70 uppercase tracking-wider mb-1">Hottest</p>
              <p className="text-2xl font-bold text-orange-400">{data.hot_digit}</p>
              <p className="text-xs text-orange-400/50 mt-1">{data.hot_rate} of draws</p>
            </div>
            <div className="rounded-2xl border border-blue-500/20 bg-blue-600/10 p-5">
              <p className="text-xs text-blue-400/70 uppercase tracking-wider mb-1">Coldest</p>
              <p className="text-2xl font-bold text-blue-400">{data.cold_digit}</p>
              <p className="text-xs text-blue-400/50 mt-1">{data.cold_rate} of draws</p>
            </div>
          </div>

          {/* Ranked Frequency Table */}
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Digit Frequency Ranking — {gameLabel} · {periodLabel}
              </h2>
              <span className="text-xs text-white/30">{ranked.length} digits</span>
            </div>
            <div className="divide-y divide-white/5">
              {ranked.map((item, i) => {
                const barWidth = Math.round((item.count / maxCount) * 100);
                const isHot  = item.digit === data.hot_digit;
                const isCold = item.digit === data.cold_digit;
                return (
                  <div key={item.digit} className="px-6 py-3 flex items-center gap-4">
                    {/* Rank */}
                    <span className="w-6 text-center text-xs font-mono text-white/30">
                      {i + 1}
                    </span>
                    {/* Digit bubble */}
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border ${
                        isHot
                          ? "bg-orange-600/20 border-orange-500/40 text-orange-400"
                          : isCold
                          ? "bg-blue-600/20 border-blue-500/40 text-blue-400"
                          : "bg-white/5 border-white/10 text-white/70"
                      }`}
                    >
                      {item.digit}
                    </div>
                    {/* Bar */}
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isHot ? "bg-orange-500" : isCold ? "bg-blue-500" : "bg-white/20"
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    {/* Count */}
                    <span className="w-14 text-right text-xs font-mono text-white/40">
                      {item.count.toLocaleString()}
                    </span>
                    {/* Rate */}
                    <span
                      className={`w-14 text-right text-sm font-semibold ${
                        isHot ? "text-orange-400" : isCold ? "text-blue-400" : "text-white/60"
                      }`}
                    >
                      {item.rate}
                    </span>
                    {/* Badge */}
                    <span className="w-12 text-right">
                      {isHot && (
                        <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-2 py-0.5">
                          Hot
                        </span>
                      )}
                      {isCold && (
                        <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">
                          Cold
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {period === "all" && (
            <p className="mt-4 text-xs text-white/30 text-center">
              * All-time covers available data from January 2024 to present.
            </p>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-white/40 text-sm">No data available for {gameLabel} · {periodLabel}.</p>
          <p className="text-white/20 text-xs mt-2">Try a different game or period.</p>
        </div>
      )}

      <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-white/30 text-center">
        Frequency data describes historical distribution only. It does not predict future draws.
      </footer>
    </main>
  );
}
