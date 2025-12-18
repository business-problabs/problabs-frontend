
"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: any) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export default function Page() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const widgetRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // Render visible Turnstile
  useEffect(() => {
    const tryRender = () => {
      if (!SITE_KEY) return;
      if (!widgetRef.current) return;
      if (!window.turnstile) return;
      if (widgetIdRef.current) return; // already rendered

      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: SITE_KEY,
        theme: "light",
        // visible by default
        callback: (t: string) => {
          setToken(t);
          setMessage(null);
        },
        "expired-callback": () => {
          setToken(null);
          setMessage("Verification expired. Please complete it again.");
        },
        "error-callback": () => {
          setToken(null);
          setMessage("Verification failed. Please try again.");
        },
      });
    };

    const interval = setInterval(tryRender, 250);
    tryRender();

    return () => clearInterval(interval);
  }, [SITE_KEY]);

  const resetTurnstile = () => {
    if (window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
    }
    setToken(null);
  };

  const join = async () => {
    console.log("JOIN CLICKED");

    setMessage(null);

    if (!API_BASE) {
      setMessage("Missing NEXT_PUBLIC_API_BASE_URL in Vercel env vars.");
      return;
    }
    if (!SITE_KEY) {
      setMessage("Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY in Vercel env vars.");
      return;
    }
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
      const base = API_BASE.replace(/\/$/, "");
      const res = await fetch(`${base}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          turnstile_token: token,
        }),
      });

      console.log("FETCH SENT", res.status);

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.detail || data?.message || `Error ${res.status}`);
      }

      setEmail("");
      setMessage("✅ You’re on the list. Launching soon!");
      resetTurnstile();
    } catch (err: any) {
      console.error("JOIN FAILED", err);
      setMessage(err?.message || "Something went wrong.");
      resetTurnstile();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />

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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              join();
            }}
            className="mt-8 space-y-4"
          >
            <label className="block text-sm font-medium">Get early access</label>

            <div className="flex gap-3">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-md border px-4 py-2"
                required
              />

              <button
                type="button"
                onClick={join}
                disabled={loading}
                className="rounded-md bg-black px-5 py-2 text-white disabled:opacity-50"
              >
                {loading ? "…" : "Join"}
              </button>
            </div>

            {/* ✅ Visible Turnstile widget */}
            <div ref={widgetRef} className="mt-4" />

            {message && <p className="text-sm text-gray-700">{message}</p>}
          </form>
        </div>
      </main>
    </>
  );
}
