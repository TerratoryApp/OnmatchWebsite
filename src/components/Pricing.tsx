"use client";

import { useState } from "react";
import Arrow from "./Arrow";
import EmailField from "./EmailField";
import Eyebrow from "./Eyebrow";

interface Tier {
  id: string;
  name: string;
  role: string;
  rate: number;
  standard: number;
  badge: string | null;
  features: string[];
  note: string;
  cta: string;
  emphasized: boolean;
  softLaunch: boolean;
}

const TIERS: Tier[] = [
  {
    id: "starter", name: "Starter", role: "Solo founders · small teams",
    rate: 59, standard: 99, badge: null,
    features: ["Flow generation · 8 / month", "Connect 1 marketing tool", "Connect 1 lead provider · optional", "Voice model + workflow library", "Approval review with reasoning", "Month-to-month after founder year"],
    note: "The learning loop starts day one — intelligent priors from category benchmarks sharpen against your data as it accrues.",
    cta: "Lock starter rate", emphasized: false, softLaunch: false,
  },
  {
    id: "operator", name: "Operator", role: "$1–20M ARR · running outbound seriously",
    rate: 249, standard: 449, badge: "RECOMMENDED",
    features: ["Full flow generation · fair-use cap", "Connect all 4 marketing tools", "Connect all 3 lead providers", "Voice model · full historical depth", "Workflow library · unlimited", "Graduation to autonomy by class", "Priority support", "Month-to-month after founder year"],
    note: "The standard product. Where most early customers land.",
    cta: "Lock operator rate", emphasized: true, softLaunch: false,
  },
  {
    id: "scale", name: "Scale", role: "Teams · multi-brand · multi-function",
    rate: 499, standard: 999, badge: "LOCK NOW · SHIPS AFTER",
    features: ["Everything in Operator", "Team seats + role-based access", "Per-class confidence thresholds", "Exception routing rules", "Multi-brand voice modeling", "Outcome attribution reporting"],
    note: "Locks the founder rate now — features ship after Starter and Operator are in market and pressure-tested.",
    cta: "Hold scale rate", emphasized: false, softLaunch: true,
  },
];

const PRE_SALE_BEATS = [
  { n: "01", t: "Pay one month upfront", d: "Your founder rate × 1.", timing: "NOW" },
  { n: "02", t: "Twelve months locked", d: "When Onmatch goes live, your rate doesn't move for a year.", timing: "AT LAUNCH" },
  { n: "03", t: "First month on us", d: "The month you paid? Comped. The clock starts the month after.", timing: "LAUNCH WEEK" },
];

const COMPARISON_ROWS: [string, string, string][] = [
  ["Fractional growth contractor", "$5,000+ / mo", "Still your brief. Still ramp time."],
  ["In-house outbound hire", "$80,000+ / yr", "Plus benefits. Plus management."],
  ["Marketing platform alone", "You already pay", "Powerful. Mostly idle. You use 20%."],
  ["Onmatch Operator", "$249 / mo · locked", "Makes what you already pay for actually run."],
];

