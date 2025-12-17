
"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Request failed");
      }

      if (data.created) {
        setMessage("✅ You’re on the list!");
      } else {
        setMessage("ℹ️ You’re already signed up.");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage("❌ Something went wrong. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-4xl font-semibold tracking-tight">ProbLabs</h1>

        <p className="mt-2 text-lg text-gray-600">
          AI-Powered Lottery Intelligence.
        </p>

        <div className="mt-6 space-y-3 text-gray-700">
          <p>
            We’re building a data-driven analytics platform for Florida Lottery
            games:
            <span className="font-medium"> Fantasy 5</span>,{" "}
            <span className="font-medium">Pick 3</span>,{" "}
            <span className="font-medium">Pick 4</span>, and{" "}
            <span className="font-medium">Cash Pop</span>.
          </p>
          <p className="text-gray-500">Launching soon.</p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold">Get early access</h2>
          <p className="mt-1 text-gray-600">
            Join the waitlist and we’ll notify you when subscriptions open.
          </p>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {status === "loading" ? "Joining…" : "Join"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-3 text-sm ${
                status === "error" ? "text-red-600" : "text-gray-700"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
