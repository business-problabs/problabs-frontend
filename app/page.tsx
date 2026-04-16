import React from "react";
import Link from "next/link";

export default function HomePage() {
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

        <div className="flex items-center justify-between mb-1">
          <h1 className="text-4xl font-semibold">Probability AI Labs</h1>
          <Link
            href="/login"
            className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            Sign in →
          </Link>
        </div>
        <p className="mt-2 text-lg text-gray-600">AI-Powered Lottery Intelligence</p>

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

        {/* Pro plan CTA */}
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-900">ProbLabs Pro — $9.99/mo</p>
              <p className="mt-1 text-sm text-blue-700">
                Historical backtesting, extended variance analysis, and automated draw alerts.
              </p>
            </div>
            <Link
              href="/pro"
              className="ml-4 flex-shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              View Pro
            </Link>
          </div>
        </div>

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
            <strong>Privacy:</strong> We respect your privacy. Sign in with a magic link — no password
            required.
          </p>
        </section>
      </div>
    </main>
  );
}
