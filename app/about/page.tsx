import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ProbLabs | Probability AI Labs",
  description:
    "ProbLabs (Probability AI Labs) is a Florida-only lottery analytics project focused on educational probability insights. Not affiliated with the Florida Lottery.",
};

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px" }}>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 34, lineHeight: 1.2, margin: 0 }}>
          About ProbLabs
        </h1>
        <p style={{ marginTop: 10, color: "#555", fontSize: 16, lineHeight: 1.6 }}>
          ProbLabs (Probability AI Labs) is an independent analytics project focused
          exclusively on Florida lottery games. We provide educational, data-informed
          probability insights — not predictions.
        </p>
      </header>

      <section style={{ marginBottom: 26 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>Our focus</h2>
        <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.7 }}>
          <li>Florida-only coverage (no national expansion pages)</li>
          <li>Probability and statistical behavior explained in plain language</li>
          <li>Historical analysis for education and context</li>
          <li>Trust-first approach: no hype, no guarantees</li>
        </ul>
      </section>

      <section style={{ marginBottom: 26 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>What we do (and don’t do)</h2>

        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ padding: 14, border: "1px solid #e6e6e6", borderRadius: 10 }}>
            <strong>We do:</strong>
            <ul style={{ paddingLeft: 18, margin: "10px 0 0 0", lineHeight: 1.7 }}>
              <li>Explain odds and probability mechanics</li>
              <li>Analyze historical distributions and variance</li>
              <li>Highlight common misconceptions (e.g., “due numbers”)</li>
            </ul>
          </div>

          <div style={{ padding: 14, border: "1px solid #e6e6e6", borderRadius: 10 }}>
            <strong>We don’t:</strong>
            <ul style={{ paddingLeft: 18, margin: "10px 0 0 0", lineHeight: 1.7 }}>
              <li>Predict winning numbers</li>
              <li>Guarantee outcomes</li>
              <li>Sell “sure-win” systems or picks</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 26 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>Games covered</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          We currently focus on: <strong>Fantasy 5</strong>, <strong>Pick 3</strong>,{" "}
          <strong>Pick 4</strong>, <strong>Pick 5</strong>, and <strong>Cash Pop</strong>.
        </p>
      </section>

      <section style={{ marginBottom: 10 }}>
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>Transparency</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          ProbLabs / Probability AI Labs is <strong>not affiliated</strong> with the
          Florida Lottery. Content is provided for educational and analytical purposes
          only.
        </p>
      </section>

      <hr style={{ margin: "28px 0", border: "none", borderTop: "1px solid #eee" }} />

      <p style={{ color: "#666", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
        Disclaimer: Lottery games are games of chance. Past results do not influence
        future drawings. ProbLabs does not guarantee lottery outcomes.
      </p>
    </main>
  );
}
