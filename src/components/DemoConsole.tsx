"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Arrow from "./Arrow";
import Eyebrow from "./Eyebrow";

// ── Types ─────────────────────────────────────────────────────────
interface FlowEmail {
  t: string;
  s: string;
  note: string;
  branch?: string;
}

interface HistoryMatch {
  date: string;
  name: string;
  size: number;
  metrics: Record<string, string>;
  match: number;
  similarOn: string[];
  diff: string;
}

interface FlowPreset {
  keys: string[];
  summary: string;
  audience: {
    title: string;
    filters: [string, string][];
    count: number;
    accuracy: number;
  };
  flow: {
    title: string;
    reference: string;
    tool: string;
    history: HistoryMatch[];
    emails: FlowEmail[];
  };
}

interface CampaignOption {
  id: string;
  kind: string;
  label: string;
  summary: string;
  hint: string;
}

interface EmailGroup {
  t: string;
  items: FlowEmail[];
}

// ── Data ──────────────────────────────────────────────────────────
const FLOW_PRESETS: FlowPreset[] = [
  {
    keys: ["churn", "annual", "win back"],
    summary: "Win back churned annual customers",
    audience: {
      title: "Churned · annual plans",
      filters: [["stage", "churned"], ["plan_tier", "= annual"], ["last_billing", "> 30d"], ["mrr_at_churn", "> $200"]],
      count: 1847,
      accuracy: 94,
    },
    flow: {
      title: "Win-back · 5 emails over 14 days",
      reference: "Nov 09 winback win · 52% open · 11% reactivated",
      tool: "HubSpot · workflow #winback-annual",
      history: [
        { date: "NOV 09", name: "Annual cohort save sequence", size: 1340, metrics: { open: "52%", reply: "14%", reactivated: "11.2%" }, match: 91, similarOn: ["stage=churned", "plan_tier=annual", "mrr band", "tenure > 12mo"], diff: "Smaller cohort (1,340 vs 1,847)" },
        { date: "MAR 22", name: "High-MRR churn rescue", size: 620, metrics: { open: "48%", reply: "11%", reactivated: "9.4%" }, match: 78, similarOn: ["stage=churned", "mrr_at_churn > $200", "plan_tier=annual"], diff: "Tighter MRR floor ($500+) — read as optimistic upper bound" },
        { date: "JUL 17", name: "Q2 cancellation save", size: 2100, metrics: { open: "39%", reply: "8%", reactivated: "5.6%" }, match: 62, similarOn: ["stage=churned", "mrr band overlap"], diff: "Mixed monthly + annual · weaker fit on plan tier" },
      ],
      emails: [
        { t: "T+0", s: "See what's changed since you left", note: "re-entry · product evolution" },
        { t: "T+3", s: "The features bringing customers back", note: "social proof · feature-led" },
        { t: "T+7", s: "A plan that matches what you actually use", note: "price-driven · right-size", branch: "a" },
        { t: "T+7", s: "What they still can't do", note: "competitor-driven · differentiation", branch: "b" },
        { t: "T+14", s: "Your data's still here. Pick up where you left off", note: "final · low-friction restart" },
      ],
    },
  },
  {
    keys: ["dormant", "trial", "saas"],
    summary: "Re-engage dormant trials, B2B SaaS",
    audience: {
      title: "Dormant · trial users",
      filters: [["stage", "trial_users"], ["last_login", "> 45d"], ["plan", "= free"], ["fit_score", "≥ 0.65"]],
      count: 2847,
      accuracy: 92,
    },
    flow: {
      title: "Dormant trials · 5 emails over 14 days",
      reference: "Feb 14 dormant-trial win · 47% open · 8% converted",
      tool: "HubSpot · workflow #dormant-re2",
      history: [
        { date: "FEB 14", name: "Dormant trial users · Q1", size: 2140, metrics: { open: "47%", reply: "12%", converted: "8.2%" }, match: 93, similarOn: ["stage=trial_users", "last_login > 45d", "plan=free", "fit_score ≥ 0.6"], diff: "Smaller geo (US only vs your global)" },
        { date: "APR 22", name: "Free → paid activation push", size: 1680, metrics: { open: "41%", reply: "9%", converted: "5.4%" }, match: 78, similarOn: ["plan=free", "fit_score range", "stalled at activation"], diff: "Shorter sequence (3 emails vs 5)" },
        { date: "AUG 03", name: "Cold trial wake-up", size: 940, metrics: { open: "34%", reply: "6%", converted: "3.1%" }, match: 64, similarOn: ["stage=trial_users", "last_login > 60d"], diff: "Older trials (60d+) — read as lower bound" },
      ],
      emails: [
        { t: "T+0", s: "Still thinking about it?", note: "soft re-entry · no pitch" },
        { t: "T+2", s: "The setup most people miss", note: "activation · feature-led" },
        { t: "T+4", s: "Extend your trial — 20% off if you start now", note: "price-hesitant · time-bound", branch: "a" },
        { t: "T+4", s: "What you haven't tried yet", note: "value-gap · feature surface", branch: "b" },
        { t: "T+14", s: "Your trial workspace expires soon", note: "final · loss-aversion" },
      ],
    },
  },
  {
    keys: ["cart", "recovery", "dtc", "skincare", "supplements", "e-com", "ecom"],
    summary: "Cart-recovery for DTC skincare",
    audience: {
      title: "Abandoned cart · skincare",
      filters: [["event", "cart_abandoned"], ["cart_value", "> $40"], ["product_category", "= skincare"], ["email_subscribed", "= true"]],
      count: 3680,
      accuracy: 95,
    },
    flow: {
      title: "Cart-recovery · 5 emails over 6 days",
      reference: "Apr 02 skincare-cart win · 41% open · 19% recovered",
      tool: "Customer.io · campaign #cart-skincare",
      history: [
        { date: "APR 02", name: "Skincare cart recovery · spring", size: 4200, metrics: { open: "41%", clicked: "18%", recovered: "19.4%" }, match: 92, similarOn: ["product_category=skincare", "cart_value > $40", "event=cart_abandoned"], diff: "Larger AOV in spring set ($68 vs $52)" },
        { date: "JAN 19", name: "Holiday skincare push", size: 6100, metrics: { open: "49%", clicked: "24%", recovered: "26.0%" }, match: 74, similarOn: ["product_category=skincare", "cart_value > $40"], diff: "Seasonal lift baked in — expect lower without holiday" },
        { date: "OCT 11", name: "Replenishment · existing buyers", size: 1800, metrics: { open: "38%", clicked: "13%", recovered: "14.2%" }, match: 58, similarOn: ["product_category=skincare", "cart-stage overlap"], diff: "Repeat buyers (not new abandons) — weaker overlap" },
      ],
      emails: [
        { t: "T+0", s: "Your skin's been waiting", note: "soft reminder · no discount yet" },
        { t: "T+1", s: "Made for your skin type, not everyone", note: "suitability · fit-based" },
        { t: "T+3", s: "We held your bag. Shipping's on us", note: "price-sensitive · soft offer", branch: "a" },
        { t: "T+3", s: "Real before-and-afters", note: "suitability doubt · proof", branch: "b" },
        { t: "T+6", s: "Before we put these back", note: "final · scarcity close" },
      ],
    },
  },
  {
    keys: ["founder", "seed", "nyc", "sf", "e-com"],
    summary: "Seed-stage founders, NYC + SF + remote",
    audience: {
      title: "Seed-stage founders · US",
      filters: [["role", "founder"], ["stage", "= seed"], ["geo", "NYC | SF | remote_US"], ["team_size", "< 12"]],
      count: 3420,
      accuracy: 91,
    },
    flow: {
      title: "Founder outreach · 4 emails over 9 days",
      reference: "Mar 22 founder cohort · 31% reply · 9% booked",
      tool: "Customer.io · campaign #marlowe-7",
      history: [
        { date: "MAR 22", name: "Founder cohort · spring", size: 2840, metrics: { open: "54%", replied: "31%", booked: "9.1%" }, match: 92, similarOn: ["role=founder", "stage=seed", "geo: NYC|SF|remote", "team < 12"], diff: "Slightly larger team ceiling (15 vs 12)" },
        { date: "SEP 04", name: "Pre-seed founder intro", size: 1120, metrics: { open: "49%", replied: "27%", booked: "7.4%" }, match: 78, similarOn: ["role=founder", "small team", "warm-intro origin"], diff: "Earlier-stage — longer sales cycle" },
        { date: "JUN 17", name: "YC alum re-outreach", size: 480, metrics: { open: "61%", replied: "38%", booked: "13.2%" }, match: 65, similarOn: ["role=founder", "US tech hub"], diff: "Existing relationship · expect lower cold-reply rate" },
      ],
      emails: [
        { t: "T+0", s: "one operator to another", note: "plain intro · no pitch" },
        { t: "T+3", s: "how 3 seed-stage teams use it", note: "social proof" },
        { t: "T+6", s: "worth 20 mins this week?", note: "booking ask", branch: "a" },
        { t: "T+6", s: "or a 90-second loom?", note: "low-friction", branch: "b" },
      ],
    },
  },
];