export default function Pricing() {
  return (
    <section id="pricing">
      <div className="wrap">
        <div className="section-head">
          <Eyebrow num="§ 07">PRICING · FOUNDER PRE-SALE</Eyebrow>
          <div className="rule" />
          <div className="eyebrow hide-sm" style={{ color: "var(--ink-4)" }}>WINDOW CLOSES AT LAUNCH</div>
        </div>

        <h2 style={{ maxWidth: "18ch", marginBottom: "clamp(24px, 2.5vw, 32px)", color: "var(--ink)" }}>
          Lock in your founder rate <span style={{ color: "var(--accent)" }}>today.</span>
        </h2>

        <p style={{ maxWidth: "66ch", marginBottom: "clamp(28px, 3vw, 40px)", fontSize: "clamp(16px, 1.3vw, 19px)", color: "var(--ink-2)", lineHeight: 1.55 }}>
          Pay one month upfront now. When Onmatch goes live, you get twelve months at the founder rate for your tier — and your first month is on us. After founder year ends, you stay at month-to-month with no price increase forced on you.{" "}
          <span style={{ color: "var(--ink-3)" }}>Don&apos;t pay now? You&apos;ll pay the standard rate when we launch.</span>
        </p>

        {/* Pre-sale mechanic */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 1, marginBottom: "clamp(40px, 5vw, 56px)", background: "var(--rule)", border: "1px solid var(--rule-2)", borderRadius: 12, overflow: "hidden" }}>
          {PRE_SALE_BEATS.map((b) => (
            <div key={b.n} style={{ background: "var(--bg-2)", padding: "clamp(20px, 2vw, 28px)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", fontWeight: 600 }}>{b.n}</div>
                <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.06em" }}>{b.timing}</div>
              </div>
              <h3 style={{ fontSize: "clamp(16px, 1.3vw, 19px)", fontWeight: 500, color: "var(--ink)", letterSpacing: "-0.015em", lineHeight: 1.2 }}>{b.t}</h3>
              <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>{b.d}</p>
            </div>
          ))}
        </div>

        {/* Three tiers */}
        <TierCards />

        {/* Roadmap */}
        <RoadmapBlock />

        {/* Comparison */}
        <ComparisonBlock />
      </div>
    </section>
  );
}


function TierCards() {
  const [openTier, setOpenTier] = useState<string | null>(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(12px, 1.4vw, 20px)" }}>
      {TIERS.map((tier) => (
        <div key={tier.id} className="panel" style={{ padding: "clamp(28px, 2.6vw, 40px)", display: "flex", flexDirection: "column", gap: 18, position: "relative", overflow: "visible", border: tier.emphasized ? "1.5px solid var(--accent)" : "1px solid var(--rule)", boxShadow: tier.emphasized ? "0 0 0 4px var(--accent-dim)" : "none", background: tier.softLaunch ? "var(--bg)" : "var(--bg-2)", opacity: tier.softLaunch ? 0.94 : 1 }}>
          {tier.badge && (
            <div style={{ position: "absolute", top: -10, left: tier.emphasized ? "50%" : 16, transform: tier.emphasized ? "translateX(-50%)" : "none", padding: "5px 10px", background: tier.emphasized ? "var(--accent)" : "var(--bg-3)", color: tier.emphasized ? "var(--accent-ink)" : "var(--ink-2)", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", fontWeight: 600, borderRadius: 6, border: tier.emphasized ? "1px solid var(--accent)" : "1px solid var(--rule-2)", whiteSpace: "nowrap" }}>
              {tier.badge}
            </div>
          )}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
              <div style={{ fontSize: "clamp(20px, 1.8vw, 26px)", fontWeight: 500, letterSpacing: "-0.025em", color: "var(--ink)" }}>{tier.name}</div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Founder rate</div>
            </div>
            <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)", letterSpacing: "0.04em", lineHeight: 1.5 }}>{tier.role}</div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, lineHeight: 0.9, marginBottom: 8 }}>
              <span style={{ fontSize: "clamp(18px, 1.8vw, 24px)", color: "var(--ink-3)", fontWeight: 400 }}>$</span>
              <span style={{ fontSize: "clamp(52px, 5.5vw, 76px)", fontWeight: 500, letterSpacing: "-0.04em", color: tier.emphasized ? "var(--accent)" : "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{tier.rate}</span>
              <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)", marginLeft: 6, alignSelf: "center" }}>/ mo founder</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-4)" }}>
              <span style={{ textDecoration: "line-through", textDecorationColor: "var(--ink-4)", fontVariantNumeric: "tabular-nums" }}>${tier.standard}/mo</span>
              <span style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>standard at launch</span>
            </div>
          </div>
          {openTier === tier.id ? (
            <div style={{ position: "relative" }}>
              <EmailField
                source={`pricing_${tier.id}` as "pricing_starter" | "pricing_operator" | "pricing_scale"}
                tier={tier.id}
                label={tier.cta}
              />
            </div>
          ) : (
            <button
              className={tier.emphasized ? "btn" : "btn btn-ghost"}
              style={{ justifyContent: "center", width: "100%", textAlign: "center" }}
              onClick={() => setOpenTier(tier.id)}
            >
              {tier.cta} <Arrow size={12} />
            </button>
          )}
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8, fontSize: 13.5, color: "var(--ink-2)" }}>
            {tier.features.map((f, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "16px 1fr", gap: 8, alignItems: "baseline" }}>
                <span style={{ color: tier.softLaunch ? "var(--ink-4)" : "var(--accent)", fontFamily: "var(--mono)", fontSize: 11 }}>+</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--rule)", fontSize: 12, color: "var(--ink-4)", lineHeight: 1.5, fontStyle: "italic" }}>{tier.note}</div>
        </div>
      ))}
    </div>
  );
}

