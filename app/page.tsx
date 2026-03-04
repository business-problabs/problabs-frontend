"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

declare global {
  interface Window {
    turnstile?: any;
  }
}

export default function HomePage() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const widgetRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // Render Turnstile once it’s available
  useEffect(() => {
    let cancelled = false;

    const tryRender = () => {
      if (cancelled) return;

      // If already rendered, don't re-render
      if (widgetIdRef.current) {
        setIsReady(true);
        return;
      }

      if (window.turnstile && widgetRef.current) {
        try {
          const id = window.turnstile.render(widgetRef.current, {
            sitekey: siteKey,
            theme: "light",
            callback: (token: string) => setTurnstileToken(token),
            "expired-callback": () => setTurnstileToken(null),
            "error-callback": () => setTurnstileToken(null),
          });

          widgetIdRef.current = String(id);
          setIsReady(true);
        } catch {
          // If render fails, keep trying briefly
        }
      }
    };

    // Try immediately + poll briefly until Turnstile loads
    tryRender();
    const interval = setInterval(tryRender, 250);

    // Stop polling after 10 seconds
    const timeout = setTimeout(() => clearInterval(interval), 10_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);

      // Cleanup Turnstile widget if possible
      try {
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
        }
      } catch {
        // ignore
      }
      widgetIdRef.current = null;
    };
  }, [siteKey]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOkMsg(null);
    setErrMsg(null);

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrMsg("Please enter your email.");
      return;
    }
    if (!turnstileToken) {
      setErrMsg("Please complete the anti-bot check.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          turnstile_token: turnstileToken,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.detail ||
          (res.status === 429
            ? "Too many requests. Please wait a minute and try again."
            : "Something went wrong. Please try again.");
        setErrMsg(msg);
        return;
      }

      setOkMsg("You’re on the list. Watch your inbox for updates.");
      setEmail("");

      // Reset Turnstile so next submission gets a fresh token
      try {
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
        }
      } catch {
        // ignore
      }
      setTurnstileToken(null);
    } catch {
      setErrMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit = isReady && !isSubmitting && !!turnstileToken;

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border p-8">
        <div className="mb-5 flex items-center justify-center">
          <img
            alt="Probability AI Labs"
            width={160}
            height={160}
            className="h-40 w-40 object-contain"
            src="/branding/logo-icon.png"
          />
        </div>

        <h1 className="text-4xl font-semibold text-center">Probability AI Labs</h1>
        <p className="mt-2 text-lg text-gray-600 text-center">AI-Powered Lottery Intelligence</p>

        <p className="mt-6 text-gray-700">
          We’re building a data-driven analytics platform for Florida Lottery games:{" "}
          <Link href="/florida/fantasy-5" className="text-blue-600 hover:underline font-semibold">Fantasy 5</Link>,{" "}
          <Link href="/florida/pick-3" className="text-blue-600 hover:underline font-semibold">Pick 3</Link>,{" "}
          <Link href="/florida/pick-4" className="text-blue-600 hover:underline font-semibold">Pick 4</Link>,{" "}
          <Link href="/florida/pick-5" className="text-blue-600 hover:underline font-semibold">Pick 5</Link>, and{" "}
          <Link href="/florida/cash-pop" className="text-blue-600 hover:underline font-semibold">Cash Pop</Link>.
        </p>

        <p className="mt-2 text-gray-500">Florida-only. Data-backed. No hype. No guarantees.</p>

        {/* Internal links (helps discovery + crawl paths) */}
        <div className="mt-6 rounded-xl border bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-800">Explore our Florida analysis pages:</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link className="underline underline-offset-4 hover:text-gray-700" href="/florida">
              Florida hub
            </Link>
            <Link className="underline underline-offset-4 hover:text-gray-700" href="/florida/pick-3">
              Pick 3
            </Link>
            <Link className="underline underline-offset-4 hover:text-gray-700" href="/florida/pick-4">
              Pick 4
            </Link>
            <Link className="underline underline-offset-4 hover:text-gray-700" href="/florida/pick-5">
              Pick 5
            </Link>
            <Link className="underline underline-offset-4 hover:text-gray-700" href="/florida/fantasy-5">
              Fantasy 5
            </Link>
            <Link className="underline underline-offset-4 hover:text-gray-700" href="/florida/cash-pop">
              Cash Pop
            </Link>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium" htmlFor="email">
            Get early access
          </label>

          <div className="flex gap-3">
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="flex-1 rounded-md border px-4 py-2"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
            />

            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-md bg-black px-5 py-2 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Joining…" : "Join"}
            </button>
          </div>

          <div className="mt-4">
            <div ref={widgetRef} />
          </div>

          <div aria-live="polite" className="text-sm">
            {okMsg ? <p className="text-green-700">{okMsg}</p> : null}
            {errMsg ? <p className="text-red-700">{errMsg}</p> : null}
            {!isReady ? <p className="text-gray-500">Loading anti-bot check…</p> : null}
          </div>
        </form>

        <section className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4 text-sm text-gray-700">
            <div>
              <div className="font-semibold text-gray-900">
                Is Probability AI Labs affiliated with the Florida Lottery?
              </div>
              <div className="mt-1">
                No. Probability AI Labs is an independent analytics project and is not affiliated with
                the Florida Lottery.
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

        <section className="mt-6 text-xs leading-relaxed text-gray-500">
          <p>
            <strong>Disclaimer:</strong> Probability AI Labs is not affiliated with the Florida Lottery.
            We provide analytical and educational information only and do not guarantee lottery outcomes.
          </p>
          <p className="mt-2">
            <strong>Privacy:</strong> We only use your email to send product updates and early access
            notices. Unsubscribe anytime using the link in any email.
          </p>
        </section>
      </div>
    </main>
  );
}
