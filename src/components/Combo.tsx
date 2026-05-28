import Eyebrow from "./Eyebrow";

interface Pillar {
  n: string;
  tag: string;
  title: string;
  body: string;
  demo: [string, string][];
  metric: { label: string; value: string; trend: string };
}

const PILLARS: Pillar[] = [
  {
    n: "01",
    tag: "ALWAYS ON · COLLABORATIVE",
    title: "Your instincts, at full volume.",
    body: "Onmatch is the teammate that never stops. Hand it a direction and it gets to work — drafting, testing, refining, and collaborating, while you steer.",
    demo: [
      ["DIRECTION", '"win back dormant trials"'],
      ["DRAFTING", "6 variants · 3 angles"],
      ["TESTING", "subject lines · send times"],
      ["REFINING", "against your approvals"],
    ],
    metric: { label: "campaigns in flight", value: "14", trend: "while you slept this week" },
  },
  {
    n: "02",
    tag: "REASONING · SHOWN",
    title: "Every decision, reasoned.",
    body: "Onmatch reasons over your campaigns, segments, and wins — and shows its work. Every audience, every sequence, every call comes with the why behind it. You're never approving a black box. You learn as it works.",
    demo: [
      ["AUDIENCE", "dormant trials · why: 84% overlap with your Q1 win"],
      ["SEQUENCE", "5 emails · why: matches your best-performing cadence"],
      ["TIMING", "T+2 send · why: your highest open-rate window"],
    ],
    metric: { label: "decisions explained", value: "every one", trend: "audience · sequence · timing · copy" },
  },
  {
    n: "03",
    tag: "GOAL IN · CAMPAIGN OUT",
    title: "Set a goal. Get a campaign.",
    body: "You bring the goal. Onmatch turns what's worked for you into a campaign worth sending — and leaves the calls that matter to you.",
    demo: [
      ["GOAL", "named in Onmatch"],
      ["DESIGN", "reads your CRM + history · crafts flow + copy"],
      ["BUILD", "campaign created in your CRM on approval"],
      ["MEASURE", "reads results · scores against goal · sharpens next"],
    ],
    metric: { label: "native translations", value: "4 tools", trend: "HubSpot · Salesforce · CIO · AC" },
  },
];

export default function Combo() {
  return (
    <section id="combo">
      <div className="wrap">
        <div className="section-head">
          <Eyebrow num="§ 01">THREE THINGS THAT MAKE IT WORK</Eyebrow>
          <div className="rule" />
          <div className="eyebrow hide-sm" style={{ color: "var(--ink-4)" }}>INTELLIGENCE LAYER · NOT ANOTHER TOOL</div>
        </div>

        <h2 style={{ maxWidth: "26ch", marginBottom: "clamp(40px, 5vw, 72px)", color: "var(--ink)" }}>
          Most marketing AI generates from everyone&apos;s data.{" "}
          <span style={{ color: "var(--accent)" }}>Onmatch reasons from yours — your work, your results, your conversions.</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "clamp(14px, 1.4vw, 20px)" }}>
          {PILLARS.map((p) => (
            <div key={p.n} className="panel" style={{ padding: "clamp(28px, 2.6vw, 40px)", display: "flex", flexDirection: "column", gap: 22, minHeight: 540, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.12em", fontWeight: 600 }}>{p.tag}</div>
                <div className="mono" style={{ fontSize: 18, color: "var(--ink-4)", letterSpacing: "-0.02em", fontWeight: 500 }}>{p.n}</div>
              </div>
              <h3 style={{ fontSize: "clamp(22px, 2vw, 28px)", fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--ink)", maxWidth: "16ch" }}>{p.title}</h3>
              <p style={{ fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.6, maxWidth: "46ch" }}>{p.body}</p>
              <div className="mono" style={{ fontSize: 11.5, lineHeight: 1.7, padding: "14px 16px", background: "var(--bg)", borderRadius: 8, border: "1px solid var(--rule)" }}>
                {p.demo.map(([k, v], i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "78px minmax(0, 1fr)", gap: 10 }}>
                    <span style={{ color: "var(--accent)", fontWeight: 500, letterSpacing: "0.05em" }}>{k}</span>
                    <span style={{ color: "var(--ink-2)", overflow: "hidden", textOverflow: "ellipsis" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--rule)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontSize: "clamp(22px, 2vw, 28px)", fontWeight: 500, color: "var(--ink)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", lineHeight: 1 }}>{p.metric.value}</div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>{p.metric.label}</div>
                </div>
                <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.02em", textAlign: "right", maxWidth: "18ch", lineHeight: 1.4 }}>{p.metric.trend}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
