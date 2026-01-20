"use client";

import Script from "next/script";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type LeadResponse = {
  ok?: boolean;
  inserted?: boolean;
  message?: string;
  detail?: any;
};

declare global {
  interface Window {
    turnstile?: any;
  }
}

export default function Page() {
  const widgetRef = useRef<HTMLDivElement | null>(null);

  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Render Turnstile (explicit)
  useEffect(() => {
    if (!siteKey) {
      console.warn("Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY");
      return;
    }

    const tryRender = () => {
      if (!window.turnstile || !widgetRef.current) return;

      // Avoid double render
      if (widgetId) return;

      const id = window.turnstile.render(widgetRef.current, {
        sitekey: siteKey,
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(null),
        "error-callback": () => setToken(null),
      });

      setWidgetId(id);
    };

    const interval = setInterval(tryRender, 200);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, widgetId]);

  const resetTurnstile = () => {
    try {
      if (window.turnstile && widgetId) {
        window.turnstile.reset(widgetId);
      }
    } catch {
      // ignore
    } finally {
      setToken(null);
    }
  };

  const join = async () => {
    setMessage(null);

    if (!apiBase) {
      setMessage("Config error: missing API base URL.");
      return;
    }
    if (!token) {
      setMessage("Please complete the verification.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          turnstile_token: token, // backend expects this
        }),
      });

      const data: LeadResponse = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        const detail = (data as any)?.detail;
        const detailMsg =
          typeof detail === "string"
            ? detail
            : typeof detail?.message === "string"
              ? detail.message
              : null;

        throw new Error(detailMsg || (data as any)?.message || `Error ${res.status}`);
      }

      setMessage((data as any)?.message || "✅ Success!");
      setEmail("");
      resetTurnstile();
    } catch (err: any) {
      setMessage(err?.message || "Something went wrong.");
      resetTurnstile();
    } finally {
      setLoading(false);
    }
  };

  const joinDisabled = loading || !email.trim() || !token;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />

      <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-2xl border p-8">
          {/* BIG ICON (no text inside the image) */}
          <div className="mb-5 flex items-center justify-center">
            <Image
              src="/branding/logo-icon.png"
              alt="Probability AI Labs"
              width={160}
              height={160}
              priority
              className="h-40 w-40 object-contain" // ~4x bigger than typical tiny header logos
            />
          </div>

          <h1 className="text-4xl font-semibold text-center">Probability AI Labs</h1>
          <p className="mt-2 text-lg text-gray-600 text-center">
            AI-Powered Lottery Intelligence
          </p>

          <p className="mt-6 text-gray-700">
            We’re building a data-driven analytics platform for Florida Lottery games:{" "}
            <strong>Fantasy 5</strong>, <strong>Pick 3</strong>, <strong>Pick 4</strong>, and{" "}
            <strong>Cash Pop</strong>.
          </p>

          <p className="mt-2 text-gray-500">
            Florida-only. Data-backed. No hype. No guarantees.
          </p>

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
                disabled={joinDisabled}
                className="rounded-md bg-black px-5 py-2 text-white disabled:opacity-50"
              >
                {loading ? "…" : "Join"}
              </button>
            </div>

            <div ref={widgetRef} className="mt-4" />

            {message && <p className="text-sm text-gray-700">{message}</p>}
          </form>

          {/* FAQ */}
          <section className="mt-10 border-t pt-6">
            <h2 className="text-lg font-semibold">FAQ</h2>

            <div className="mt-4 space-y-4 text-sm text-gray-700">
              <div>
                <div className="font-semibold text-gray-900">
                  Is Probability AI Labs affiliated with the Florida Lottery?
                </div>
                <div className="mt-1">
                  No. Probability AI Labs is an independent analytics project and is not affiliated
                  with the Florida Lottery.
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-900">
                  Do you guarantee winnings or “winning numbers”?
                </div>
                <div className="mt-1">
                  No. Lottery games are games of chance. We provide analytical and educational
                  information only and do not guarantee outcomes.
                </div>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mt-6 text-xs leading-relaxed text-gray-500">
            <p>
              <strong>Disclaimer:</strong> Probability AI Labs is not affiliated with the Florida
              Lottery. We provide analytical and educational information only and do not guarantee
              lottery outcomes.
            </p>
            <p className="mt-2">
              <strong>Privacy:</strong> We only use your email to send product updates and early
              access notices. Unsubscribe anytime using the link in any email.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}

