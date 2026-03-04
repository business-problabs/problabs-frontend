import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Florida Pick 5 Odds & Analysis | ProbLabs",
  description:
    "Florida Pick 5 data analysis, latest results, and odds explained. Educational only.",
  alternates: { canonical: "/florida/pick-5" },
  openGraph: {
    title: "Florida Pick 5 Data & Analytics",
    description:
      "Probability-first analysis of Florida Pick 5. View positional variance and recent draw data.",
    url: "/florida/pick-5",
    type: "article",
  },
};

export default function FloridaPick5Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Florida Pick 5 Data & Analytics
        </h1>
        <p className="mt-4 text-base text-white/70 leading-relaxed">
          Educational, probability-first tracking for Florida Pick 5. We focus on how odds work, tracking short-term variance, and analyzing positional frequencies. <strong>No predictions. No guarantees.</strong>
        </p>
      </header>

      {/* NEW: Dashboard Section */}
      <section className="mb-12 grid gap-6 md:grid-cols-2">
        
        {/* Latest Results Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Latest Draw Results</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/50 mb-1">Midday (1:30 PM ET)</p>
              <div className="flex gap-2">
                {/* Mock Data: You will wire this to your backend API later */}
                {['7', '3', '6', '0', '5'].map((digit, i) => (
                  <div key={`mid-${i}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30">
                    {digit}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-white/50 mb-1">Evening (9:45 PM ET)</p>
              <div className="flex gap-2">
                {['8', '7', '6', '3', '4'].map((digit, i) => (
                  <div key={`eve-${i}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/20 text-purple-400 font-bold border border-purple-500/30">
                    {digit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Short-Term Variance Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Current Variance (30-Day)</h2>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span>Hottest Digit (Pos 1)</span>
              <span className="font-mono text-blue-400">7 (14.2%)</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span>Coldest Digit (Pos 2)</span>
              <span className="font-mono text-purple-400">2 (4.1%)</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span>Evening Double Rate</span>
              <span className="font-mono text-white">+15% vs Midday</span>
            </li>
            <li className="flex justify-between pt-1">
              <span>Expected Uniform Mean</span>
              <span className="font-mono text-white/50">10.0%</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Existing Educational Content */}
      <section className="space-y-12">
        <section id="how" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">How Florida Pick 5 works</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Florida Pick 5 draws five digits (0–9). That means outcomes range from <strong>00000</strong> to{" "}
            <strong>99999</strong>. Each drawing is statistically independent: yesterday’s draw does not affect today’s
            odds.
          </p>
        </section>

        <section id="compare" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Pick 5 vs Pick 4 vs Pick 3</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            These games differ mostly by <strong>outcome space size</strong>:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-white/75">
            <li><strong>Pick 3</strong>: 1,000 possible straight outcomes (000–999)</li>
            <li><strong>Pick 4</strong>: 10,000 possible straight outcomes (0000–9999)</li>
            <li><strong>Pick 5</strong>: 100,000 possible straight outcomes (00000–99999)</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/70">Explore other Florida lottery analysis pages:</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida">Florida hub</Link>
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/pick-3">Pick 3</Link>
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/pick-4">Pick 4</Link>
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/fantasy-5">Fantasy 5</Link>
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/cash-pop">Cash Pop</Link>
          </div>
        </section>
      </section>

      <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
        Disclaimer: ProbLabs provides educational and analytical content only. We do not predict lottery numbers or guarantee outcomes. Not affiliated with the Florida Lottery.
      </footer>
    </main>
  );
}
