"use client";

import { useState } from "react";

export default function Home() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://problabs-backend.onrender.com";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    null | { type: "success" | "error"; message: string }
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          type: "error",
          message: data?.detail || "Signup failed. Please try again.",
        });
        return;
      }

      if (data?.created) {
        setStatus({ type: "success", message: "Thanks! You’re on the list ✅" });
      } else {
        setStatus({ type: "success", message: "You’re already on the list ✅" });
      }

      setEmail("");
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err?.message || "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-gray-200 p-8">
          <h1 className="text-4xl font-semibold tracking-tight">ProbLabs</h1>
          <p className="mt-2 text-lg text-gray-600">
            AI-Powered Lottery Intelligence.
          </p>

          <div className="mt-6 space-y-3 text-base text-gray-700">
            <p>
              We’re building a data-driven analytics platform for Florida Lottery
              games: <span className="font-medium">Fantasy 5</span>,{" "}
              <span className="font-medium">Pick 3</span>,{" "}
              <span className="font-medium">Pick 4</span>, and{" "}
              <span className="font-medium">Cash Pop</span>.
            </p>
            <p className="text-gray-500">Launching soon.</p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Get early access</h2>
            <p className="mt-1 text-sm text-gray-600">
              Enter your email to join the waitlist. We’ll notify you when we open
              the first paid subscriber tier.
            </p>

            <form onSubmit={onSubmit} className="mt-4 flex gap-3">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-400"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50 disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Join"}
              </button>
            </form>

            {status && (
              <p
                className={`mt-3 text-sm ${
                  status.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {status.message}
              </p>
            )}

            <p className="mt-3 text-xs text-gray-500">
              API base: <span className="font-mono">{API_BASE}</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
