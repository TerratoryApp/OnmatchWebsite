import Eyebrow from "./Eyebrow";

interface Step {
  n: string;
  t: string;
  d: string;
  cmd?: string;
  graduation?: boolean;
}

const STEPS: Step[] = [
  { n: "01", t: "You name the goal", d: 'Plain English. "Win back churned annual customers." "Q3 dormant trials." "New e-com founders." You name the outcome — Onmatch produces the campaign.', cmd: '> onmatch new "win back churned annual"' },
  { n: "02", t: "Audience scored", d: "Onmatch reads your CRM and scores every contact against what's worked before. Need to expand? Connect Findymail, Apollo, or Clay — searches generate, results route into the flow.", cmd: "→ scoring 2,847 contacts · match acc. 94%" },
  { n: "03", t: "Flow drafts", d: "Structure, copy, segments, branches — written in your voice, grounded in past flows from your library. Voice model sharpens every time you approve, edit, or reject.", cmd: "→ drafting 6-email sequence · 14d" },
  { n: "04", t: "You approve", d: "Review with reasoning visible. Edit anything. On approval, Onmatch builds the campaign in your CRM — where you add visuals and send.", cmd: "✓ approved · built in HubSpot" },
  { n: "05", t: "Autonomy graduates", d: "After enough approvals on a class of flow, Onmatch proposes taking the wheel on that class. You scope it. You can take it back any time. Graduate by class, not all-or-nothing.", graduation: true },
  { n: "06", t: "Measures what shipped", d: "Onmatch sees its campaigns go live in your CRM, pulls performance, and scores it against the goal you set. Every result sharpens the next campaign.", cmd: "↻ scoring vs goal · sharpening voice model" },
];

