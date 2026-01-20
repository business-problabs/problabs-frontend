"use client";

import { useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/leads`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen flex justify-center px-4 py-16 bg-neutral-50">
      <section className="w-full max-w-xl bg-white rounded-xl border border-neutral-200 p-8 shadow-sm text-center">
        {/* LOGO (BIG, NO TEXT) */}
        <div className="flex justify-center mb-6">
          <Image
            src="/branding/logo-probability-ai-labs.png"
            alt="Probability AI Labs logo"
            width={140}
            height={140}
            priority
          />
        </div>

        {/* HERO */}
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          Probability AI Labs
        </h1>

        <p className="text-lg text-neutral-600 mb-6">
          AI-Powered Lottery Intelligence
        </p>

        <p className="text-neutral-700 mb-2">
          We’re building a data-driven analytics platform for Florida Lottery
          games: <strong>Fantasy 5</strong>, <strong>Pick 3</strong>,{" "}
          <strong>Pick 4</strong>, and <strong>Cash Pop</strong>.
        </p>

        <p className="text-neutral-500 mb-8">
          Florida-only. Data-backed. No hype. No guarantees.
        </p>

        {/* FORM */}
        <p className="font-medium text-neutral-800 mb-2 text-left">
          Get early access
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-md border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-md bg-neutral-800 px-5 py-2 text-white hover:bg-neutral-900 disabled:opacity-60"
          >
            Join
          </button>
        </form>

        {status === "success" && (
          <p className="text-sm text-green-600 mb-4 text-left">
            You’re on the waitlist. Thanks for joining!
          </p>
        )}

        {status === "error" && (
          <p className="text-sm text-red-600 mb-4 text-left">
            Something went wrong. Please try again.
          </p>
        )}

        <hr className="my-8" />

        {/* FAQ */}
        <h2 className="text-lg font-semibold mb-4 text-left">FAQ</h2>

        <p className="font-medium text-left">
          Is Probability AI Labs affiliated with the Florida Lottery?
        </p>
        <p className="text-neutral-600 mb-4 text-left">
          No. Probability AI Labs is an independent analytics project and is not
          affiliated with the Florida Lottery.
        </p>

        <p className="font-medium text-left">
          Do you guarantee winnings or “winning numbers”?
        </p>
        <p className="text-neutral-600 mb-6 text-left">
          No. Lottery games are games of chance. We provide analytical and
          educational information only and do not guarantee outcomes.
        </p>

        <p className="text-xs text-neutral-500 text-left">
          <strong>Disclaimer:</strong> Probability AI Labs is not affiliated with
          the Florida Lottery. We provide analytical and educational information
          only and do not guarantee lottery outcomes.
        </p>

        <p className="text-xs text-neutral-500 mt-2 text-left">
          <strong>Privacy:</strong> We only use your email to send product updates
          and early access notices. Unsubscribe anytime using the link in any
          email.
        </p>
      </section>
    </main>
  );
}

