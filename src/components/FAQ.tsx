"use client";

import { useState } from "react";
import Eyebrow from "./Eyebrow";

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FAQItem[] = [
  { q: "Where do my contacts come from?", a: "From your CRM, primarily. Onmatch reads your existing contacts, segments, and engagement history, and scores every audience against what's actually converted before. To expand beyond your current list, you bring your own Findymail, Apollo, or Clay account, or buy access through one of them — you pay your provider directly for data. Onmatch never resells leads.\n\nAs Onmatch grows, deeper provider integrations will enable native in-app sourcing and reseller relationships. Today: bring your own, or buy your own. Tomorrow: Onmatch operates inside your provider account natively." },
  { q: "Is this just GPT writing emails?", a: "No. GPT writing emails is a feature bolted onto a marketing tool. Onmatch is the inverse: the marketing tool is execution infrastructure for Onmatch's strategy. Pull Onmatch out of the loop and you have a marketing stack again — your HubSpot or Salesforce, doing what it always did. We're not adding features to what you have. We're doing work that wasn't being done." },
  { q: "How does the autonomy work? Does it send things without my approval?", a: "Only after you explicitly grant a graduation. Onmatch proposes graduations on specific decision classes after a track record builds up — for example, \"approve re-engagement flows automatically when they match this profile.\" You scope it, you reverse it. Default state is approval-on-every-send." },
  { q: "What if my tool isn't supported yet?", a: "Add yourself to the request list with the tool you use. We prioritize new integrations by demand and ship them as the volume warrants. Most operators we talk to are already on one of the four supported tools — if you're not, it's usually a quick switch." },
  { q: "What happens to my data?", a: "It stays in your connected tool. We hold the context required to generate flows on your behalf and we do not resell, share, or use it to train external models. You can revoke MCP access at any time and the local context goes with it." },
  { q: "What am I actually locking in?", a: "Your tier's founder rate for twelve months from access. Pay one month upfront now to lock; that month is comped when access opens. After founder year ends, you stay at month-to-month with no forced price increase. If you don't lock now, you pay the standard rate when we open access — Starter $99, Operator $449, Scale $999." },
  { q: "Can I cancel anytime?", a: "Yes. Month-to-month, no annual lock-in, no cancellation calls. Founding rate persists if you come back within twelve months." },
  { q: "Do I have to learn a new email builder?", a: "No. You review and approve flows inside Onmatch, with one consistent UI across every tool you've connected. On approval, Onmatch builds the campaign as native objects in your stack — a HubSpot workflow, a Salesforce flow, a Customer.io campaign — where you add visuals and send. Your team never touches a second builder." },
  { q: "Why should I trust this versus the dozen other AI marketing tools?", a: "Most AI marketing tools are sidecars — AI features bolted onto products built for human-initiated workflows. Remove the AI and the original product still works. Onmatch is the inverse: the strategic intelligence is the product, your marketing tool is the execution layer it operates through. The voice model sharpens on your approvals, the workflow library compounds across every campaign, autonomy graduates by class. None of that retrofits onto a tool built around composition surfaces. Remove Onmatch and you have a marketing stack with nobody running it." },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq">
      <div className="wrap">
        <div className="section-head">
          <Eyebrow num="§ 08">FAQ</Eyebrow>
          <div className="rule" />
        </div>

        <h2 style={{ maxWidth: "18ch", marginBottom: "clamp(40px, 5vw, 56px)", color: "var(--ink)" }}>
          Things a skeptical founder would ask.
        </h2>

        <div style={{ borderTop: "1px solid var(--rule)" }}>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderBottom: "1px solid var(--rule)" }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: "100%", textAlign: "left",
                    display: "grid", gridTemplateColumns: "56px minmax(0, 1fr) 24px",
                    gap: "clamp(16px, 2.5vw, 32px)",
                    padding: "clamp(20px, 2.4vw, 28px) 4px",
                    background: "transparent", border: 0, cursor: "pointer",
                    alignItems: "baseline",
                  }}
                  aria-expanded={isOpen}
                >
                  <div className="mono" style={{ fontSize: 12, color: isOpen ? "var(--accent)" : "var(--ink-4)", letterSpacing: "0.06em" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: "clamp(17px, 1.4vw, 20px)", fontWeight: 500, color: "var(--ink)", letterSpacing: "-0.015em" }}>
                    {item.q}
                  </div>
                  <div style={{
                    width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "transform .2s ease",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    color: isOpen ? "var(--accent)" : "var(--ink-3)",
                    fontFamily: "var(--mono)", fontSize: 18, lineHeight: 1,
                  }}>+</div>
                </button>
                <div style={{
                  display: "grid",
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  transition: "grid-template-rows .25s ease",
                }}>
                  <div style={{ overflow: "hidden" }}>
                    <div style={{
                      display: "grid", gridTemplateColumns: "56px minmax(0, 1fr) 24px",
                      gap: "clamp(16px, 2.5vw, 32px)",
                      padding: "0 4px clamp(24px, 3vw, 36px)",
                    }}>
                      <div />
                      <div style={{ maxWidth: "62ch", color: "var(--ink-2)", fontSize: 15.5, lineHeight: 1.65 }}>
                        {item.a.split("\n\n").map((para, pi, arr) => (
                          <p key={pi} style={{ marginBottom: pi < arr.length - 1 ? "12px" : 0 }}>{para}</p>
                        ))}
                      </div>
                      <div />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