const DEMO_CAMPAIGN_OPTIONS: CampaignOption[] = [
  { id: "churn", kind: "B2B SaaS · WIN-BACK", label: "Win back churned annual customers", summary: "Win back churned annual customers", hint: "~1,800 contacts · 5 emails · 14 days" },
  { id: "dormant", kind: "B2B SaaS · RE-ENGAGEMENT", label: "Re-engage dormant trials", summary: "Re-engage dormant trials, B2B SaaS", hint: "~2,800 contacts · 5 emails · 14 days" },
  { id: "cart", kind: "DTC · CART-RECOVERY", label: "Cart-recovery for DTC skincare", summary: "Cart-recovery, DTC skincare", hint: "~3,700 contacts · 5 emails · 6 days" },
];

function pickPreset(input: string): FlowPreset {
  const t = (input || "").toLowerCase();
  return FLOW_PRESETS.find((p) => p.keys.some((k) => t.includes(k))) || FLOW_PRESETS[0];
}

// ── FlowCard ──────────────────────────────────────────────────────
function FlowCard({ e, compact = false }: { e: FlowEmail; compact?: boolean }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: compact ? "minmax(0, 1fr)" : "52px minmax(0, 1fr) auto",
      gap: compact ? 4 : 12,
      padding: compact ? "10px 12px" : "10px 14px",
      border: "1px solid var(--rule)", borderRadius: 8, background: "var(--bg-2)",
    }}>
      {compact ? (
        <>
          <div className="mono" style={{ fontSize: 10.5, color: "var(--accent)", letterSpacing: "0.06em", fontWeight: 600 }}>
            {e.t}{e.branch ? ` · BRANCH ${e.branch.toUpperCase()}` : ""}
          </div>
          <div style={{ fontSize: 13.5, color: "var(--ink)" }}>&quot;{e.s}&quot;</div>
          <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{e.note}</div>
        </>
      ) : (
        <>
          <span className="mono" style={{ fontSize: 12, color: "var(--accent)", letterSpacing: "0.04em", alignSelf: "center", fontWeight: 500 }}>{e.t}</span>
          <span style={{ fontSize: 14.5, color: "var(--ink)", alignSelf: "center" }}>&quot;{e.s}&quot;</span>
          <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.05em", textTransform: "uppercase", alignSelf: "center" }}>{e.note}</span>
        </>
      )}
    </div>
  );
}

