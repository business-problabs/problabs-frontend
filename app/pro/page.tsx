import { Metadata } from "next";
import Link from "next/link";
import UpgradeButton from "@/components/UpgradeButton";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "ProbLabs Pro — Advanced Florida Lottery Analytics",
  description: "Upgrade to ProbLabs Pro for historical backtesting, extended variance analysis, and automated draw alerts.",
  alternates: { canonical: "/pro" },
};

const FREE_FEATURES = [
  "Latest draw results — all games",
  "30-day hot/cold digit variance",
  "Pick 3, 4, 5, Fantasy 5, Cash Pop",
  "Educational probability breakdowns",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Historical backtesting — 3m, 6m, 1y, all-time",
  "Extended variance analysis by period",
  "Position-by-position digit frequency",
  "Automated draw alerts (coming soon)",
  "Priority access to new features",
];

export default async function ProPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("problabs_session")?.value;

  // Decode email from JWT payload (no verification needed here — middleware handles auth)
  let email = "";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      email = payload.email || "";
    } catch {
      // ignore
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <nav className="mb-8">
        <Link
          href="/"
          className="text-xl font-bold text-blue-400 hover:text-blue-200 transition-colors flex w-fit items-center gap-2 py-2"
        >
          <span className="text-3xl leading-none">←</span> Back to Home
        </Link>
      </nav>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          ProbLabs Pro
        </h1>
        <p className="mt-4 text-base text-white/70 leading-relaxed max-w-xl mx-auto">
          Deeper analytics for Florida Lottery games. No predictions, no hype —
          just more data, more history, and more context.
        </p>
      </header>

      {/* Pricing cards */}
      <section className="grid gap-6 md:grid-cols-2 mb-12">

        {/* Free */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col">
          <div className="mb-6">
            <p className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-2">Free</p>
            <p className="text-4xl font-bold text-white">$0</p>
            <p className="text-sm text-white/50 mt-1">No credit card required</p>
          </div>
          <ul className="space-y-3 flex-1">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-white/75">
                <span className="text-white/40 mt-0.5">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              href="/"
              className="block text-center rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white/70 hover:text-white hover:border-white/40 transition-colors"
            >
              Current plan
            </Link>
          </div>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border border-blue-500/40 bg-blue-600/10 p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full px-3 py-1">
              Pro
            </span>
          </div>
          <div className="mb-6">
            <p className="text-sm font-semibold text-blue-400/80 uppercase tracking-widest mb-2">Pro</p>
            <p className="text-4xl font-bold text-white">$9.99</p>
            <p className="text-sm text-white/50 mt-1">per month</p>
          </div>
          <ul className="space-y-3 flex-1">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-white/75">
                <span className="text-blue-400 mt-0.5">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            {email ? (
              <UpgradeButton email={email} />
            ) : (
              <Link
                href="/login?redirect=/pro"
                className="block text-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors"
              >
                Sign in to upgrade
              </Link>
            )}
          </div>
        </div>

      </section>

      {/* FAQ */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-xl font-semibold text-white mb-6">FAQ</h2>
        <div className="space-y-6 text-sm text-white/75">
          <div>
            <p className="font-semibold text-white/90 mb-1">What does backtesting show?</p>
            <p>It lets you analyze digit frequency across custom time ranges — 3 months, 6 months, 1 year, or all-time — rather than just the last 30 days.</p>
          </div>
          <div>
            <p className="font-semibold text-white/90 mb-1">Does Pro predict winning numbers?</p>
            <p>No. ProbLabs does not predict lottery outcomes. Pro gives you more historical data and analytical tools — not an edge over randomness.</p>
          </div>
          <div>
            <p className="font-semibold text-white/90 mb-1">Can I cancel anytime?</p>
            <p>Yes. Cancel anytime from your dashboard. Your Pro access continues until the end of the billing period.</p>
          </div>

        </div>
      </section>

      <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
        Disclaimer: ProbLabs provides educational and analytical content only. We do not predict lottery numbers or guarantee outcomes.
      </footer>
    </main>
  );
}
