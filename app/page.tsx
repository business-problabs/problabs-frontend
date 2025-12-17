
"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: any;
  }
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const tokenRef = useRef<string | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Load Turnstile script
  useEffect(() => {
    if (window.turnstile) return;

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  // Render Turnstile widget
  useEffect(() => {
    if (!window.turnstile || !widgetRef.current) return;

    window.turnstile.render(widgetRef.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      callback: (token: string) => {
        tokenRef.current = token;
      },
      "expired-callback": () => {
        tokenRef.current = null;
      },
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!tokenRef.current) {
      setStatus("error");
      setMessage("Please complete the verification.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("https://problabs-backend.onrender.com/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          turnstile_token: tokenRef.current,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data?.detail || "Signup failed");
      }

      setStatus("success");
      setMessage("You're on the list. We'll be in touch 🚀");
      setEmail("");
      tokenRef.current = null;
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 p-8">
        <h1 className="text-4xl font-semibold tracking-tight">ProbLabs</h1>
        <p className="mt-2 text-lg text-gray-600">
          AI-Powered Lottery Intelligence.
        </p>

        <div className="mt-6 space-y-3 text-gray-700">
          <p>
            We’re building a data-driven analytics platform for Florida Lottery
            games: <strong>Fantasy 5</strong>, <strong>Pick 3</strong>,{" "}
            <strong>Pick 4</strong>, and <strong>Cash Pop</strong>.
          </p>
          <p className="text-gray-500">Launching soon.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium">
            Get early access
          </label>

          <div className="flex gap-3">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-md bg-black px-5 py-2 text-white hover:bg-gray-900 disabled:opacity-50"
            >
              {status === "loading" ? "Joining…" : "Join"}
            </button>
          </div>

          {/* Turnstile widget */}
          <div ref={widgetRef} />

          {message && (
            <p
              className={`text-sm ${
                status === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
