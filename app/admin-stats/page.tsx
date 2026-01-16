// app/admin-stats/page.tsx
import "server-only";
import { getAdminStats, type AdminStats } from "@/lib/adminApi";

function fmt(n: number | undefined | null) {
  if (n === undefined || n === null) return "-";
  return new Intl.NumberFormat().format(n);
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}

export default async function AdminStatsPage() {
  let stats: AdminStats | null = null;
  let error: string | null = null;

  try {
    stats = await getAdminStats();
  } catch (e: any) {
    error = e?.message ?? "Failed to load admin stats.";
  }

  const daily = stats?.daily ?? [];
  const maxDaily = daily.length ? Math.max(...daily.map((d) => d.count)) : 0;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">ProbLabs Admin Stats</h1>
          <p className="mt-1 text-sm text-gray-500">
            Server-rendered. Admin key never reaches the browser.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
          <a
            href="/api/admin/leads?format=csv"
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Download leads CSV
          </a>
          <a
            href="/api/admin/leads"
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
          >
            View JSON
          </a>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="font-medium">Couldn’t load stats</div>
          <div className="mt-1 opacity-90">{error}</div>
          <div className="mt-2 text-xs text-red-600">
            Check env vars on Vercel (and redeploy after changes):{" "}
            <span className="font-mono">
              BACKEND_BASE_URL, ADMIN_API_KEY, ADMIN_PATH
            </span>
          </div>
        </div>
      ) : null}

      {stats ? (
        <>
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Rollups</h2>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Card title="Today" value={fmt(stats.today_count)} />
              <Card title="Yesterday" value={fmt(stats.yesterday_count)} />
              <Card title="Last 7 days" value={fmt(stats.last_7d_total)} />
              <Card title="Last 30 days" value={fmt(stats.total_30d)} />
              <Card title="All time" value={fmt(stats.total_all)} />
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Range: {stats.start_date ?? "-"} → {stats.end_date ?? "-"} (
              {stats.range_days ?? "-"} days)
              <br />
              Avg 7d/day: {stats.avg_7d_per_day?.toFixed?.(2) ?? "-"} · Avg
              30d/day: {stats.avg_30d_per_day?.toFixed?.(2) ?? "-"}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold">Daily (last 30 days)</h2>

            {daily.length ? (
              <div className="mt-3 overflow-hidden rounded-2xl border">
                {daily.map((d) => {
                  const pct = maxDaily > 0 ? (d.count / maxDaily) * 100 : 0;
                  return (
                    <div
                      key={d.date}
                      className="grid grid-cols-[120px_1fr_60px] items-center gap-3 border-t px-4 py-3 first:border-t-0"
                    >
                      <div className="text-sm tabular-nums text-gray-800">
                        {d.date}
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-gray-900"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-right text-sm tabular-nums text-gray-800">
                        {d.count}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                No daily breakdown returned from the stats endpoint.
              </p>
            )}
          </section>

          <div className="mt-10 text-xs text-gray-400">
            Tip: use <span className="font-mono">View JSON</span> to quickly
            verify the API response if anything looks off.
          </div>
        </>
      ) : null}
    </main>
  );
}

