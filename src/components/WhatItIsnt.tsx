import Eyebrow from "./Eyebrow";

const NEGATIVES = [
  "Not a drag-and-drop email builder.",
  "Not an image generator.",
  "Not a brand kit or template marketplace.",
  "Not a landing page composer.",
  "Not a CRM replacement.",
];

export default function WhatItIsnt() {
  return (
    <section id="isnt">
      <div className="wrap">
        <div className="section-head">
          <Eyebrow num="§ 06">WHAT IT ISN&apos;T</Eyebrow>
          <div className="rule" />
          <div className="eyebrow hide-sm" style={{ color: "var(--ink-4)" }}>FOCUS · LABOR SPLIT</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "clamp(32px, 5vw, 80px)", alignItems: "start" }}>
          <h2 style={{ color: "var(--ink)", maxWidth: "18ch" }}>What Onmatch isn&apos;t.</h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 0 }}>
            {NEGATIVES.map((n, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "24px minmax(0, 1fr)", gap: 14, padding: "clamp(14px, 1.6vw, 20px) 0", borderTop: i === 0 ? "1px solid var(--rule)" : 0, borderBottom: "1px solid var(--rule)", alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 14, color: "var(--ink-4)", fontWeight: 600, letterSpacing: "0.02em" }}>✕</span>
                <span style={{ fontSize: "clamp(18px, 1.6vw, 24px)", color: "var(--ink)", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.3 }}>{n}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: "clamp(40px, 5vw, 64px)", padding: "clamp(28px, 3vw, 44px)", background: "var(--accent)", color: "var(--accent-ink)", borderRadius: 14 }}>
          <h3 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 500, letterSpacing: "-0.035em", lineHeight: 1.05, maxWidth: "24ch", color: "var(--accent-ink)" }}>
            We don&apos;t make pretty emails.<br />
            We make emails that work.<br />
            <span style={{ color: "rgba(12,12,13,.55)" }}>You make them pretty.</span>
          </h3>
        </div>
      </div>
    </section>
  );
}
