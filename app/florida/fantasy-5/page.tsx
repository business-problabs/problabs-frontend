import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Florida Fantasy 5 Analysis & Probability Insights | ProbLabs",
  description:
    "Educational analysis of Florida Fantasy 5 odds, probability mechanics, and number behavior. No predictions — data-driven insights only.",
};

export default function Fantasy5Page() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px" }}>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 34, lineHeight: 1.2, margin: 0 }}>
          Florida Fantasy 5 Analysis: Odds, Patterns & Probability Explained
        </h1>
        <p style={{ marginTop: 10, color: "#555", fontSize: 16, lineHeight: 1.6 }}>
          Florida Fantasy 5 is a daily draw game that often creates the impression
          that patterns repeat frequently. ProbLabs analyzes Fantasy 5 through
          probability mechanics and historical behavior — not prediction.
        </p>
      </header>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>
          How Florida Fantasy 5 works
        </h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Fantasy 5 draws five numbers from a pool of 1–36. Drawings occur every
          day, including weekends. Each drawing is statistically independent of
          previous results.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>Fantasy 5 odds</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The odds of matching all five numbers in Florida Fantasy 5 are
          approximately <strong>1 in 376,992</strong>. These odds do not change,
          regardless of past results, streaks, or perceived patterns.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>
          Frequency vs probability
        </h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Historical frequency shows what has happened, not what will happen next.
          Short-term clustering can occur naturally, but long-term distributions
          tend to normalize. Frequency does not override probability.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>
          Common Fantasy 5 misconceptions
        </h2>
        <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
          <li>Numbers are not “due” after long gaps</li>
          <li>Past draws do not influence future draws</li>
          <li>No pattern guarantees a winning outcome</li>
        </ul>
      </section>

      <section style={{ marginBottom: 10 }}>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Explore the broader{" "}
          <a href="/florida">Florida lottery analysis hub</a> or review our{" "}
          <a href="/disclaimer">disclaimer</a> for transparency.
        </p>
      </section>

      <hr style={{ margin: "28px 0", border: "none", borderTop: "1px solid #eee" }} />

      <p style={{ color: "#666", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
        Disclaimer: ProbLabs provides educational and analytical content only. We do
        not predict lottery numbers or guarantee outcomes.
      </p>
    </main>
  );
}

