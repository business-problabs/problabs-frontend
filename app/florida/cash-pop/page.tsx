import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Florida Cash Pop Analysis & Probability Explained | ProbLabs",
  description:
    "Educational analysis of Florida Cash Pop odds, probability structure, and number behavior. No predictions — data-driven insights only.",
  alternates: { canonical: "/florida/cash-pop" },
  openGraph: {
    title: "Florida Cash Pop Analysis & Probability Explained",
    description:
      "Educational analysis of Florida Cash Pop odds, probability structure, and number behavior. No predictions — data-driven insights only.",
    url: "/florida/cash-pop",
    type: "article",
  },
};

// 1. Server-side fetch function
async function getCashPopData() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "https://problabs-backend.onrender.com";
  
  try {
    const res = await fetch(`${apiBase}/api/v1/results/cash-pop/latest`, {
      next: { revalidate: 3600 } // Cache for 1 hour
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

  // 3. Fallbacks
  // Cash Pop has 5 draws/day. We define the structure to map API keys to UI labels.
  const draws = [
    { key: "morning", label: "Morning (8:45 AM ET)", color: "text-yellow-400", bg: "bg-yellow-600/20", border: "border-yellow-500/30" },
    { key: "matinee", label: "Matinee (1:00 PM ET)", color: "text-orange-400", bg: "bg-orange-600/20", border: "border-orange-500/30" },
    { key: "afternoon", label: "Afternoon (4:45 PM ET)", color: "text-red-400", bg: "bg-red-600/20", border: "border-red-500/30" },
    { key: "evening", label: "Evening (8:45 PM ET)", color: "text-purple-400", bg: "bg-purple-600/20", border: "border-purple-500/30" },
    { key: "late_night", label: "Late Night (11:45 PM ET)", color: "text-blue-400", bg: "bg-blue-600/20", border: "border-blue-500/30" },
  ];

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
          Florida Cash Pop Analysis: Odds, Probability & Number Behavior
        </h1>

        <p className="mt-4 text-base text-white/70 leading-relaxed">
          Florida Cash Pop is drawn five times daily. It is a single-number game
          where players select a number from 1 to 15. ProbLabs explains the
          probability mechanics and historical behavior — not prediction.
        </p>

        <p className="mt-4 text-sm text-white/60">
          Want comparisons? Jump to{" "}
          <a className="underline underline-offset-4 hover:text-white/80" href="#compare">
            Cash Pop vs Pick 3
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
            {draws.map((draw) => {
              // Safely access the draw data. Assuming it might be a single number or array.
              const rawVal = liveData?.[draw.key];
              const val = Array.isArray(rawVal) ? rawVal[0] : rawVal;
              const displayVal = val !== undefined && val !== null ? val : '-';

              return (
                <div key={draw.key}>
                  <p className="text-sm text-white/50 mb-1">{draw.label}</p>
                  <div className="flex gap-2">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${draw.bg} ${draw.color} text-lg font-bold border ${draw.border}`}>
                      {displayVal}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Short-Term Variance Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Current Variance (30-Day)</h2>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span>Hottest Number</span>
              <span className="font-mono text-blue-400">{variance.hot_digit} ({variance.hot_rate})</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span>Coldest Number</span>
              <span className="font-mono text-purple-400">{variance.cold_digit} ({variance.cold_rate})</span>
            </li>
            <li className="flex justify-between pt-1">
              <span>Expected Uniform Mean</span>
              <span className="font-mono text-white/50">6.7%</span>
            </li>
          </ul>
        </div>
      </section>

      {/* EDUCATIONAL CONTENT */}
      <section className="space-y-12">
        <section id="how" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">How Florida Cash Pop works</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Cash Pop draws a single number from 1 to 15. Draws occur five times a day:
            Morning, Matinee, Afternoon, Evening, and Late Night. Each draw is
            statistically independent.
          </p>
        </section>

        <section id="odds" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Cash Pop odds</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            The odds of matching the single winning number are <strong>1 in 15</strong>.
            The prize amount is determined at the time of purchase (printed on the ticket),
            not by the specific number drawn.
          </p>
        </section>

        <section id="compare" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-white">Cash Pop vs Pick 3 (quick comparison)</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            The main difference is the <strong>outcome space size</strong> and game mechanics:
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-white/75">
            <li>
              <strong>Cash Pop</strong>: 1 number from 1–15 → 15 outcomes.
            </li>
            <li>
              <strong>Pick 3</strong>: 3 digits from 0–9 → 1,000 outcomes.
            </li>
          </ul>
        </section>
      </section>

      <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
        Disclaimer: ProbLabs provides educational and analytical content only. We do not predict lottery numbers or guarantee outcomes.
      </footer>
    </main>
  );
}