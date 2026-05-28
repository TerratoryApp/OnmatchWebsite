"use client";

import { useState, FormEvent } from "react";
import Arrow from "./Arrow";

interface EmailFieldProps {
  label?: string;
  placeholder?: string;
  source: string;
  tier?: string;
}

async function submitWaitlist(payload: {
  email: string;
  source: string;
  tier?: string;
}): Promise<{ ok: boolean; status: number; message: string }> {
  try {
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return {
      ok: res.ok,
      status: res.status,
      message: data.message ?? data.error ?? "Something went wrong.",
    };
  } catch {
    return { ok: false, status: 0, message: "Network error. Please try again." };
  }
}

export default function EmailField({
  label = "Request access",
  placeholder = "you@company.com",
  source,
  tier,
}: EmailFieldProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    "idle" | "err" | "sending" | "sent" | "duplicate" | "rate_limited"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("err");
      setErrorMsg("Enter a valid email.");
      return;
    }
    setState("sending");
    const result = await submitWaitlist({ email, source, tier });
    if (result.ok) {
      setState("sent");
    } else if (result.status === 409) {
      setState("duplicate");
    } else if (result.status === 429) {
      setState("rate_limited");
      setErrorMsg("Too many requests — try again in a minute.");
    } else {
      setState("err");
      setErrorMsg(result.message);
    }
  };

  if (state === "sent" || state === "duplicate") {
    return (
      <div
        className="mono"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 18px",
          borderRadius: 8,
          background: "var(--accent-dim)",
          color: "var(--accent)",
          fontSize: 13,
          letterSpacing: "0.04em",
          fontWeight: 500,
        }}
      >
        <span
          className="pip pulse"
          style={{ background: "var(--accent)" }}
        />
        {state === "duplicate"
          ? "YOU\u2019RE ALREADY ON THE LIST \u00B7 WE\u2019LL BE IN TOUCH"
          : "FOUNDER RATE LOCKED \u00B7 WE\u2019LL BE IN TOUCH"}
      </div>
    );
  }

  return (
    <form className="field" onSubmit={submit} noValidate>
      <input
        type="email"
        required
        value={email}
        placeholder={placeholder}
        disabled={state === "sending"}
        onChange={(e) => {
          setEmail(e.target.value);
          if (state === "err" || state === "rate_limited") setState("idle");
        }}
        aria-label="Email address"
      />
      <button
        className="btn btn-sm"
        type="submit"
        disabled={state === "sending"}
      >
        {state === "sending" ? "Sending\u2026" : label} <Arrow size={12} />
      </button>
      {(state === "err" || state === "rate_limited") && errorMsg && (
        <div
          className="mono"
          style={{
            position: "absolute",
            bottom: -22,
            left: 0,
            fontSize: 11,
            color: "var(--warn, #ff6b6b)",
            letterSpacing: "0.04em",
          }}
        >
          {errorMsg}
        </div>
      )}
    </form>
  );
}
