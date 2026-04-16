import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Florida Pick 3 Analysis & Probability Explained | ProbLabs",
  description:
    "Educational analysis of Florida Pick 3 odds, probability structure, and digit behavior. No predictions — data-driven insights only.",
  alternates: { canonical: "/florida/pick-3" },
  openGraph: {
    title: "Florida Pick 3 Analysis & Probability Explained",
    description:
      "Educational analysis of Florida Pick 3 odds, probability structure, and digit behavior. No predictions — data-driven insights only.",
    url: "/florida/pick-3",
    type: "article",
  },
};

// 1. Server-side fetch function to pull from your live Render API
async function getPick3Data() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "https://problabs-backend.onrender.com";
  
  try {
    const res = await fetch(`${apiBase}/api/v1/results/pick-3/latest`, {
      next: { revalidate: 3600 } // Cache the data for 1 hour
    });
    
    if (!res.ok) throw new Error('Failed to fetch Pick 3 data');
    return res.json();
  } catch (error) {
    console.error("API connection failed:", error);
    return null; 
  }
}

// 2. Main async component
export default async function Pick3Page() {
  const liveData = await getPick3Data();

  // 3. Fallbacks in case the API is down or database is empty
  const middayDraw = liveData?.midday || ['-', '-', '-'];
  const eveningDraw = liveData?.evening || ['-', '-', '-'];
  const variance = liveData?.variance || { hot_digit: "-", hot_rate: "-", cold_digit: "-", cold_rate: "-" };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      
      {/* NAVIGATION - BACK TO HOME */}
      <nav className="mb-8">
        <Link
          href="/"
          className="text-xl font-bold text-blue-400 hover:text-blue-200 transition-colors flex w-fit items-center gap-2 py-2"
        >
          <span className="text-3xl leading-none">←</span> Back to Home
        </Link>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Florida Pick 3 Analysis: Odds, Probability & Digit Behavior
        </h1>

        <p className="mt-4 text-base text-white/70 leading-relaxed">
          Florida Pick 3 is drawn twice daily and often feels “predictable” because
          outcomes repeat and streaks appear. ProbLabs explains Pick 3 using
          probability mechanics and historical behavior — not prediction.
        </p>

        <p className="mt-4 text-sm text-white/60">
          Want comparisons? Jump to{" "}
          <a className="underline underline-offset-4 hover:text-white/80" href="#compare">
            Pick 3 vs Pick 4 vs Pick 5
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
                  <div key={`mid-${i}`} className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-lg font-bold border border-blue-500/30">
                    {digit}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-white/50 mb-1">Evening (9:45 PM ET)</p>
              <div className="flex gap-2">
                {eveningDraw.map((digit: string, i: number) => (
                  <div key={`eve-${i}`} className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/20 text-purple-400 text-lg font-bold border border-purple-500/30">
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
              <span className="font-mono text-white">+11% vs Midday</span>
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
          <h2 className="text-2xl font-semibold text-white">How Florida Pick 3 works</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Pick 3 draws three digits from 0–9, producing outcomes from 000–999. Each
            draw is statistically independent of previous draws. Players can choose
            Straight, Box, or other play types.
          </p>
        </section>

        <section id="odds" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Pick 3 odds (straight)</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            For a Straight play (exact order), the odds are <strong>1 in 1,000</strong>. Box-style plays change the number of
            winning permutations and payouts, but do not make outcomes “due” or
            influenced by past results.
          </p>
        </section>

        <section id="repeats" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Repeats and streaks are expected</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Because Pick 3 has a smaller outcome space and frequent drawings, repeats
            and short streaks occur naturally. Frequency analysis can describe what
            happened, but it does not change what can happen next.
          </p>
        </section>

        <section id="compare" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Pick 3 vs Pick 4 vs Pick 5 (quick comparison)</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            These games mainly differ by <strong>outcome space size</strong> (how many possible straight results exist):
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-white/75">
            <li>
              <strong>Pick 3</strong>: 3 digits → 1,000 straight outcomes (000–999)
            </li>
            <li>
              <strong>Pick 4</strong>: 4 digits → 10,000 straight outcomes (0000–9999)
            </li>
            <li>
              <strong>Pick 5</strong>: 5 digits → 100,000 straight outcomes (00000–99999)
            </li>
          </ul>

          <p className="mt-4 text-white/75 leading-relaxed">
            A bigger outcome space can feel “less repetitive,” but repeats still happen naturally.
            Frequency can describe the past; it can’t forecast the next draw.
          </p>
        </section>

        <section id="misconceptions" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Common Pick 3 misconceptions</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-white/75">
            <li>More drawings do not make outcomes easier to predict</li>
            <li>“Missing” numbers are not guaranteed to appear soon</li>
            <li>Past results do not influence future draws</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/70">Explore other Florida lottery analysis pages:</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida">
              Florida hub
            </Link>
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/pick-4">
              Pick 4
            </Link>
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/pick-5">
              Pick 5
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
        Disclaimer: ProbLabs provides educational and analytical content only. We do not predict lottery numbers or guarantee outcomes.
      </footer>
    </main>
  );
}
