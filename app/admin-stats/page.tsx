"use client";

import { useEffect, useMemo, useState } from "react";

type DailyPoint = { date: string; count: number };

type StatsResponse = {
  range_days: number;
  start_date: string;
  end_date: string;
  total_30d: number;
  total_all: number;
  today_count?: number;
  yesterday_count?: number;
  last_7d_total?: number;
  avg_7d_per_day?: number;
  avg_30d_per_day?: number;
  daily: DailyPoint[];
};

const LS_KEY = "problabs_admin_key";

function fmt(n: number | undefined) {
  if (n === undefined || n === null) return "-";
  return new Intl.NumberFormat().format(n);
}

export default function AdminStatsPage() {
  const backendBase =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://problabs-backend.onrender.com";

  // IMPORTANT: Your backend uses ADMIN_PATH, and yours is currently: a9f3d-admin
  // You can override via env var if you ever change it.
  const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || "a9f3d-admin";

  const statsUrl = useMemo(
    () => `${backendBase.replace(/\/$/, "")}/${adminPath}/stats`,
    [backendBase, adminPath]
  );

  const [adminKey, setAdminKey] = useState("");
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) setAdminKey(saved);
  }, []);

  const saveKey = () => {
    localStorage.setItem(LS_KEY, adminKey.trim());
  };

  const clearKey = () => {
    localStorage.removeItem(LS_KEY);
    setAdminKey("");
    setStats(null);
    setErr("");
  };

  const fetchStats = async () => {
    setErr("");
    setLoading(true);
    setStats(null);

    try {
      const key = adminKey.trim();
      if (!key) {
        setErr("Missing Admin API Key. Paste it above, click Save, then Reload Stats.");
        return;
      }

      const res = await fetch(statsUrl, {
        method: "GET",
        headers: {
          "X-Admin-Key": key,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
      }

      const data = (await res.json()) as StatsResponse;
      setStats(data);
    } catch (e: any) {
      setErr(e?.message || "Failed to load stats.");
    } finally {
      setLoading(false);
    }
  };

  const maxDaily = useMemo(() => {
    if (!stats?.daily?.length) return 0;
    return Math.max(...stats.daily.map((d) => d.count));
  }, [stats]);

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "32px 16px", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>ProbLabs Admin Stats</h1>
      <p style={{ marginTop: 0, color: "#666" }}>
        Reads from <code>{statsUrl}</code>
      </p>

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 16,
          marginTop: 16,
          background: "#fafafa",
        }}
      >
        <h2 style={{ fontSize: 16, margin: "0 0 10px 0" }}>Admin Key</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Paste ADMIN_API_KEY here"
            style={{
              flex: "1 1 380px",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 10,
              fontSize: 14,
            }}
          />
          <button
            onClick={saveKey}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #111",
              background: "#111",
              color: "white",
              cursor: "pointer",
            }}
          >
            Save
          </button>
          <button
            onClick={fetchStats}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #111",
              background: "white",
              color: "#111",
              cursor: "pointer",
            }}
          >
            Reload Stats
          </button>
          <button
            onClick={clearKey}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #ccc",
              background: "white",
              color: "#111",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>

        {err ? (
          <div style={{ marginTop: 12, color: "#b00020", whiteSpace: "pre-wrap" }}>{err}</div>
        ) : null}
        {loading ? <div style={{ marginTop: 12, color: "#333" }}>Loading…</div> : null}
      </section>

      {stats ? (
        <>
          <section style={{ marginTop: 22 }}>
            <h2 style={{ fontSize: 18, marginBottom: 10 }}>Rollups</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 12,
              }}
            >
              <Card title="Today" value={fmt(stats.today_count)} />
              <Card title="Yesterday" value={fmt(stats.yesterday_count)} />
              <Card title="Last 7 days" value={fmt(stats.last_7d_total)} />
              <Card title="Last 30 days" value={fmt(stats.total_30d)} />
              <Card title="All time" value={fmt(stats.total_all)} />
            </div>

            <div style={{ marginTop: 10, color: "#666", fontSize: 13 }}>
              Range: {stats.start_date} → {stats.end_date} ({stats.range_days} days)
              <br />
              Avg 7d/day: {stats.avg_7d_per_day?.toFixed?.(2) ?? "-"} · Avg 30d/day:{" "}
              {stats.avg_30d_per_day?.toFixed?.(2) ?? "-"}
            </div>
          </section>

          <section style={{ marginTop: 22 }}>
            <h2 style={{ fontSize: 18, marginBottom: 10 }}>Daily (last 30 days)</h2>

            <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
              {stats.daily.map((d) => {
                const pct = maxDaily > 0 ? (d.count / maxDaily) * 100 : 0;
                return (
                  <div
                    key={d.date}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px 1fr 60px",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
                    <div style={{ fontVariantNumeric: "tabular-nums", color: "#333" }}>{d.date}</div>
                    <div
                      style={{
                        height: 10,
                        borderRadius: 999,
                        background: "#eee",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: "#111",
                        }}
                      />
                    </div>
                    <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {d.count}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 14,
        background: "white",
      }}
    >
      <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

