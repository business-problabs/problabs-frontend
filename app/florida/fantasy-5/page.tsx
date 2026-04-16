import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Florida Fantasy 5 Analysis & Probability Insights | ProbLabs",
  description:
    "Educational analysis of Florida Fantasy 5 odds, probability mechanics, and number behavior. No predictions — data-driven insights only.",
  alternates: { canonical: "/florida/fantasy-5" },
  openGraph: {
    title: "Florida Fantasy 5 Analysis & Probability Insights",
    description:
      "Educational analysis of Florida Fantasy 5 odds, probability mechanics, and number behavior. No predictions — data-driven insights only.",
    url: "/florida/fantasy-5",
    type: "article",
  },
};

// 1. Server-side fetch function to pull from your live Render API
async function getFantasy5Data() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "https://problabs-backend.onrender.com";
  
  try {
    const res = await fetch(`${apiBase}/api/v1/results/fantasy-5/latest`, {
      next: { revalidate: 3600 } // Cache the data for 1 hour
    });
    
    if (!res.ok) throw new Error('Failed to fetch Fantasy 5 data');
    return res.json();
  } catch (error) {
    console.error("API connection failed:", error);
    return null; 
  }
}

// 2. Main async component
export default async function Fantasy5Page() {
  const liveData = await getFantasy5Data();

  // 3. Fallbacks in case the API is down or database is empty
  const middayDraw = liveData?.midday || ['-', '-', '-', '-', '-'];
  const eveningDraw = liveData?.evening || ['-', '-', '-', '-', '-'];
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
          Florida Fantasy 5 Analysis: Odds, Patterns & Probability Explained
        </h1>

        <p className="mt-4 text-base text-white/70 leading-relaxed">
          Florida Fantasy 5 is a daily draw game that often creates the impression
          that patterns repeat frequently. ProbLabs analyzes Fantasy 5 through
          probability mechanics and historical behavior — not prediction.
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
                {middayDraw.map((num: string, i: number) => (
                  <div key={`mid-${i}`} className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-lg font-bold border border-blue-500/30">
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-white/50 mb-1">Evening (11:15 PM ET)</p>
              <div className="flex gap-2">
                {eveningDraw.map((num: string, i: number) => (
                  <div key={`eve-${i}`} className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/20 text-purple-400 text-lg font-bold border border-purple-500/30">
                    {num}
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
              <span>Most Frequent Number</span>
              <span className="font-mono text-blue-400">{variance.hot_digit}</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span>Least Frequent Number</span>
              <span className="font-mono text-purple-400">{variance.cold_digit}</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span>Consecutive Number Rate</span>
              <span className="font-mono text-white">Tracked Soon</span>
            </li>
            <li className="flex justify-between pt-1">
              <span>Expected Uniform Mean</span>
              <span className="font-mono text-white/50">~13.8%</span>
            </li>
          </ul>
        </div>
      </section>

      {/* EDUCATIONAL CONTENT */}
      <section className="space-y-12">
        <section id="how" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">How Florida Fantasy 5 works</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Fantasy 5 draws five numbers from a pool of 1–36. Drawings occur twice every
            day, including weekends. Each drawing is statistically independent of
            previous results.
          </p>
        </section>

        <section id="odds" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Fantasy 5 odds</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            The odds of matching all five numbers in Florida Fantasy 5 are
            approximately <strong>1 in 376,992</strong>. These odds do not change,
            regardless of past results, streaks, or perceived patterns.
          </p>
        </section>

        <section id="freq" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Frequency vs probability</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Historical frequency shows what has happened, not what will happen next.
            Short-term clustering can occur naturally, but long-term distributions
            tend to normalize. Frequency does not override probability.
          </p>
        </section>

        <section id="misconceptions" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Common Fantasy 5 misconceptions</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-white/75">
            <li>Numbers are not “due” after long gaps</li>
            <li>Past draws do not influence future draws</li>
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
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/pick-5">
              Pick 5
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
