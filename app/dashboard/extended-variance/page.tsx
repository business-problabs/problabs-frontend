import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

const BACKEND_URL = process.env.BACKEND_URL || "https://problabs-backend.onrender.com";

const GAMES = [
  { id: "pick-3",    label: "Pick 3",    positional: true  },
  { id: "pick-4",    label: "Pick 4",    positional: true  },
  { id: "pick-5",    label: "Pick 5",    positional: true  },
  { id: "fantasy-5", label: "Fantasy 5", positional: false },
  { id: "cash-pop",  label: "Cash Pop",  positional: false },
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

async function getPositionVariance(game: string, period: string) {
  try {
    const resp = await fetch(
      `${BACKEND_URL}/api/v1/results/${game}/position-variance?period=${period}`,
      { cache: "no-store" }
    );
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}

async function getOverallVariance(game: string, period: string) {
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

type RankedDigit = { digit: string; count: number; rate: string; pct: number };
type PositionData = {
  position: number;
  label: string;
  total_draws: number;
  hot_digit: string;
  hot_rate: string;
  cold_digit: string;
  cold_rate: string;
  ranked: RankedDigit[];
};

export default async function ExtendedVariancePage({
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
  const gameObj = GAMES.find(g => g.id === params.game) ?? GAMES[0];
  const game    = gameObj.id;
  const period  = PERIODS.find(p => p.id === params.period)?.id ?? "3m";

  const isPositional = gameObj.positional;
  const data = isPositional
    ? await getPositionVariance(game, period)
    : await getOverallVariance(game, period);

  const positions: PositionData[] = isPositional ? (data?.positions ?? []) : [];
  const overallRanked: RankedDigit[] = !isPositional ? (data?.ranked ?? []) : [];
  const gameLabel   = gameObj.label;
  const periodLabel = PERIODS.find(p => p.id === period)?.label ?? period;

  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      {/* Nav */}
      <nav className="mb-8 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-xl font-bold text-blue-400 hover:text-blue-200 transition-colors flex items-center gap-2 py-2"
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

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-0.5">
            Pro
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Extended Variance Analysis
        </h1>
        <p className="mt-2 text-white/50 text-sm">
          Pick 3/4/5: digit frequency broken down by draw position. Fantasy 5 &amp; Cash Pop: overall number frequency ranked across all draws.
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
                href={`/dashboard/extended-variance?game=${g.id}&period=${period}`}
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
                href={`/dashboard/extended-variance?game=${game}&period=${p.id}`}
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

      {/* Summary strip */}
      {data && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 flex items-center gap-6">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Draws analyzed</p>
            <p className="text-2xl font-bold text-white mt-0.5">{data.total_draws.toLocaleString()}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <p className="text-sm text-white/50">
            {gameLabel} · {periodLabel} ·{" "}
            {isPositional
              ? `${positions.length} positions`
              : `${data.total_digits?.toLocaleString() ?? "–"} numbers drawn`}
          </p>
        </div>
      )}

      {/* Results */}
      {data ? (
        <div className="space-y-6">
          {/* ── Positional view (Pick 3 / 4 / 5) ── */}
          {isPositional && positions.map((pos) => {
            const maxCount = pos.ranked.length > 0 ? pos.ranked[0].count : 1;
            return (
              <div key={pos.position} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-bold text-white">
                      {pos.position}
                    </span>
                    <h2 className="text-sm font-semibold text-white">{pos.label}</h2>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-blue-400 font-semibold">
                      Hot: <span className="font-mono">{pos.hot_digit}</span> ({pos.hot_rate})
                    </span>
                    <span className="text-purple-400 font-semibold">
                      Cold: <span className="font-mono">{pos.cold_digit}</span> ({pos.cold_rate})
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-white/5">
                  {pos.ranked.map((item, i) => {
                    const barWidth = Math.round((item.count / maxCount) * 100);
                    const isHot  = item.digit === pos.hot_digit;
                    const isCold = item.digit === pos.cold_digit;
                    return (
                      <div key={item.digit} className="px-6 py-2.5 flex items-center gap-4">
                        <span className="w-5 text-center text-xs font-mono text-white/25">{i + 1}</span>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                          isHot  ? "bg-blue-600/20 border-blue-500/40 text-blue-400"
                               : isCold ? "bg-purple-600/20 border-purple-500/40 text-purple-400"
                               : "bg-white/5 border-white/10 text-white/70"}`}>
                          {item.digit}
                        </div>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${isHot ? "bg-blue-500" : isCold ? "bg-purple-500" : "bg-white/20"}`}
                            style={{ width: `${barWidth}%` }} />
                        </div>
                        <span className="w-12 text-right text-xs font-mono text-white/40">{item.count.toLocaleString()}</span>
                        <span className={`w-12 text-right text-sm font-semibold ${isHot ? "text-blue-400" : isCold ? "text-purple-400" : "text-white/60"}`}>
                          {item.rate}
                        </span>
                        <span className="w-12 text-right">
                          {isHot  && <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">Hot</span>}
                          {isCold && <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full px-2 py-0.5">Cold</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ── Overall frequency view (Fantasy 5 / Cash Pop) ── */}
          {!isPositional && overallRanked.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Overall Number Frequency</h2>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-blue-400 font-semibold">
                    Hot: <span className="font-mono">{data.hot_digit}</span> ({data.hot_rate})
                  </span>
                  <span className="text-purple-400 font-semibold">
                    Cold: <span className="font-mono">{data.cold_digit}</span> ({data.cold_rate})
                  </span>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {overallRanked.map((item, i) => {
                  const maxCount = overallRanked[0]?.count ?? 1;
                  const barWidth = Math.round((item.count / maxCount) * 100);
                  const isHot  = item.digit === data.hot_digit;
                  const isCold = item.digit === data.cold_digit;
                  return (
                    <div key={item.digit} className="px-6 py-2.5 flex items-center gap-4">
                      <span className="w-5 text-center text-xs font-mono text-white/25">{i + 1}</span>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                        isHot  ? "bg-blue-600/20 border-blue-500/40 text-blue-400"
                             : isCold ? "bg-purple-600/20 border-purple-500/40 text-purple-400"
                             : "bg-white/5 border-white/10 text-white/70"}`}>
                        {item.digit}
                      </div>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${isHot ? "bg-blue-500" : isCold ? "bg-purple-500" : "bg-white/20"}`}
                          style={{ width: `${barWidth}%` }} />
                      </div>
                      <span className="w-12 text-right text-xs font-mono text-white/40">{item.count.toLocaleString()}</span>
                      <span className={`w-12 text-right text-sm font-semibold ${isHot ? "text-blue-400" : isCold ? "text-purple-400" : "text-white/60"}`}>
                        {item.rate}
                      </span>
                      <span className="w-12 text-right">
                        {isHot  && <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">Hot</span>}
                        {isCold && <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full px-2 py-0.5">Cold</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {period === "all" && (
            <p className="mt-2 text-xs text-white/30 text-center">
              * All-time covers available data from January 2024 to present.
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-white/40 text-sm">No data available for {gameLabel} · {periodLabel}.</p>
          <p className="text-white/20 text-xs mt-2">Try a different game or period.</p>
        </div>
      )}

      <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-white/30 text-center">
        Position frequency describes historical distribution only. It does not predict future draws.
      </footer>
    </main>
  );
}
