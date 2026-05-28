"use client";

import { useState, FormEvent } from "react";
import Arrow from "./Arrow";

export default function FinalCTA() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    "idle" | "sending" | "sent" | "duplicate" | "err"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("err");
      setErrorMsg("Enter a valid email.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "final_cta" }),
      });
      const data = await res.json();
      if (res.ok) {
        setState("sent");
      } else if (res.status === 409) {
        setState("duplicate");
      } else {
        setState("err");
        setErrorMsg(data.error ?? "Something went wrong.");
      }
    } catch {
      setState("err");
      setErrorMsg("Network error. Please try again.");
    }
  };

  const showSuccess = state === "sent" || state === "duplicate";

  return (
    <section
      id="cta"
      style={{
        background: "var(--accent)",
        color: "var(--accent-ink)",
        borderTop: "1px solid var(--accent)",
      }}
    >
      <div className="wrap">
        <div
          className="mono"
          style={{
            fontSize: 11.5,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(12,12,13,.55)",
            marginBottom: 36,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: "var(--accent-ink)",
            }}
          />
          FOUNDER COHORT · LIMITED SEATS
        </div>

        <h2
          style={{
            color: "var(--accent-ink)",
            fontSize: "clamp(40px, 6.5vw, 96px)",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            maxWidth: "16ch",
            lineHeight: 0.98,
            marginBottom: "clamp(32px, 4vw, 48px)",
          }}
        >
          Founder rate locks now.{" "}
          <span style={{ color: "rgba(12,12,13,.6)" }}>
            Standard pricing applies after.
          </span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
            gap: "clamp(24px, 4vw, 64px)",
            alignItems: "end",
          }}
        >
          {showSuccess ? (
            <div
              className="mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 18px",
                borderRadius: 8,
                background: "var(--accent-ink)",
                color: "#fff",
                fontSize: 13,
                letterSpacing: "0.04em",
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: "var(--accent)",
                }}
              />
              {state === "duplicate"
                ? "YOU\u2019RE ALREADY ON THE LIST \u00B7 WE\u2019LL BE IN TOUCH"
                : "FOUNDER RATE LOCKED \u00B7 WE\u2019LL BE IN TOUCH"}
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  maxWidth: 520,
                  background: "var(--accent-ink)",
                  borderRadius: 999,
                  padding: "5px 5px 5px 24px",
                }}
              >
                <input
                  type="email"
                  placeholder="you@company.com"
                  aria-label="Email"
                  required
                  value={email}
                  disabled={state === "sending"}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "err") setState("idle");
                  }}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: "transparent",
                    border: 0,
                    outline: 0,
                    color: "#fff",
                    fontSize: 15,
                  }}
                />
                <button
                  type="submit"
                  disabled={state === "sending"}
                  style={{
                    height: 38,
                    padding: "0 18px",
                    borderRadius: 999,
                    background: "var(--accent)",
                    color: "var(--accent-ink)",
                    border: "1px solid var(--accent)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: state === "sending" ? "wait" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    whiteSpace: "nowrap",
                  }}
                >
                  {state === "sending" ? "Sending\u2026" : "Request access"}{" "}
                  <Arrow size={12} />
                </button>
              </form>
              {state === "err" && errorMsg && (
                <div
                  className="mono"
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    color: "var(--accent-ink)",
                    letterSpacing: "0.04em",
                    opacity: 0.7,
                  }}
                >
                  {errorMsg}
                </div>
              )}
            </div>
          )}

          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gap: 6,
              fontSize: 13.5,
              color: "rgba(12,12,13,.78)",
              fontFamily: "var(--mono)",
            }}
          >
            <li>→ Founder rate locked when access opens</li>
            <li>→ Standard pricing applies after launch</li>
            <li>→ No card until access opens</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
