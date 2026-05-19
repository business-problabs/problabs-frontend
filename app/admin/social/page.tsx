"use client";
import { useState, useEffect, useCallback } from "react";

// ─── Color tokens ────────────────────────────────────────────────────────────
const BG_DARK  = "#0f172a";
const BG_CARD  = "#1e293b";
const ACCENT   = "#6366f1";
const ACCENT_G = "#22c55e";
const TEXT_PRI = "#f8fafc";
const TEXT_MUT = "#94a3b8";
const BORDER   = "#334155";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Post {
  id: number;
  platform: string;
  content: string;
  scheduled_at: string;
  status: string;
  game_ref: string | null;
  subreddit: string | null;
  visual_type: string | null;
  visual_path: string | null;
  visual_url: string | null;
  week_batch: string | null;
  created_at: string;
  sent_at: string | null;
}

interface WeekSummary {
  week_batch: string;
  total: number;
  pending: number;
  paused: number;
  sent: number;
  failed: number;
  first_post: string | null;
  last_post: string | null;
}

// ─── API helper ──────────────────────────────────────────────────────────────
async function api<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`/api/admin/social/${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "#f59e0b",
    sent:    ACCENT_G,
    failed:  "#ef4444",
    paused:  TEXT_MUT,
  };
  const col = colors[status] ?? TEXT_MUT;
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      background: col + "22",
      color: col,
      border: `1px solid ${col}55`,
    }}>
      {status}
    </span>
  );
}

function PlatformPill({ platform }: { platform: string }) {
  const icon: Record<string, string> = { x: "𝕏", facebook: "f", reddit: "r" };
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 9px",
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 700,
      background: "#6366f122",
      color: ACCENT,
      border: `1px solid ${ACCENT}44`,
    }}>
      {icon[platform] ?? platform} {platform}
    </span>
  );
}

function Thumb({ postId }: { postId: number }) {
  const [open, setOpen] = useState(false);
  const src = `/api/admin/social/visual/${postId}`;
  return (
    <>
      <img
        src={src}
        alt="visual"
        onClick={() => setOpen(true)}
        style={{ width: 64, height: 36, objectFit: "cover", borderRadius: 4,
                 cursor: "pointer", border: `1px solid ${BORDER}` }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "#000c",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
          }}
        >
          <img src={src} alt="preview" style={{ maxWidth: "90vw", maxHeight: "90vh",
                                                 borderRadius: 8 }} />
        </div>
      )}
    </>
  );
}

// ─── Schedule Week Modal ──────────────────────────────────────────────────────
function ScheduleWeekModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [startDate, setStartDate] = useState("");
  const [dryRunResult, setDryRunResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runDry() {
    setLoading(true); setError("");
    try {
      const res = await api<any>("schedule-week", {
        method: "POST",
        body: JSON.stringify({ start_date: startDate || undefined, dry_run: true }),
      });
      setDryRunResult(res);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function confirm() {
    setLoading(true); setError("");
    try {
      await api("schedule-week", {
        method: "POST",
        body: JSON.stringify({ start_date: startDate || undefined, dry_run: false, force: true }),
      });
      onDone();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <Modal title="Schedule Next Week" onClose={onClose}>
      <label style={{ color: TEXT_MUT, fontSize: 13 }}>Start date (leave blank for next Monday)</label>
      <input
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        style={inputStyle}
      />
      {error && <p style={{ color: "#ef4444", fontSize: 13 }}>{error}</p>}
      {!dryRunResult ? (
        <Btn onClick={runDry} disabled={loading}>Preview (dry run)</Btn>
      ) : (
        <>
          <p style={{ color: ACCENT_G, fontSize: 13 }}>
            ✓ {dryRunResult.count} posts planned for {dryRunResult.week_batch}
          </p>
          <div style={{ maxHeight: 220, overflowY: "auto", fontSize: 12, color: TEXT_MUT }}>
            {dryRunResult.posts?.map((p: any, i: number) => (
              <div key={i} style={{ padding: "4px 0", borderBottom: `1px solid ${BORDER}` }}>
                {fmtDate(p.scheduled_at)} · {p.platform} · {p.game_ref} · {p.visual_type}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Btn onClick={confirm} disabled={loading} accent={ACCENT_G}>Confirm & Schedule</Btn>
            <Btn onClick={() => setDryRunResult(null)} disabled={loading}>Re-run dry run</Btn>
          </div>
        </>
      )}
    </Modal>
  );
}

// ─── Generate Post Modal ──────────────────────────────────────────────────────
function GenerateModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({
    platform: "x",
    game_ref: "pick-3",
    visual_type: "frequency_bar",
    scheduled_at: "",
    subreddit: "r/dataisbeautiful",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!form.scheduled_at) { setError("scheduled_at required"); return; }
    setLoading(true); setError("");
    try {
      await api("generate", { method: "POST", body: JSON.stringify(form) });
      onDone();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  const F = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal title="Generate Single Post" onClose={onClose}>
      <Select label="Platform" value={form.platform} onChange={v => F("platform", v)}
              opts={["x","facebook","reddit"]} />
      <Select label="Game" value={form.game_ref} onChange={v => F("game_ref", v)}
              opts={["pick-3","pick-4","pick-5","fantasy-5","cash-pop"]} />
      <Select label="Visual type" value={form.visual_type} onChange={v => F("visual_type", v)}
              opts={["frequency_bar","stat_card","heatmap","variance_trend"]} />
      {form.platform === "reddit" && (
        <LabeledInput label="Subreddit" value={form.subreddit}
                      onChange={v => F("subreddit", v)} placeholder="r/dataisbeautiful" />
      )}
      <label style={{ color: TEXT_MUT, fontSize: 13 }}>Scheduled at</label>
      <input type="datetime-local" value={form.scheduled_at}
             onChange={e => F("scheduled_at", e.target.value)} style={inputStyle} />
      {error && <p style={{ color: "#ef4444", fontSize: 13 }}>{error}</p>}
      <Btn onClick={submit} disabled={loading}>Create post</Btn>
    </Modal>
  );
}

// ─── Shared small components ─────────────────────────────────────────────────
function Modal({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000a",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500,
    }}>
      <div style={{
        background: BG_CARD, border: `1px solid ${BORDER}`,
        borderRadius: 12, padding: 24, width: 480, maxWidth: "95vw",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, color: TEXT_PRI }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none",
            color: TEXT_MUT, cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Btn({ onClick, disabled, children, accent = ACCENT }: {
  onClick: () => void; disabled?: boolean; children: React.ReactNode; accent?: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: accent, color: "#fff", border: "none", borderRadius: 6,
      padding: "8px 16px", cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1, fontWeight: 600, fontSize: 13,
    }}>
      {children}
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  background: BG_DARK, border: `1px solid ${BORDER}`, borderRadius: 6,
  padding: "8px 10px", color: TEXT_PRI, fontSize: 13, width: "100%", boxSizing: "border-box",
};

function Select({ label, value, onChange, opts }: {
  label: string; value: string; onChange: (v: string) => void; opts: string[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ color: TEXT_MUT, fontSize: 13 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function LabeledInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ color: TEXT_MUT, fontSize: 13 }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)}
             placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", timeZoneName: "short",
    });
  } catch { return iso; }
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SocialPage() {
  const [weeks, setWeeks]             = useState<WeekSummary[]>([]);
  const [activeWeek, setActiveWeek]   = useState<string | null>(null);
  const [posts, setPosts]             = useState<Post[]>([]);
  const [nextUp, setNextUp]           = useState<Post[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [platformFilter, setPlatform] = useState("all");
  const [showSchedule, setShowSchedule] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [w, n] = await Promise.all([
        api<WeekSummary[]>("weeks"),
        api<Post[]>("next-up"),
      ]);
      setWeeks(w);
      setNextUp(n);
      if (!activeWeek && w.length > 0) setActiveWeek(w[0].week_batch);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [activeWeek]);

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    if (!activeWeek) return;
    const params = new URLSearchParams({ week_batch: activeWeek, limit: "200" });
    if (platformFilter !== "all") params.set("platform", platformFilter);
    api<Post[]>(`posts?${params}`).then(setPosts).catch(() => {});
  }, [activeWeek, platformFilter]);

  const weekStats = weeks.find(w => w.week_batch === activeWeek);

  async function pauseAll() {
    const q = platformFilter !== "all" ? `?platform=${platformFilter}` : "";
    await api(`pause-all${q}`, { method: "POST" });
    refresh();
  }
  async function resumeAll() {
    const q = platformFilter !== "all" ? `?platform=${platformFilter}` : "";
    await api(`resume-all${q}`, { method: "POST" });
    refresh();
  }
  async function postAction(id: number, action: string) {
    await api(`posts/${id}/${action}`, { method: action === "delete" ? "DELETE" : "POST" });
    refresh();
  }

  return (
    <div style={{ minHeight: "100vh", background: BG_DARK, color: TEXT_PRI,
                  fontFamily: "'Inter', system-ui, sans-serif", padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Social Scheduler</h1>
          <p style={{ margin: "4px 0 0", color: TEXT_MUT, fontSize: 13 }}>
            ProbLabs · auto-refreshes every 60s
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => setShowSchedule(true)}>+ Schedule Week</Btn>
          <Btn onClick={() => setShowGenerate(true)}>+ Single Post</Btn>
        </div>
      </div>

      {error && (
        <div style={{ background: "#ef444422", border: "1px solid #ef4444",
                      borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                      color: "#ef4444", fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Next-up strip */}
      {nextUp.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: TEXT_MUT, fontSize: 12, margin: "0 0 8px", fontWeight: 600 }}>
            NEXT UP
          </p>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            {nextUp.map(p => (
              <div key={p.id} style={{
                background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 8,
                padding: 12, minWidth: 220, flexShrink: 0,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between",
                               alignItems: "center", marginBottom: 6 }}>
                  <PlatformPill platform={p.platform} />
                  <Thumb postId={p.id} />
                </div>
                <p style={{ margin: 0, fontSize: 12, color: TEXT_MUT }}>{fmtDate(p.scheduled_at)}</p>
                <p style={{ margin: "4px 0 0", fontSize: 11, color: TEXT_MUT }}>
                  {p.game_ref} · {p.visual_type}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Week tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
        {weeks.map(w => (
          <button
            key={w.week_batch}
            onClick={() => setActiveWeek(w.week_batch)}
            style={{
              background: activeWeek === w.week_batch ? ACCENT : BG_CARD,
              border: `1px solid ${activeWeek === w.week_batch ? ACCENT : BORDER}`,
              borderRadius: 6, padding: "6px 14px", cursor: "pointer",
              color: activeWeek === w.week_batch ? "#fff" : TEXT_MUT,
              fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
            }}
          >
            {w.week_batch}
            <span style={{ marginLeft: 6, opacity: 0.7, fontSize: 11 }}>
              {w.pending}p · {w.sent}✓
            </span>
          </button>
        ))}
      </div>

      {/* Stats bar */}
      {weekStats && (
        <div style={{
          background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 8,
          padding: "10px 16px", marginBottom: 16,
          display: "flex", gap: 24, flexWrap: "wrap", fontSize: 13,
        }}>
          {[
            ["Total", weekStats.total, TEXT_PRI],
            ["Pending", weekStats.pending, "#f59e0b"],
            ["Paused", weekStats.paused, TEXT_MUT],
            ["Sent", weekStats.sent, ACCENT_G],
            ["Failed", weekStats.failed, "#ef4444"],
          ].map(([label, val, col]) => (
            <span key={label as string}>
              <span style={{ color: TEXT_MUT }}>{label}: </span>
              <strong style={{ color: col as string }}>{val as number}</strong>
            </span>
          ))}
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <select
          value={platformFilter}
          onChange={e => setPlatform(e.target.value)}
          style={{ ...inputStyle, width: "auto", padding: "6px 10px" }}
        >
          {["all","x","facebook","reddit"].map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button onClick={pauseAll} style={{
          background: "none", border: `1px solid ${BORDER}`, borderRadius: 6,
          padding: "6px 14px", cursor: "pointer", color: "#f59e0b", fontSize: 13,
        }}>
          ⏸ Pause all
        </button>
        <button onClick={resumeAll} style={{
          background: "none", border: `1px solid ${BORDER}`, borderRadius: 6,
          padding: "6px 14px", cursor: "pointer", color: ACCENT_G, fontSize: 13,
        }}>
          ▶ Resume all
        </button>
      </div>

      {/* Posts table */}
      {loading ? (
        <p style={{ color: TEXT_MUT }}>Loading…</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ color: TEXT_MUT, fontSize: 11, textAlign: "left" }}>
                {["Thumb","Platform","Scheduled","Status","Chart","Game","Actions"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", borderBottom: `1px solid ${BORDER}`,
                                        fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${BORDER}22` }}>
                  <td style={{ padding: "8px 10px" }}><Thumb postId={p.id} /></td>
                  <td style={{ padding: "8px 10px" }}><PlatformPill platform={p.platform} /></td>
                  <td style={{ padding: "8px 10px", color: TEXT_MUT, whiteSpace: "nowrap" }}>
                    {fmtDate(p.scheduled_at)}
                  </td>
                  <td style={{ padding: "8px 10px" }}><StatusBadge status={p.status} /></td>
                  <td style={{ padding: "8px 10px", color: TEXT_MUT }}>{p.visual_type}</td>
                  <td style={{ padding: "8px 10px", color: TEXT_MUT }}>
                    {p.game_ref}
                    {p.subreddit && <span style={{ fontSize: 11 }}> · {p.subreddit}</span>}
                    {p.visual_url && (
                      <a href={p.visual_url} target="_blank" rel="noreferrer"
                         style={{ marginLeft: 6, color: ACCENT, fontSize: 11 }}>↗</a>
                    )}
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {p.status === "pending" && (
                        <ActionBtn onClick={() => postAction(p.id, "pause")} label="⏸" />
                      )}
                      {p.status === "paused" && (
                        <ActionBtn onClick={() => postAction(p.id, "resume")} label="▶" />
                      )}
                      {p.status === "failed" && (
                        <ActionBtn onClick={() => postAction(p.id, "retry")} label="↺" />
                      )}
                      {p.status !== "sent" && (
                        <ActionBtn onClick={() => postAction(p.id, "delete")} label="✕" danger />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "32px 10px", textAlign: "center",
                                            color: TEXT_MUT }}>
                    No posts for this week yet. Click <strong>+ Schedule Week</strong> to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showSchedule && (
        <ScheduleWeekModal
          onClose={() => setShowSchedule(false)}
          onDone={() => { setShowSchedule(false); refresh(); }}
        />
      )}
      {showGenerate && (
        <GenerateModal
          onClose={() => setShowGenerate(false)}
          onDone={() => { setShowGenerate(false); refresh(); }}
        />
      )}
    </div>
  );
}

function ActionBtn({ onClick, label, danger = false }: {
  onClick: () => void; label: string; danger?: boolean;
}) {
  return (
    <button onClick={onClick} title={label} style={{
      background: "none",
      border: `1px solid ${danger ? "#ef4444" : BORDER}`,
      borderRadius: 5, padding: "3px 8px", cursor: "pointer",
      color: danger ? "#ef4444" : TEXT_MUT, fontSize: 13,
    }}>
      {label}
    </button>
  );
}
