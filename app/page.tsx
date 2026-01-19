"use client";

import { useState } from "react";
import Image from "next/image";

export default function Page() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Submission failed");
      }

      setStatus("success");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        {/* Logo only (no duplicate text) */}
        <div className="mb-6">
          <Image
            src="/branding/logo-probability-ai-labs.png"
            alt="Probability AI Labs"
            width={220}
            height={48}
            priority
          />
        </div>

        {/* Hero */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Probability AI Labs
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          AI-Powered Lottery Intelligence
        </p>

        <p className="text-gray-700 mb-2">
          We’re building a data-driven analytics platform for Florida Lottery
          games:{" "}
          <strong>Fantasy 5, Pick 3, Pick 4, and Cash Pop.</strong>
        </p>
        <p className="text-gray-500 mb-8">
          Florida-only. Data-backed. No hype. No guarantees.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-800">
            Get early access
          </label>

          <div className="flex gap-2">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              Join
            </button>
          </div>

          {status === "success" && (
            <p className="text-sm text-green-600">Success!</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </form>

        {/* Footer */}
        <hr className="my-8" />

        <div className="space-y-4 text-sm text-gray-700">
          <h2 className="font-semibold text-gray-900">FAQ</h2>

          <div>
            <p className="font-medium">
              Is Probability AI Labs affiliated with the Florida Lottery?
            </p>
            <p>
              No. Probability AI Labs is an independent analytics project and is
              not affiliated with the Florida Lottery.
            </p>
          </div>

          <div>
            <p className="font-medium">
              Do you guarantee winnings or “winning numbers”?
            </p>
            <p>
              No. Lottery games are games of chance. We provide analytical and
              educational information only and do not guarantee outcomes.
            </p>
          </div>

          <p className="text-xs text-gray-500 pt-4">
            <strong>Disclaimer:</strong> Probability AI Labs is not affiliated
            with the Florida Lottery. We provide analytical and educational
            information only and do not guarantee lottery outcomes.
          </p>

          <p className="text-xs text-gray-500">
            <strong>Privacy:</strong> We only use your email to send product
            updates and early access notices. Unsubscribe anytime using the link
            in any email.
          </p>
        </div>
      </div>
    </main>
  );
}

