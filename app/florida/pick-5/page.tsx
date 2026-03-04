import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Florida Pick 5 Odds & Analysis (Straight vs Box) | ProbLabs",
  description:
    "Florida Pick 5 odds explained (Straight vs Box) + how the game works, why streaks happen naturally, and why patterns don’t predict the next draw. Educational only.",
  alternates: { canonical: "/florida/pick-5" },
  openGraph: {
    title: "Florida Pick 5 Odds & Analysis (Straight vs Box)",
    description:
      "Educational, probability-first explanation of Florida Pick 5: Straight vs Box, outcome space, streaks, and why patterns don’t forecast the next draw.",
    url: "/florida/pick-5",
    type: "article",
  },
};

// 1. Server-side fetch function to pull from your live Render API
async function getPick5Data() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "https://problabs-backend.onrender.com";
  
  try {
    const res = await fetch(`${apiBase}/api/v1/results/pick-5/latest`, {
      next: { revalidate: 3600 } // Cache the data for 1 hour
    });
    
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  } catch (error) {
    console.error("API connection failed:", error);
    return null; 
  }
}

// 2. Make the main component async so it can await the fetch
export default async function FloridaPick5Page() {
  const liveData = await getPick5Data();

  // 3. Fallbacks in case the API is ever down
  const middayDraw = liveData?.midday || ['-', '-', '-', '-', '-'];
  const eveningDraw = liveData?.evening || ['-', '-', '-', '-', '-'];
  const variance = liveData?.variance || { hot_digit: "-", hot_rate: "-", cold_digit: "-", cold_rate: "-" };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      
      {/* NAVIGATION - BACK TO HOME */}
      <nav className="mb-8">
        <Link 
          href="/" 
          className="text-sm font-medium text-white/50 hover:text-white transition-colors flex w-fit items-center gap-2"
        >
          <span>&larr;</span> Back to Home
        </Link>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Florida Pick 5 Odds &amp; Analysis (Straight vs Box)
        </h1>

        <p className="mt-4 text-base text-white/70 leading-relaxed">
          Educational, probability-first explanations for Florida Pick 5 — <strong>no predictions</strong>, no hype, no
          guarantees. We focus on how odds work, how streaks happen naturally, and why “patterns” don’t forecast the next
          draw.
        </p>

        <p className="mt-4 text-sm text-white/60">
          Want comparisons? Jump to{" "}
          <a className="underline underline-offset-4 hover:text-white/80" href="#compare">
            Pick 5 vs Pick 4 vs Pick 3
          </a>
          .
        </p>
      </header>

      {/* DASHBOARD SECTION INJECTING LIVE API DATA */}
      <section className="mb-12 grid gap-6 md:grid-cols-2">
        
        {/* Latest Results Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Latest Draw Results</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/50 mb-1">Midday (1:30 PM ET)</p>
              <div className="flex gap-2">
                {middayDraw.map((digit: string, i: number) => (
                  <div key={`mid-${i}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30">
                    {digit}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-white/50 mb-1">Evening (9:45 PM ET)</p>
              <div className="flex gap-2">
                {eveningDraw.map((digit: string, i: number) => (
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
              <span className="font-mono text-blue-400">{variance.hot_digit} ({variance.hot_rate})</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span>Coldest Digit (Pos 2)</span>
              <span className="font-mono text-purple-400">{variance.cold_digit} ({variance.cold_rate})</span>
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

      {/* EDUCATIONAL CONTENT */}
      <section className="space-y-12">
        <section id="how" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">How Florida Pick 5 works</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Florida Pick 5 draws five digits (0–9). That means outcomes range from <strong>00000</strong> to{" "}
            <strong>99999</strong>. Each drawing is statistically independent: yesterday’s draw does not affect today’s
            odds.
          </p>
        </section>

        <section id="odds" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Pick 5 odds: Straight vs Box (conceptually)</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Pick 5 odds depend on the play type (for example, exact order vs any order). Different play types change the
            number of winning permutations, but they do not make numbers “due.” Probability is fixed by the size of the
            outcome space.
          </p>
          <p className="mt-3 text-white/75 leading-relaxed">
            We’ll publish a full play-type odds table when we wire the analytics engine and historical draw dataset.
          </p>
        </section>

        <section id="compare" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Pick 5 vs Pick 4 vs Pick 3</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            These games differ mostly by <strong>outcome space size</strong>:
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-white/75">
            <li>
              <strong>Pick 3</strong>: 3 digits → 1,000 possible straight outcomes (000–999)
            </li>
            <li>
              <strong>Pick 4</strong>: 4 digits → 10,000 possible straight outcomes (0000–9999)
            </li>
            <li>
              <strong>Pick 5</strong>: 5 digits → 100,000 possible straight outcomes (00000–99999)
            </li>
          </ul>

          <p className="mt-4 text-white/75 leading-relaxed">
            A larger outcome space can feel “less repetitive,” but repeats still happen naturally over time. Frequency
            can describe the past; it can’t predict the next draw.
          </p>

          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <Link className="underline underline-offset-4 hover:text-white/80 text-white" href="/florida/pick-3">
              Read: Florida Pick 3 analysis
            </Link>
            <Link className="underline underline-offset-4 hover:text-white/80 text-white" href="/florida/pick-4">
              Read: Florida Pick 4 analysis
            </Link>
          </div>
        </section>

        <section id="freq" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Frequency vs probability</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Historical frequency shows what has happened, not what will happen next. Random systems naturally produce
            clusters and streaks — even when the underlying odds never change.
          </p>
        </section>

        <section id="misconceptions" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Common Pick 5 misconceptions</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-white/75">
            <li>Numbers are not “due” after long gaps</li>
            <li>Past draws do not influence future draws</li>
            <li>“Hot” or “cold” digits don’t override probability</li>
            <li>No pattern guarantees a winning outcome</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/70">Explore other Florida lottery analysis pages:</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida">
              Florida hub
            </Link>
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/pick-3">
              Pick 3
            </Link>
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/pick-4">
              Pick 4
            </Link>
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/fantasy-5">
              Fantasy 5
            </Link>
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/cash-pop">
              Cash Pop
            </Link>
          </div>
        </section>
      </section>

      <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
        Disclaimer: ProbLabs provides educational and analytical content only. We do not predict lottery numbers or
        guarantee outcomes.
      </footer>
    </main>
  );
}
