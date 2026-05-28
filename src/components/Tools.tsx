"use client";

import { useState, FormEvent } from "react";
import Arrow from "./Arrow";
import Eyebrow from "./Eyebrow";

interface ToolItem {
  name: string;
  meta: string;
  status: string;
}

const MARKETING_TOOLS: ToolItem[] = [
  { name: "HubSpot", meta: "Marketing Hub · Sequences · Workflows", status: "CONNECTED · MCP" },
  { name: "Salesforce", meta: "Marketing Cloud · Journeys · Audiences", status: "CONNECTED · MCP" },
  { name: "Customer.io", meta: "Journeys · Broadcasts · Segments", status: "CONNECTED · MCP" },
  { name: "ActiveCampaign", meta: "Automations · Lists · Tags", status: "CONNECTED · MCP" },
];

const LEAD_PROVIDERS: ToolItem[] = [
  { name: "Findymail", meta: "B2B email finder · enrichment", status: "CONNECTED · MCP" },
  { name: "Apollo", meta: "B2B contact graph · 270M+ records", status: "CONNECTED · MCP" },
  { name: "Clay", meta: "Custom enrichment · waterfall sourcing", status: "CONNECTED · MCP" },
];

function ToolCard({ t }: { t: ToolItem }) {
  return (
    <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
      <div className="panel-hd">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span className="pip" /> {t.status}
        </span>
        <span style={{ color: "var(--ink-4)" }}>~230ms</span>
      </div>
      <div style={{ padding: "clamp(22px, 2.4vw, 32px)", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: "clamp(22px, 2vw, 30px)", fontWeight: 500, letterSpacing: "-0.03em", color: "var(--ink)" }}>{t.name}</div>
        <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)", letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1.5 }}>{t.meta}</div>
      </div>
    </div>
  );
}

export default function Tools() {
  const [openReq, setOpenReq] = useState(false);
  const [reqEmail, setReqEmail] = useState("");
  const [reqTool, setReqTool] = useState("");
  const [reqSent, setReqSent] = useState(false);

  const [reqError, setReqError] = useState("");
  const [reqSending, setReqSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!reqEmail || !reqTool) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reqEmail)) {
      setReqError("Enter a valid email.");
      return;
    }
    setReqSending(true);
    setReqError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: reqEmail,
          source: "tool_request",
          tool_name: reqTool,
        }),
      });
      if (res.ok || res.status === 409) {
        setReqSent(true);
      } else {
        const data = await res.json();
        setReqError(data.error ?? "Something went wrong.");
      }
    } catch {
      setReqError("Network error. Please try again.");
    } finally {
      setReqSending(false);
    }
  };

  return (
    <section id="tools">
      <div className="wrap">
        <div className="section-head">
          <Eyebrow num="§ 05">SUPPORTED TOOLS</Eyebrow>
          <div className="rule" />
          <div className="eyebrow hide-sm" style={{ color: "var(--ink-4)" }}>OAUTH · SCOPED PER CAMPAIGN · YOUR ACCOUNT</div>
        </div>

        <h2 style={{ maxWidth: "24ch", marginBottom: "clamp(40px, 5vw, 56px)", color: "var(--ink)" }}>
          Connects to the stack you already pay for. <span style={{ color: "var(--ink-3)" }}>Operates inside your accounts, not around them.</span>
        </h2>

        <div style={{ marginBottom: "clamp(32px, 4vw, 56px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", fontWeight: 600, whiteSpace: "nowrap" }}>MARKETING TOOLS · EXECUTION LAYER</div>
            <span style={{ flex: 1, height: 1, background: "var(--rule)" }} />
            <div className="mono hide-sm" style={{ fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Onmatch translates · your tool sends</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "clamp(12px, 1.5vw, 20px)" }}>
            {MARKETING_TOOLS.map((t) => <ToolCard key={t.name} t={t} />)}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em", fontWeight: 600, whiteSpace: "nowrap" }}>LEAD PROVIDERS · OPTIONAL · YOUR ACCOUNT, YOUR BILL</div>
            <span style={{ flex: 1, height: 1, background: "var(--rule)" }} />
            <div className="mono hide-sm" style={{ fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Connect when you want to expand</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "clamp(12px, 1.5vw, 20px)" }}>
            {LEAD_PROVIDERS.map((t) => <ToolCard key={t.name} t={t} />)}
          </div>
          <p style={{ marginTop: 18, fontSize: 14, color: "var(--ink-3)", maxWidth: "68ch", lineHeight: 1.55 }}>
            Connect your own Findymail, Apollo, or Clay account, or buy access through one. You pay your provider directly for data — Onmatch never resells leads. Deeper native sourcing comes as Onmatch grows.
          </p>
        </div>

        <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          {!openReq && !reqSent && (
            <button className="btn btn-ghost btn-sm" onClick={() => setOpenReq(true)}>Request your tool <Arrow size={12} /></button>
          )}
          {openReq && !reqSent && (
            <div>
              <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div className="field" style={{ maxWidth: 220, padding: "5px 5px 5px 18px" }}>
                  <input value={reqTool} onChange={(e) => setReqTool(e.target.value)} placeholder="Your tool" aria-label="Tool name" disabled={reqSending} />
                </div>
                <div className="field" style={{ maxWidth: 320, padding: "5px 5px 5px 18px" }}>
                  <input type="email" value={reqEmail} onChange={(e) => { setReqEmail(e.target.value); setReqError(""); }} placeholder="you@company.com" aria-label="Email" required disabled={reqSending} />
                  <button className="btn btn-sm" type="submit" disabled={reqSending}>{reqSending ? "Sending\u2026" : "Send"} <Arrow size={12} /></button>
                </div>
              </form>
              {reqError && (
                <div className="mono" style={{ marginTop: 6, fontSize: 11, color: "var(--warn, #ff6b6b)", letterSpacing: "0.04em" }}>{reqError}</div>
              )}
            </div>
          )}
          {reqSent && (
            <div className="mono" style={{ fontSize: 12, letterSpacing: "0.04em", color: "var(--accent)" }}>
              ✓ NOTED · we&apos;ll ping you when {reqTool || "your tool"} ships.
            </div>
          )}
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Priority weighted by demand</span>
        </div>
      </div>
    </section>
  );
}
