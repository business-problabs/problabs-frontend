import type { Metadata } from "next";

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

export default function Pick3Page() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px" }}>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 34, lineHeight: 1.2, margin: 0 }}>
          Florida Pick 3 Analysis: Odds, Probability & Digit Behavior
        </h1>
        <p style={{ marginTop: 10, color: "#555", fontSize: 16, lineHeight: 1.6 }}>
          Florida Pick 3 is drawn twice daily and often feels “predictable” because
          outcomes repeat and streaks appear. ProbLabs explains Pick 3 using
          probability mechanics and historical behavior — not prediction.
        </p>

        <p style={{ marginTop: 10, color: "#555", fontSize: 14, lineHeight: 1.6 }}>
          Want comparisons? Jump to{" "}
          <a href="#compare" style={{ textDecoration: "underline" }}>
            Pick 3 vs Pick 4 vs Pick 5
          </a>
          .
        </p>
      </header>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>How Florida Pick 3 works</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Pick 3 draws three digits from 0–9, producing outcomes from 000–999. Each
          draw is statistically independent of previous draws. Players can choose
          Straight, Box, or other play types.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>Pick 3 odds (straight)</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          For a Straight play (exact order), the odds are{" "}
          <strong>1 in 1,000</strong>. Box-style plays change the number of
          winning permutations and payouts, but do not make outcomes “due” or
          influenced by past results.
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>
          Repeats and streaks are expected
        </h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Because Pick 3 has a smaller outcome space and frequent drawings, repeats
          and short streaks occur naturally. Frequency analysis can describe what
          happened, but it does not change what can happen next.
        </p>
      </section>

      {/* Internal linking cluster */}
      <section id="compare" style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>
          Pick 3 vs Pick 4 vs Pick 5 (quick comparison)
        </h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          These games mainly differ by <strong>outcome space size</strong> (how many possible straight results exist):
        </p>
        <ul style={{ paddingLeft: 18, margin: "10px 0 0", lineHeight: 1.8 }}>
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

        <p style={{ marginTop: 12, lineHeight: 1.7 }}>
          A bigger outcome space can feel “less repetitive,” but repeats still happen naturally.
          Frequency can describe the past; it can’t forecast the next draw.
        </p>

        <p style={{ marginTop: 12, lineHeight: 1.7 }}>
          Read next:{" "}
          <a href="/florida/pick-4" style={{ textDecoration: "underline" }}>
            Florida Pick 4 analysis
          </a>{" "}
          ·{" "}
          <a href="/florida/pick-5" style={{ textDecoration: "underline" }}>
            Florida Pick 5 odds & analysis
          </a>{" "}
          ·{" "}
          <a href="/florida" style={{ textDecoration: "underline" }}>
            Florida hub
          </a>
        </p>
      </section>

      <section style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>
          Common Pick 3 misconceptions
        </h2>
        <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
          <li>More drawings do not make outcomes easier to predict</li>
          <li>“Missing” numbers are not guaranteed to appear soon</li>
          <li>Past results do not influence future draws</li>
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
