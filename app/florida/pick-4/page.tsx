import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Florida Pick 4 Analysis & Probability Breakdown | ProbLabs",
  description:
    "Educational analysis of Florida Pick 4 odds, probability mechanics, and variance. No predictions — data-driven insights only.",
};

export default function Pick4Page() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px" }}>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 34, lineHeight: 1.2, margin: 0 }}>
          Florida Pick 4 Analysis: Odds, Probability & Variance Explained
        </h1>
        <p style={{ marginTop: 10, color: "#555", fontSize: 16, lineHeight: 1.6 }}>
          Florida Pick 4 expands the outcome space significantly compared to Pick 3.
          That increase raises variance, making “patterns” feel stronger than they
          are. ProbLabs explains Pick 4 using probability — not prediction.
        </p>
      </header>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>How Florida Pick 4 works</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Pick 4 draws four digits from 0–9, producing outcomes from 0000–9999. Each
          draw is statistically independent. Players can choose Straight, Box, and
          other play types.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>Pick 4 odds (straight)</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          For a Straight play (exact order), the odds are{" "}
          <strong>1 in 10,000</strong>. Box and combination play types change the
          number of winning permutations and payouts, but do not change the
          independence of draws.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>
          Why Pick 4 “dry spells” feel common
        </h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          With more possible outcomes, longer gaps between specific results are
          expected. Large outcome spaces naturally produce more variance and longer
          waiting times, even when everything is random and fair.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>
          Common Pick 4 misconceptions
        </h2>
        <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
          <li>Pick 4 is not just Pick 3 “plus one digit” — variance increases</li>
          <li>Long gaps do not imply a result is “due”</li>
          <li>Short-term streaks do not guarantee continuation</li>
        </ul>
      </section>

      <section style={{ marginBottom: 10 }}>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Return to the <a href="/florida">Florida analysis hub</a> or read the{" "}
          <a href="/disclaimer">disclaimer</a>.
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

