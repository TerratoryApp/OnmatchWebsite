import Eyebrow from "./Eyebrow";

interface Stage {
  m: string;
  filled: number;
  title: string;
  sub: string;
}

const STAGES: Stage[] = [
  { m: "01", filled: 4, title: "Knows what works for companies like yours, from day one.", sub: "Value from your data — your CRM history, past campaigns, brand voice." },
  { m: "06", filled: 22, title: "Sharpening on your specifics.", sub: "Your voice, your audience shape, your offer rhythm." },
  { m: "12", filled: 38, title: "Operating as part of the team.", sub: "Knows things about your audience your team doesn't know yet." },
];

export default function Compounding() {
  return (
    <section id="compounding">
      <div className="wrap">
        <div className="section-head">
          <Eyebrow num="§ 04">THE MOAT</Eyebrow>
          <div className="rule" />
          <div className="eyebrow hide-sm" style={{ color: "var(--ink-4)" }}>COMPOUNDING · NON-TRANSFERABLE</div>
        </div>

        <h2 style={{ maxWidth: "22ch", marginBottom: "clamp(20px, 2vw, 28px)", color: "var(--ink)" }}>
          Value from day one.<br />
          <span style={{ color: "var(--accent)" }}>Indispensable by month twelve.</span>
        </h2>

        <p style={{ maxWidth: "68ch", marginBottom: "clamp(40px, 5vw, 64px)", fontSize: "clamp(16px, 1.3vw, 19px)", color: "var(--ink-2)", lineHeight: 1.55 }}>
          Where Onmatch starts depends on what you bring — your CRM history, your past campaigns, your brand voice. From there it sharpens with every approval, every edit, every rejection — learning your specific audience, your specific voice, your specific offers. By month twelve, Onmatch isn&apos;t a tool you&apos;re using. It&apos;s a team member doing real thinking and real work.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(12px, 1.4vw, 20px)" }}>
          {STAGES.map((s) => (
            <div key={s.m} className="panel" style={{ padding: "clamp(28px, 2.6vw, 40px)", display: "flex", flexDirection: "column", gap: 20, minHeight: 380 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.1em", fontWeight: 600 }}>MONTH</div>
                <div style={{ fontSize: "clamp(48px, 4.5vw, 64px)", fontWeight: 500, letterSpacing: "-0.04em", color: "var(--accent)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.m}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 4, padding: "4px 0" }}>
                {Array.from({ length: 40 }, (_, i) => (
                  <div key={i} style={{ aspectRatio: "1", background: i < s.filled ? "var(--accent)" : "var(--bg-3)", opacity: i < s.filled ? 0.95 : 1, borderRadius: 2 }} />
                ))}
              </div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
                <span>knowledge depth</span>
                <span style={{ color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>{Math.round(s.filled / 40 * 100)}%</span>
              </div>
              <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--rule)" }}>
                <h3 style={{ fontSize: "clamp(17px, 1.4vw, 20px)", fontWeight: 500, color: "var(--ink)", lineHeight: 1.25, letterSpacing: "-0.015em", marginBottom: 8, maxWidth: "24ch" }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.5 }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "clamp(36px, 4vw, 56px)", padding: "clamp(24px, 3vw, 36px)", border: "1px solid var(--rule)", borderRadius: 12, background: "var(--bg-2)", display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "clamp(16px, 3vw, 36px)", alignItems: "center" }}>
          <p style={{ fontSize: "clamp(17px, 1.5vw, 22px)", color: "var(--ink)", lineHeight: 1.35, letterSpacing: "-0.015em", maxWidth: "40ch" }}>
            The asset isn&apos;t a campaign library. <span style={{ color: "var(--ink-3)" }}>It&apos;s a team member you&apos;ve trained — and it doesn&apos;t transfer to competitors. Marketing engineers build systems like this one company at a time. Onmatch builds yours.</span>
          </p>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "right" }}>
            switching cost<br />
            <span style={{ color: "var(--accent)", fontSize: 14, letterSpacing: "0.02em" }}>compounds with every send</span>
          </div>
        </div>
      </div>
    </section>
  );
}
