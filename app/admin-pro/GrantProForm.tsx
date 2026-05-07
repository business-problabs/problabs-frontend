"use client";

import { useState } from "react";

type ResultBanner = {
  type: "success" | "error";
  message: string;
};

export default function GrantProForm({ onDone }: { onDone?: () => void }) {
  const [email, setEmail] = useState("");
  const [days, setDays] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultBanner | null>(null);

  async function handleGrant(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/grant-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          days: days ? parseInt(days, 10) : null,
          note: note.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setResult({ type: "error", message: data.error ?? "Request failed" });
      } else {
        const who = data.user_created ? "Created account and granted" : "Granted";
        const when = data.permanent
          ? "permanent"
          : `expires ${data.subscription_ends_at?.slice(0, 10)}`;
        setResult({
          type: "success",
          message: `✓ ${who} Pro to ${data.email} (${when})`,
        });
        setEmail("");
        setDays("");
        setNote("");
        onDone?.();
      }
    } catch (err: any) {
      setResult({ type: "error", message: err.message ?? "Network error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleRevoke(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    if (!confirm(`Revoke admin-gifted Pro from ${email.trim()}?`)) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/revoke-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setResult({ type: "error", message: data.error ?? "Request failed" });
      } else {
        setResult({
          type: "success",
          message: `✓ Revoked Pro gift from ${data.email}. is_pro is now ${data.is_pro}.`,
        });
        setEmail("");
        setNote("");
        setDays("");
        onDone?.();
      }
    } catch (err: any) {
      setResult({ type: "error", message: err.message ?? "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border p-6 shadow-sm bg-white">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Grant / Revoke Pro
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        No credit card needed. Enter the user's email and click an action.
      </p>

      {result && (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${
            result.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {result.message}
        </div>
      )}

      <form className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        {/* Days (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Days{" "}
            <span className="text-gray-400 font-normal">
              (leave blank for permanent)
            </span>
          </label>
          <input
            type="number"
            min={1}
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="e.g. 30"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        {/* Note (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. beta tester, friend, influencer"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleGrant}
            disabled={loading || !email.trim()}
            className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-40 transition-colors"
          >
            {loading ? "Working…" : "Grant Pro"}
          </button>
          <button
            onClick={handleRevoke}
            disabled={loading || !email.trim()}
            className="flex-1 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
          >
            Revoke Gift
          </button>
        </div>
      </form>
    </div>
  );
}
