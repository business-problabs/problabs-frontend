import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Florida Pick 5 Analysis: Odds, Patterns & Probability Explained | Probability AI Labs",
  description:
    "Florida Pick 5 is a daily draw game. Learn how it works, the real odds, and why historical patterns don’t predict future results. Data-first, no hype.",
  alternates: { canonical: "/florida/pick-5" },
  openGraph: {
    title: "Florida Pick 5 Analysis: Odds, Patterns & Probability Explained",
    description:
      "How Florida Pick 5 works, the actual odds, and how to think about patterns and probability (without prediction).",
    url: "/florida/pick-5",
    type: "article",
  },
};

export default function FloridaPick5Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Florida Pick 5 Analysis: Odds, Patterns & Probability Explained
        </h1>
        <p className="mt-4 text-base text-white/70">
          Florida Pick 5 is a daily numbers game. Probability AI Labs analyzes Pick 5
          through math and historical behavior — not prediction.
        </p>
      </header>

      <section className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold text-white">How Florida Pick 5 works</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Pick 5 lets players select five digits (0–9). Each draw is statistically
            independent from previous draws. Yesterday’s outcome does not change today’s probability.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white">Pick 5 odds</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Odds depend on the specific play type (exact order, any order, etc.).
            The probability is fixed by the number of possible combinations and does not
            change due to streaks or past results.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white">Frequency vs probability</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Historical frequency describes what has happened. It does not predict what
            will happen next. Random sequences naturally create short-term clusters.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white">Common Pick 5 misconceptions</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-white/75">
            <li>Numbers are not “due” after long gaps</li>
            <li>Past draws do not influence future draws</li>
            <li>No pattern guarantees a winning outcome</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/70">
            Explore other Florida lottery analysis pages:
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida">
              Florida hub
            </Link>
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/fantasy-5">
              Fantasy 5
            </Link>
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/pick-3">
              Pick 3
            </Link>
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/pick-4">
              Pick 4
            </Link>
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/cash-pop">
              Cash Pop
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
        Disclaimer: ProbLabs provides educational and analytical content only.
        We do not predict lottery numbers or guarantee outcomes.
      </footer>
    </main>
  );
}

