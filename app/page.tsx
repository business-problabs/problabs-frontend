
"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: any;
  }
}

export default function Home() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!window.turnstile || !widgetRef.current) return;

    window.turnstile.render(widgetRef.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
      callback: (t: string) => setToken(t),
      "expired-callback": () => setToken(null),
      "error-callback": () => setToken(null),
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!email) {
      setMessage("Please enter an email.");
      return;
    }

    if (!token) {
      setMessage("Please complete the verification.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/leads`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      setMessage("You're on the waitlist 🎉");
      setEmail("");
      setToken(null);
      window.turnstile.reset();
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl border p-8">
        <h1 className="text-4xl font-semibold">ProbLabs</h1>
        <p className="mt-2 text-lg text-gray-600">
          AI-Powered Lottery Intelligence.
        </p>

        <p className="mt-6 text-gray-700">
          We’re building a data-driven analytics platform for Florida Lottery
          games: <strong>Fantasy 5</strong>, <strong>Pick 3</strong>,{" "}
          <strong>Pick 4</strong>, and <strong>Cash Pop</strong>.
        </p>

        <p className="mt-2 text-gray-500">Launching soon.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium">
            Get early access
          </label>

          <div className="flex gap-3">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-md border px-4 py-2"
            />
            <button
              disabled={loading}
              className="rounded-md bg-black px-5 py-2 text-white disabled:opacity-50"
            >
              {loading ? "…" : "Join"}
            </button>
          </div>

          {/* Turnstile widget */}
          <div ref={widgetRef} />

          {message && (
            <p className="text-sm text-gray-700">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}
