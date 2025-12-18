
"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: any) => string;
      execute: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
    };
  }
}

export default function Page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Turnstile mount node
  const widgetRef = useRef<HTMLDivElement | null>(null);
  // Turnstile widget id from render()
  const widgetIdRef = useRef<string | null>(null);
  // Resolver for awaiting token from Turnstile callback
  const tokenPromiseResolverRef = useRef<((token: string) => void) | null>(null);

  const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // Render Turnstile once script loads
  useEffect(() => {
    const tryRender = () => {
      if (!SITE_KEY) return;
      if (!widgetRef.current) return;
      if (!window.turnstile) return;
      if (widgetIdRef.current) return; // already rendered

      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: SITE_KEY,
        size: "invisible",
        theme: "light",
        callback: (token: string) => {
          // resolve the pending promise in join()
          if (tokenPromiseResolverRef.current) {
            tokenPromiseResolverRef.current(token);
            tokenPromiseResolverRef.current = null;
          }
        },
        "error-callback": () => {
          setMessage("Security check failed. Please try again.");
          tokenPromiseResolverRef.current = null;
        },
        "expired-callback": () => {
          tokenPromiseResolverRef.current = null;
        },
      });
    };

    // Poll briefly so we render as soon as script becomes available
    const interval = setInterval(tryRender, 250);
    tryRender();

    return () => clearInterval(interval);
  }, [SITE_KEY]);

  // One function used by both the form submit and the button click
  const join = async () => {
    console.log("JOIN CLICKED");
    setMessage(null);

    // Sanity checks
    if (!API_BASE) {
      console.log("STOP: API_BASE missing");
      setMessage("Missing NEXT_PUBLIC_API_BASE_URL in Vercel env vars.");
      return;
    }
    if (!SITE_KEY) {
      console.log("STOP: SITE_KEY missing");
      setMessage("Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY in Vercel env vars.");
      return;
    }
    if (!window.turnstile || !widgetIdRef.current) {
      console.log("STOP: Turnstile not ready", {
        turnstile: !!window.turnstile,
        widgetId: widgetIdRef.current,
      });
      setMessage("Security check not ready yet. Please try again in a moment.");
      return;
    }

    setLoading(true);

    try {
      // 1) Execute Turnstile and await token
      const token = await new Promise<string>((resolve, reject) => {
        tokenPromiseResolverRef.current = resolve;

        window.turnstile!.execute(widgetIdRef.current!);

        // Timeout safety
        setTimeout(() => {
          if (tokenPromiseResolverRef.current) {
            tokenPromiseResolverRef.current = null;
            reject(new Error("Timed out waiting for Turnstile token."));
          }
        }, 8000);
      });

      console.log("TOKEN RECEIVED");

      // 2) POST to backend
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
        const detail =
          (data && (data.detail || data.message)) || `Error ${res.status}`;
        throw new Error(detail);
      }

      setEmail("");
      setMessage("✅ You’re on the list. Launching soon!");
    } catch (err: any) {
      console.error("JOIN FAILED", err);
      setMessage(err?.message || "Something went wrong.");
    } finally {
      // Reset Turnstile so it can be executed again next time
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
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

            {/* Turnstile widget mount point (invisible) */}
            <div ref={widgetRef} style={{ display: "none" }} />

            {message && <p className="text-sm text-gray-700">{message}</p>}
          </form>
        </div>
      </main>
    </>
  );
}
