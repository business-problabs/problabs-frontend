import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Florida Cash Pop Analysis & Probability Explained | ProbLabs",
  description:
    "Educational analysis of Florida Cash Pop odds, probability structure, and rapid-draw misconceptions. No predictions — data-driven insights only.",
  alternates: { canonical: "/florida/cash-pop" },
  openGraph: {
    title: "Florida Cash Pop Analysis & Probability Explained",
    description:
      "Educational analysis of Florida Cash Pop odds, probability structure, and rapid-draw misconceptions. No predictions — data-driven insights only.",
    url: "/florida/cash-pop",
    type: "article",
  },
};

// 1. Server-side fetch function to pull from your live Render API
async function getCashPopData() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "https://problabs-backend.onrender.com";
  
  try {
    const res = await fetch(`${apiBase}/api/v1/results/cash-pop/latest`, {
      next: { revalidate: 3600 } // Cache the data for 1 hour
    });
    
    if (!res.ok) throw new Error('Failed to fetch Cash Pop data');
    return res.json();
  } catch (error) {
    console.error("API connection failed:", error);
    return null; 
  }
}

// 2. Main async component
export default async function CashPopPage() {
  const liveData = await getCashPopData();

  // 3. Fallbacks in case the API is down or database is empty
  // Cash Pop only draws a single number per draw
  const middayDraw = liveData?.midday || ['-'];
  const eveningDraw = liveData?.evening || ['-'];
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
          Florida Cash Pop Analysis: Odds, Probability & Fixed Prizes Explained
        </h1>

        <p className="mt-4 text-base text-white/70 leading-relaxed">
          Florida Cash Pop is a rapid-draw game with fixed prizes that can make
          outcomes feel more “patterned” than they are. ProbLabs explains Cash Pop
          using probability and statistical behavior — not prediction.
        </p>
      </header>

      {/* DASHBOARD SECTION INJECTING LIVE API DATA */}
      <section className="mb-12 grid gap-6 md:grid-cols-2">
        
        {/* Latest Results Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Latest Draw Results</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/50 mb-1">Most Recent Draw</p>
              <div className="flex gap-2">
                {middayDraw.map((num: string, i: number) => (
                  <div key={`mid-${i}`} className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-lg font-bold border border-blue-500/30">
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-white/50 mb-1">Previous Draw</p>
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
              <span>Hottest Number</span>
              <span className="font-mono text-blue-400">{variance.hot_digit}</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span>Coldest Number</span>
              <span className="font-mono text-purple-400">{variance.cold_digit}</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span>Back-to-Back Repeat Rate</span>
              <span className="font-mono text-white">Tracked Soon</span>
            </li>
            <li className="flex justify-between pt-1">
              <span>Expected Uniform Mean</span>
              <span className="font-mono text-white/50">6.66%</span>
            </li>
          </ul>
        </div>
      </section>

      {/* EDUCATIONAL CONTENT */}
      <section className="space-y-12">
        <section id="how" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">How Florida Cash Pop works</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Cash Pop draws a single number at frequent intervals. Prizes are fixed
            rather than jackpot-based. Rapid draw frequency can intensify pattern
            perception, but it does not change probability.
          </p>
        </section>

        <section id="fixed-prizes" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Fixed prizes don’t change randomness</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Fixed payouts can make risk feel clearer, but the draw remains independent
            each time. The chance of any outcome does not increase because a number
            hasn’t appeared recently.
          </p>
        </section>

        <section id="bias" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Rapid draws amplify perception bias</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            When draws happen frequently, repeats and short-term clusters are noticed
            more often. Rapid feedback loops can cause people to over-interpret normal
            variance as meaningful momentum.
          </p>
        </section>

        <section id="misconceptions" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Common Cash Pop misconceptions</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-white/75">
            <li>Rapid draws do not improve predictability</li>
            <li>Repeats are expected and not a “signal”</li>
            <li>Fixed prizes reduce volatility, not randomness</li>
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
            <Link className="text-white underline underline-offset-4 hover:text-white/80" href="/florida/fantasy-5">
              Fantasy 5
            </Link>
          </div>
        </section>
      </section>

      <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
        Disclaimer: ProbLabs provides educational and analytical content only. We do
        not predict lottery numbers or guarantee outcomes.
      </footer>
    </main>
  );
}
