"use client";

import { useState, useEffect, useRef } from "react";
import EmailField from "./EmailField";

// ── Log data ──────────────────────────────────────────────────────
interface LogLine {
  kind: string;
  tag: string;
  body: string;
  who: string;
}

interface LogRow extends LogLine {
  _id: number;
  _ts: Date;
}

const LOG_LINES: LogLine[] = [
  { kind: "scored", tag: "SCORED", body: "2,847 contacts from CRM · matched \"Q3 dormant\" segment", who: "@orchard.so" },
  { kind: "drafted", tag: "DRAFTED", body: "6-email re-engagement flow · grounded in 3 past flows", who: "@orchard.so" },
  { kind: "approved", tag: "BUILT", body: "built in HubSpot · workflow #ridge-7 · ready for send", who: "@orchard.so" },
  { kind: "sourced", tag: "SOURCED", body: "1,400 contacts via Findymail · DTC supplements ICP", who: "@cleanco" },
  { kind: "drafted", tag: "DRAFTED", body: "cart-recovery flow · voice match 0.94", who: "@cleanco" },
  { kind: "voice", tag: "VOICE", body: "model updated · 47 sends + 12 edits this week", who: "system" },
  { kind: "learned", tag: "LEARNED", body: "May 8 win pattern → applied to similar campaigns", who: "system" },
  { kind: "approved", tag: "BUILT", body: "built in Customer.io · campaign #marlowe-7 · ready", who: "@stratus" },
  { kind: "library", tag: "LIBRARY", body: "past flow surfaced · \"founder outreach Q1\"", who: "@hatch" },
  { kind: "replied", tag: "REPLY", body: "\"we're in.\" → routed to your inbox", who: "@hatch" },
];

const LOG_COLOR: Record<string, string> = {
  scored: "var(--accent)",
  sourced: "var(--accent)",
  drafted: "var(--info)",
  approved: "var(--accent)",
  voice: "#ff75e6",
  library: "#ff75e6",
  learned: "#9fb3ff",
  replied: "var(--warn)",
};

// ── OperatorLog ───────────────────────────────────────────────────
function OperatorLog() {
  const [rows, setRows] = useState<LogRow[]>(() =>
    LOG_LINES.slice(0, 5).map((l, i) => ({ ...l, _id: i, _ts: new Date() }))
  );
  const cursorRef = useRef(5);

  useEffect(() => {
    const t = setInterval(() => {
      const i = cursorRef.current % LOG_LINES.length;
      cursorRef.current = i + 1;
      const newRow: LogRow = { ...LOG_LINES[i], _id: Date.now() + Math.random(), _ts: new Date() };
      setRows((rs) => [newRow, ...rs].slice(0, 7));
    }, 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="panel" style={{ overflow: "hidden" }}>
      <div className="panel-hd">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span className="pip pulse" /> LIVE OPERATOR LOG
        </span>
        <span style={{ color: "var(--ink-4)" }}>tail -f operator.log</span>
      </div>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 12.5,
          lineHeight: 1.6,
          padding: "4px 0",
          maskImage: "linear-gradient(to bottom, #000 70%, transparent 100%)",
        }}
      >
        {rows.map((r, idx) => (
          <div
            key={r._id}
            className="stream-row"
            style={{
              display: "grid",
              gridTemplateColumns: "74px 110px minmax(0, 1fr) 110px",
              gap: 14,
              padding: "9px 18px",
              borderBottom: idx === rows.length - 1 ? "0" : "1px solid var(--rule)",
              alignItems: "baseline",
              opacity: 1 - idx * 0.08,
            }}
          >
            <span style={{ color: "var(--ink-4)", letterSpacing: "0.04em" }}>
              {r._ts.toLocaleTimeString("en-GB", { hour12: false })}
            </span>
            <span style={{ color: LOG_COLOR[r.kind] || "var(--accent)", fontWeight: 500, letterSpacing: "0.06em" }}>
              {r.tag}
            </span>
            <span style={{ color: "var(--ink-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.body}
            </span>
            <span style={{ color: "var(--ink-4)", textAlign: "right", letterSpacing: "0.02em" }}>{r.who}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section id="top" style={{ paddingTop: "clamp(72px, 10vw, 120px)", paddingBottom: "clamp(56px, 8vw, 96px)" }}>
      <div className="wrap">
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "clamp(40px, 5vw, 64px)" }}>
          <div className="eyebrow">
            <span className="dot pulse" />
            <span className="num" style={{ color: "var(--accent)" }}>MARKETING ENGINEERING FOR OUTBOUND</span>
          </div>
          <span style={{ flex: 1, height: 1, background: "var(--rule)" }} />
          <div className="eyebrow hide-sm" style={{ color: "var(--ink-4)" }}>
            SELECTIVE RELEASE · FOUNDER COHORT
          </div>
        </div>

        <h1 style={{
          fontSize: "clamp(44px, 6.4vw, 96px)", letterSpacing: "-0.04em",
          lineHeight: 0.98, fontWeight: 500, color: "var(--ink)", maxWidth: "18ch",
        }}>
          Outbound, enabled by a system that{" "}
          <span style={{ color: "var(--accent)" }}>learns your business.</span>
          <span className="caret" />
        </h1>

        <div style={{
          marginTop: "clamp(36px, 4.5vw, 56px)", display: "grid",
          gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
          gap: "clamp(24px, 4vw, 64px)", alignItems: "end",
        }}>
          <p style={{ fontSize: "clamp(17px, 1.5vw, 21px)", color: "var(--ink-2)", maxWidth: "58ch", lineHeight: 1.45, letterSpacing: "-0.005em" }}>
            Onmatch reads your CRM, learns your voice, scores audiences against what&apos;s actually worked before, and drafts complete campaigns. It surfaces the strategic decisions that need your judgment and handles the rest.{" "}
            <span style={{ color: "var(--ink-3)" }}>Built by founders building it for themselves.</span>
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
            <EmailField source="hero" />
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Founder rate locks at request. No card.
            </div>
          </div>
        </div>

        <div style={{ marginTop: "clamp(56px, 7vw, 88px)" }}>
          <OperatorLog />
        </div>
      </div>
    </section>
  );
}