// ── DemoConsole ────────────────────────────────────────────────────
export default function DemoConsole() {
  const [input, setInput] = useState("");
  const [preset, setPreset] = useState<FlowPreset | null>(null);
  const [filtersShown, setFiltersShown] = useState(0);
  const [count, setCount] = useState(0);
  const [emailsShown, setEmailsShown] = useState(0);
  const [drafting, setDrafting] = useState(false);
  const [historyShown, setHistoryShown] = useState(0);
  const [ready, setReady] = useState(false);
  const [finalState, setFinalState] = useState<"pushed" | "rejected" | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cancelTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => cancelTimers, [cancelTimers]);

  const reset = () => {
    cancelTimers();
    setInput("");
    setPreset(null);
    setFiltersShown(0);
    setCount(0);
    setEmailsShown(0);
    setHistoryShown(0);
    setDrafting(false);
    setReady(false);
    setFinalState(null);
  };

  const queue = (delay: number, fn: () => void) => {
    timersRef.current.push(setTimeout(fn, delay));
  };

  const run = (text: string) => {
    cancelTimers();
    setFiltersShown(0); setCount(0); setEmailsShown(0); setHistoryShown(0);
    setDrafting(false); setReady(false); setFinalState(null);

    const p = pickPreset(text);
    setPreset(p);
    setInput(text || p.summary);

    p.audience.filters.forEach((_, i) => queue(220 + i * 320, () => setFiltersShown(i + 1)));

    const countStart = 220 + p.audience.filters.length * 320 + 220;
    const ticks = 18, tickMs = 38;
    for (let i = 1; i <= ticks; i++) {
      queue(countStart + i * tickMs, () => {
        const eased = 1 - Math.pow(1 - i / ticks, 3);
        setCount(Math.floor(p.audience.count * eased));
      });
    }
    queue(countStart + ticks * tickMs + 80, () => { setCount(p.audience.count); setDrafting(true); });

    const draftStart = countStart + ticks * tickMs + 480;
    p.flow.emails.forEach((_, i) => queue(draftStart + i * 380, () => setEmailsShown(i + 1)));

    const histStart = draftStart + p.flow.emails.length * 380 + 320;
    p.flow.history.forEach((_, i) => queue(histStart + i * 360, () => setHistoryShown(i + 1)));

    queue(histStart + p.flow.history.length * 360 + 280, () => setReady(true));
  };

  const hasOutput = preset !== null;

  const grouped: EmailGroup[] = (() => {
    if (!preset) return [];
    const groups: EmailGroup[] = [];
    const map = new Map<string, EmailGroup>();
    preset.flow.emails.slice(0, emailsShown).forEach((e) => {
      if (!map.has(e.t)) { const g: EmailGroup = { t: e.t, items: [] }; map.set(e.t, g); groups.push(g); }
      map.get(e.t)!.items.push(e);
    });
    return groups;
  })();

  const totalGroups = preset ? new Set(preset.flow.emails.map((e) => e.t)).size : 0;

  return (
    <section id="demo">
      <div className="wrap">
        <div className="section-head">
          <Eyebrow num="§ 02">TRY IT</Eyebrow>
          <div className="rule" />
          <div className="eyebrow hide-sm" style={{ color: "var(--ink-4)" }}>SIMULATED · NO ACCOUNT NEEDED</div>
        </div>

        <h2 style={{ maxWidth: "24ch", marginBottom: "clamp(32px, 4vw, 48px)", color: "var(--ink)" }}>
          Select a campaign idea. <span style={{ color: "var(--ink-3)" }}>Watch the flow build itself.</span>
        </h2>

        <div className="panel" style={{ overflow: "hidden" }}>
          {/* Header */}
          <div className="panel-hd">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <span className="pip pulse" /> ONMATCH · CAMPAIGN BUILDER
            </span>
            <span style={{ color: "var(--ink-4)" }}>
              {!hasOutput && "simulated · v0.1"}
              {hasOutput && !drafting && "sourcing audience…"}
              {drafting && emailsShown < (preset?.flow.emails.length || 0) && "drafting flow…"}
              {drafting && emailsShown === (preset?.flow.emails.length || 0) && !ready && "matching history…"}
              {ready && !finalState && "awaiting review"}
              {finalState === "pushed" && "pushed → live"}
              {finalState === "rejected" && "rejected · learned"}
            </span>
          </div>

          {/* Campaign selector */}
          {!hasOutput && (
            <div style={{ padding: "20px 20px 22px", borderBottom: "1px solid var(--rule)" }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>{">"}</span>
                <span>Select a campaign to build</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                {DEMO_CAMPAIGN_OPTIONS.map((opt) => (
                  <button key={opt.id} type="button" onClick={() => run(opt.summary)}
                    style={{ textAlign: "left", padding: "16px 16px 14px", border: "1px solid var(--rule-2)", borderRadius: 10, background: "var(--bg)", color: "var(--ink)", cursor: "pointer", transition: "all .15s ease", display: "flex", flexDirection: "column", gap: 8, fontFamily: "var(--sans)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--bg-2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--rule-2)"; e.currentTarget.style.background = "var(--bg)"; }}>
                    <div className="mono" style={{ fontSize: 10.5, color: "var(--accent)", letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase" }}>{opt.kind}</div>
                    <div style={{ fontSize: 14.5, color: "var(--ink)", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{opt.label}</div>
                    <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.04em", lineHeight: 1.45, marginTop: 2 }}>{opt.hint}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reset bar */}
          {hasOutput && (
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--rule)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontFamily: "var(--mono)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>{">"}</span>
                <span style={{ color: "var(--ink)" }}>{preset.summary}</span>
              </div>
              <button className="btn btn-ghost btn-sm" type="button" onClick={reset}>New campaign</button>
            </div>
          )}

          {/* OUTPUT: audience + flow */}
          {hasOutput && <DemoOutput preset={preset} filtersShown={filtersShown} count={count} drafting={drafting} emailsShown={emailsShown} historyShown={historyShown} ready={ready} finalState={finalState} setFinalState={setFinalState} reset={reset} grouped={grouped} totalGroups={totalGroups} />}
        </div>

        <p className="mono" style={{ marginTop: 18, fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center" }}>
          Simulated · real campaigns take 2–6 minutes end-to-end
        </p>
      </div>
    </section>
  );
}

// ── DemoOutput sub-component ──────────────────────────────────────
interface DemoOutputProps {
  preset: FlowPreset;
  filtersShown: number;
  count: number;
  drafting: boolean;
  emailsShown: number;
  historyShown: number;
  ready: boolean;
  finalState: "pushed" | "rejected" | null;
  setFinalState: (s: "pushed" | "rejected") => void;
  reset: () => void;
  grouped: EmailGroup[];
  totalGroups: number;
}

function DemoOutput({ preset, filtersShown, count, drafting, emailsShown, historyShown, ready, finalState, setFinalState, reset, grouped, totalGroups }: DemoOutputProps) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 1.15fr)" }}>
        {/* Audience panel */}
        <div style={{ padding: "22px 24px", borderRight: "1px solid var(--rule)", display: "flex", flexDirection: "column", gap: 14, minHeight: 440 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", fontWeight: 600 }}>STEP 1 · AUDIENCE</div>
            <div className="mono" style={{ fontSize: 11, color: drafting ? "var(--accent)" : "var(--ink-4)", letterSpacing: "0.04em", fontWeight: 500 }}>
              {drafting ? "✓ READY" : "SOURCING…"}
            </div>
          </div>
          <div style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.3, fontWeight: 500 }}>{preset.audience.title}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {preset.audience.filters.map((f, i) => {
              const visible = i < filtersShown;
              return (
                <div key={i} className={visible ? "stream-row" : ""} style={{
                  display: "grid", gridTemplateColumns: "22px minmax(0, 1fr) auto", gap: 10,
                  padding: "9px 12px", borderRadius: 6,
                  background: visible ? "var(--bg)" : "transparent",
                  border: "1px solid " + (visible ? "var(--rule)" : "transparent"),
                  opacity: visible ? 1 : 0.2,
                  transition: "opacity .3s ease",
                  fontFamily: "var(--mono)", fontSize: 12.5,
                }}>
                  <span style={{ color: visible ? "var(--accent)" : "var(--ink-4)", fontWeight: 600 }}>{visible ? "✓" : "○"}</span>
                  <span style={{ color: "var(--ink-3)" }}>{f[0]}</span>
                  <span style={{ color: "var(--ink)", textAlign: "right" }}>{f[1]}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--rule)" }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>matched contacts</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, fontFamily: "var(--mono)" }}>
              <span style={{ fontSize: 34, fontWeight: 500, color: count > 0 && count === preset.audience.count ? "var(--accent)" : "var(--ink)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", lineHeight: 1 }}>
                {count.toLocaleString()}
              </span>
              {count >= preset.audience.count ? (
                <span style={{ fontSize: 12, color: "var(--ink-4)" }}>· acc. {preset.audience.accuracy}%</span>
              ) : (
                <span className="caret" />
              )}
            </div>
          </div>
        </div>

        {/* Flow panel */}
        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14, background: "var(--bg)", minHeight: 440 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", fontWeight: 600 }}>STEP 2 · FLOW</div>
            <div className="mono" style={{ fontSize: 11, color: ready ? "var(--accent)" : drafting ? "var(--info)" : "var(--ink-4)", letterSpacing: "0.04em", fontWeight: 500 }}>
              {!drafting && "WAITING…"}
              {drafting && emailsShown < preset.flow.emails.length && `DRAFTING ${grouped.length}/${totalGroups}…`}
              {drafting && emailsShown === preset.flow.emails.length && "✓ DRAFTED"}
            </div>
          </div>
          <div style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.3, fontWeight: 500 }}>
            {drafting ? preset.flow.title : <span style={{ color: "var(--ink-4)", fontWeight: 400 }}>waiting on audience…</span>}
          </div>

          <div style={{ position: "relative", paddingLeft: drafting ? 16 : 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {drafting && grouped.length > 0 && (
              <div aria-hidden="true" style={{ position: "absolute", left: 5, top: 12, bottom: 12, width: 1.5, background: "linear-gradient(to bottom, var(--accent), var(--rule-2))" }} />
            )}
            {grouped.map((group, gi) => {
              const isBranch = group.items.length > 1;
              return (
                <div key={gi} className="stream-row" style={{ position: "relative" }}>
                  <span aria-hidden="true" style={{ position: "absolute", left: -15, top: 14, width: 11, height: 11, borderRadius: "50%", background: "var(--bg)", border: "2px solid var(--accent)", zIndex: 1, boxShadow: "0 0 0 3px var(--bg)" }} />
                  {isBranch ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginLeft: 6 }}>
                      {group.items.map((e, ei) => <FlowCard key={ei} e={e} compact />)}
                    </div>
                  ) : (
                    <div style={{ marginLeft: 6 }}><FlowCard e={group.items[0]} /></div>
                  )}
                </div>
              );
            })}
            {drafting && emailsShown < preset.flow.emails.length && (
              <div className="mono" style={{ fontSize: 12, color: "var(--ink-4)", marginLeft: 16, marginTop: 4 }}>
                drafting next email<span className="caret" />
              </div>
            )}
          </div>

          {emailsShown === preset.flow.emails.length && (
            <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--rule)", fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--ink-4)", lineHeight: 1.7 }}>
              <div><span style={{ color: "var(--ink-3)" }}>pushes to:</span> <span style={{ color: "var(--ink-2)" }}>{preset.flow.tool}</span></div>
            </div>
          )}
        </div>
      </div>

      {/* STEP 3 · Historical context */}
      {emailsShown === preset.flow.emails.length && (
        <HistoryPanel preset={preset} historyShown={historyShown} ready={ready} />
      )}

      {/* Action bar */}
      {ready && (
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--rule)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", background: finalState ? "var(--bg-2)" : "var(--accent-dim)" }}>
          <div className="mono" style={{ fontSize: 12, color: finalState === "rejected" ? "var(--ink-3)" : "var(--accent)", letterSpacing: "0.05em", fontWeight: 600 }}>
            {!finalState && "READY"}
            {finalState === "pushed" && "✓ PUSHED"}
            {finalState === "rejected" && "✗ REJECTED"}
          </div>
          <div style={{ flex: 1, fontSize: 14, color: "var(--ink)", minWidth: 200 }}>
            {!finalState && `Flow drafted in 3.4s · ${preset.audience.count.toLocaleString()} contacts queued · translate to ${preset.flow.tool.split(" · ")[0]}?`}
            {finalState === "pushed" && `Live in ${preset.flow.tool}. Reply tracking on. Onmatch is watching results.`}
            {finalState === "rejected" && "Onmatch will learn from this. Try another campaign."}
          </div>
          {!finalState && (
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm" type="button" onClick={() => setFinalState("rejected")}>Reject</button>
              <button className="btn btn-sm" type="button" onClick={() => setFinalState("pushed")}>Approve &amp; push <Arrow size={12} /></button>
            </div>
          )}
          {finalState && <button className="btn btn-ghost btn-sm" type="button" onClick={reset}>New campaign</button>}
        </div>
      )}
    </>
  );
}


// ── HistoryPanel sub-component ────────────────────────────────────
function HistoryPanel({ preset, historyShown, ready }: { preset: FlowPreset; historyShown: number; ready: boolean }) {
  return (
    <div style={{ borderTop: "1px solid var(--rule)", padding: "22px 24px", background: "var(--bg-2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", fontWeight: 600 }}>STEP 3 · HISTORICAL CONTEXT</div>
        <div className="mono" style={{ fontSize: 11, color: ready ? "var(--accent)" : "var(--info)", letterSpacing: "0.04em", fontWeight: 500 }}>
          {ready ? `✓ MATCHED ${preset.flow.history.length} FROM YOUR HISTORY` : `MATCHING ${historyShown}/${preset.flow.history.length}…`}
        </div>
      </div>
      <div style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 16, maxWidth: "68ch", lineHeight: 1.5 }}>
        How your past flows targeting similar audiences performed. Pulled from your connected tool.
        Similarity scored on real dimensions — never against generic benchmarks.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        {preset.flow.history.map((h, i) => {
          const visible = i < historyShown;
          return (
            <div key={i} className={visible ? "stream-row" : ""} style={{ opacity: visible ? 1 : 0.18, transition: "opacity .3s ease", border: "1px solid var(--rule)", borderRadius: 10, background: "var(--bg)", overflow: "hidden", position: "relative" }}>
              <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: h.match >= 85 ? "var(--accent)" : h.match >= 70 ? "var(--info)" : "var(--ink-4)" }} />
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--rule)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.06em" }}>
                    {h.date} <span style={{ color: "var(--ink-4)" }}>·</span> {h.size.toLocaleString()} contacts
                  </div>
                  <div className="mono" style={{ fontSize: 11.5, color: h.match >= 85 ? "var(--accent)" : h.match >= 70 ? "var(--info)" : "var(--ink-3)", fontWeight: 600, letterSpacing: "0.04em", padding: "2px 7px", borderRadius: 4, background: h.match >= 85 ? "var(--accent-dim)" : h.match >= 70 ? "rgba(122,217,255,.14)" : "var(--bg-3)" }}>
                    {h.match}% MATCH
                  </div>
                </div>
                <div style={{ fontSize: 14.5, color: "var(--ink)", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{h.name}</div>
              </div>
              <div style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: `repeat(${Object.keys(h.metrics).length}, minmax(0, 1fr))`, gap: 12, borderBottom: "1px solid var(--rule)" }}>
                {Object.entries(h.metrics).map(([k, v]) => (
                  <div key={k}>
                    <div className="mono" style={{ fontSize: "clamp(18px, 1.8vw, 22px)", fontWeight: 500, color: "var(--ink)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em", lineHeight: 1 }}>{v}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>{k}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "12px 16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>matched on</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {h.similarOn.map((s, si) => (
                      <span key={si} className="mono" style={{ fontSize: 10.5, color: "var(--ink-2)", padding: "2px 7px", borderRadius: 4, background: "var(--bg-3)", border: "1px solid var(--rule)", letterSpacing: "0.02em", whiteSpace: "nowrap" }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>differs</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.45 }}>{h.diff}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}