const LOOP_STEP = {
  t: "Outcomes, not jobs",
  d: 'Name an outcome once — "keep cold leads warm," "reactivate $500+ MRR churn" — and Onmatch pursues it continuously. Proposing new flows. Scoring new audiences. Drafting new copy. Each campaign you approve is one move in an ongoing strategy, not a one-off task.',
};

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="wrap">
        <div className="section-head">
          <Eyebrow num="§ 03">HOW IT WORKS</Eyebrow>
          <div className="rule" />
          <div className="eyebrow hide-sm" style={{ color: "var(--ink-4)" }}>IDEA TO FIRST SEND · ONE DAY</div>
        </div>

        <h2 style={{ maxWidth: "20ch", marginBottom: "clamp(24px, 2.5vw, 32px)", color: "var(--ink)" }}>
          Once it&apos;s running, it&apos;s running.
        </h2>
        <p style={{ maxWidth: "66ch", marginBottom: "clamp(48px, 6vw, 80px)", fontSize: "clamp(16px, 1.3vw, 19px)", color: "var(--ink-2)", lineHeight: 1.55 }}>
          Onmatch pursues the outcomes you&apos;ve named — continuously, across every campaign class — and surfaces decisions when it needs you. The five steps below are one campaign. The loop at the bottom is the work.{" "}
          <span style={{ color: "var(--ink-3)" }}>This is what marketing engineering looks like for outbound — one system handling work that used to require a coordinated team.</span>
        </p>

        <ol style={{ listStyle: "none", margin: 0, padding: 0, position: "relative" }}>
          <div aria-hidden="true" style={{ position: "absolute", left: 31, top: 14, bottom: 120, width: 1, background: "var(--rule-2)" }} />

          {STEPS.map((s, i) => (
            <li key={s.n} style={{ display: "grid", gridTemplateColumns: "64px minmax(0, 1fr) minmax(0, 1.2fr)", gap: "clamp(20px, 3vw, 48px)", padding: "clamp(20px, 2.5vw, 32px) 0", alignItems: "start", position: "relative" }}>
              <div style={{ width: 42, height: 42, borderRadius: 8, background: i === 0 ? "var(--accent)" : "var(--bg-2)", color: i === 0 ? "var(--accent-ink)" : "var(--ink-2)", border: "1px solid " + (i === 0 ? "var(--accent)" : "var(--rule-2)"), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 13, fontWeight: 600, position: "relative", zIndex: 1 }}>{s.n}</div>
              <div>
                <h3 style={{ fontSize: "clamp(20px, 1.7vw, 26px)", fontWeight: 500, color: "var(--ink)", marginBottom: 8, letterSpacing: "-0.02em" }}>{s.t}</h3>
                <p style={{ fontSize: "clamp(14.5px, 1.05vw, 16px)", color: "var(--ink-2)", lineHeight: 1.6, maxWidth: "46ch" }}>{s.d}</p>
              </div>
              {s.graduation ? (
                <GraduationCard />
              ) : (
                <div className="mono" style={{ fontSize: 12.5, color: "var(--ink-3)", padding: "14px 16px", background: "var(--bg)", border: "1px solid var(--rule)", borderRadius: 8, lineHeight: 1.5 }}>{s.cmd}</div>
              )}
            </li>
          ))}

          {/* Step ∞ — the loop */}
          <li style={{ display: "grid", gridTemplateColumns: "64px minmax(0, 1fr) minmax(0, 1.2fr)", gap: "clamp(20px, 3vw, 48px)", padding: "clamp(28px, 3vw, 40px) clamp(16px, 2vw, 28px)", marginTop: "clamp(24px, 3vw, 36px)", alignItems: "center", position: "relative", borderRadius: 14, background: "var(--accent-dim)", border: "1px solid color-mix(in oklab, var(--accent) 40%, transparent)" }}>
            <div style={{ width: 42, height: 42, borderRadius: 21, background: "var(--accent)", color: "var(--accent-ink)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 20, fontWeight: 600, position: "relative", zIndex: 1, lineHeight: 1 }}>∞</div>
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 8 }}>CONTINUOUS · STANDING COMMITMENT</div>
              <h3 style={{ fontSize: "clamp(20px, 1.7vw, 26px)", fontWeight: 500, color: "var(--ink)", marginBottom: 8, letterSpacing: "-0.02em" }}>{LOOP_STEP.t}</h3>
              <p style={{ fontSize: "clamp(14.5px, 1.05vw, 16px)", color: "var(--ink-2)", lineHeight: 1.6, maxWidth: "56ch" }}>{LOOP_STEP.d}</p>
            </div>
            <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", padding: "14px 16px", background: "var(--bg)", border: "1px solid color-mix(in oklab, var(--accent) 30%, transparent)", borderRadius: 8, lineHeight: 1.7 }}>
              <div style={{ color: "var(--ink-4)" }}>outcome: &quot;keep cold leads warm&quot;</div>
              <div><span style={{ color: "var(--accent)" }}>↻</span> 4 flows running</div>
              <div><span style={{ color: "var(--accent)" }}>↻</span> 2 audiences refreshing</div>
              <div><span style={{ color: "var(--accent)" }}>↻</span> 1 graduation pending</div>
              <div style={{ color: "var(--ink-2)", marginTop: 4 }}>status: <span style={{ color: "var(--accent)" }}>active</span><span className="caret" /></div>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}

function GraduationCard() {
  return (
    <div style={{ padding: "18px 18px 14px", background: "var(--bg)", border: "1px solid var(--accent)", borderRadius: 10, boxShadow: "0 0 0 4px var(--accent-dim)" }}>
      <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <span className="pip pulse" /> AUTONOMY PROPOSAL
      </div>
      <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.45, marginBottom: 6 }}>You&apos;ve approved 14 re-engagement flows in a row.</p>
      <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.45, marginBottom: 14 }}>Take the wheel on this class?</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button type="button" className="btn btn-sm" style={{ height: 30, padding: "0 12px", fontSize: 12 }}>Yes — autopilot</button>
        <button type="button" className="btn btn-ghost btn-sm" style={{ height: 30, padding: "0 12px", fontSize: 12 }}>Not yet</button>
        <button type="button" className="btn btn-ghost btn-sm" style={{ height: 30, padding: "0 12px", fontSize: 12 }}>Always ask</button>
      </div>
    </div>
  );
}