function RoadmapBlock() {
  return (
    <div style={{ marginTop: "clamp(40px, 5vw, 56px)", padding: "clamp(28px, 3vw, 40px)", border: "1px solid var(--rule-2)", borderRadius: 14, background: "var(--bg-2)", display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.3fr)", gap: "clamp(20px, 3vw, 48px)", alignItems: "start" }}>
      <div>
        <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 14 }}>ROADMAP</div>
        <h3 style={{ fontSize: "clamp(22px, 2.2vw, 32px)", fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--ink)", maxWidth: "18ch" }}>Where Onmatch is going.</h3>
      </div>
      <p style={{ fontSize: "clamp(15px, 1.2vw, 17px)", color: "var(--ink-2)", lineHeight: 1.6, maxWidth: "58ch" }}>
        Starter and Operator ship first. <span style={{ color: "var(--ink)" }}>Scale extends Onmatch into multi-team and multi-brand environments</span> — advanced autonomy controls, outcome attribution reporting, role-based access. Locking the Scale founder rate now reserves the price; the features ship after Onmatch&apos;s core is in market and pressure-tested.
      </p>
    </div>
  );
}

function ComparisonBlock() {
  return (
    <div style={{ marginTop: "clamp(48px, 6vw, 80px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Operator tier · vs how marketing engineering is currently bought</div>
        <span style={{ flex: 1, height: 1, background: "var(--rule)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {COMPARISON_ROWS.map((row, i) => {
          const isUs = i === COMPARISON_ROWS.length - 1;
          return (
            <div key={row[0]} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 8, padding: "18px 20px", borderRadius: 10, background: isUs ? "var(--accent-dim)" : "var(--bg-2)", border: "1px solid " + (isUs ? "rgba(200,255,58,.32)" : "var(--rule)"), minHeight: 120 }}>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: isUs ? 500 : 400, color: isUs ? "var(--ink)" : "var(--ink-2)", marginBottom: 4 }}>{row[0]}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-4)", lineHeight: 1.45 }}>{row[2]}</div>
              </div>
              <div className="mono" style={{ fontSize: isUs ? 15 : 13.5, color: isUs ? "var(--accent)" : "var(--ink-3)", fontVariantNumeric: "tabular-nums", fontWeight: isUs ? 600 : 400 }}>{row[1]}</div>
            </div>
          );
        })}
      </div>
      <p style={{ marginTop: 18, fontSize: 13, color: "var(--ink-4)", lineHeight: 1.55, maxWidth: "66ch" }}>
        Running outbound alone or just starting? <span style={{ color: "var(--ink-3)" }}>The $59 Starter rate covers what most solo operators need.</span> Need to expand your contact base? Connect your Findymail / Apollo / Clay account and pay them directly for data — Onmatch doesn&apos;t take a cut.
      </p>
    </div>
  );
}