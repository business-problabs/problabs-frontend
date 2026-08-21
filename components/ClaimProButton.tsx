"use client";
import { useState } from "react";

export default function ClaimProButton({
  initialEmail = "",
  ctaLabel = "Get Pro — Free",
}: {
  initialEmail?: string;
  ctaLabel?: string;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/pro/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-4">
        <p className="text-green-400 text-sm font-semibold">You&apos;re on Pro!</p>
        <p className="text-white/60 text-sm mt-1">
          Check your email for a magic sign-in link to access your Pro account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {!initialEmail && (
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
        />
      )}
      <button
        type="submit"
        disabled={loading || !email.trim()}
        style={{ background: "#fff", color: "#000" }}
        className="w-full rounded-xl px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Activating..." : ctaLabel}
      </button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </form>
  );
}
