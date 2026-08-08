import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Florida Lottery Analysis & Probability Insights | ProbLabs",
  description:
    "Educational analysis of Florida lottery games, odds, and probability behavior. Florida-only. No predictions — data-driven insights.",
  alternates: { canonical: "/florida" },
};

export default function FloridaHubPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px" }}>
      <nav style={{ marginBottom: 24 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 20,
            fontWeight: 700,
            color: "#1d4ed8",
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: 28, lineHeight: 1 }}>←</span> Back to Home
        </Link>
      </nav>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 34, lineHeight: 1.2, margin: 0 }}>
          Florida Lottery Analysis: Probability, Odds & Game Behavior
        </h1>
        <p style={{ marginTop: 10, color: "#555", fontSize: 16, lineHeight: 1.6 }}>
          ProbLabs focuses exclusively on Florida lottery games. We provide
          educational, probability-based analysis — not predictions, not guarantees.
        </p>
      </header>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>Games we analyze</h2>
        <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
          <li>
            <a href="/florida/fantasy-5">Florida Fantasy 5 analysis</a>
          </li>
          <li>
            <a href="/florida/pick-5">Florida Pick 5 analysis</a>
          </li>
          <li>
            <a href="/florida/pick-3">Florida Pick 3 analysis</a>
          </li>
          <li>
            <a href="/florida/pick-4">Florida Pick 4 analysis</a>
          </li>
          <li>
            <a href="/florida/cash-pop">Florida Cash Pop analysis</a>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>
          How ProbLabs approaches analysis
        </h2>
        <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
          <li>We explain odds and probability mechanics in plain language.</li>
          <li>We analyze historical distributions and variance responsibly.</li>
          <li>We highlight common misconceptions (like “due numbers”).</li>
          <li>We do not sell picks or claim predictive accuracy.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 10 }}>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          For transparency, read our <a href="/disclaimer">disclaimer</a> and learn
          more <a href="/about">about ProbLabs</a>.
        </p>
      </section>

      <hr
        style={{
          margin: "28px 0",
          border: "none",
          borderTop: "1px solid #eee",
        }}
      />

      <p style={{ color: "#666", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
        Disclaimer: ProbLabs provides educational and analytical content only. We do
        not predict lottery numbers or guarantee outcomes. Past results do not
        influence future drawings.
      </p>
    </main>
  );
}

