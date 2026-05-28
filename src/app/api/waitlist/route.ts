import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ── Rate limiting (in-memory) ────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per window

const ipHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
}

// ── Email validation ─────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Allowed enum values ──────────────────────────────────────────
const VALID_SOURCES = new Set([
  "hero",
  "final_cta",
  "pricing_starter",
  "pricing_operator",
  "pricing_scale",
  "tool_request",
]);
const VALID_TIERS = new Set(["starter", "operator", "scale"]);

// ── POST /api/waitlist ───────────────────────────────────────────
export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 422 });
  }

  const { email, tier, source, tool_name } = body as {
    email?: string;
    tier?: string;
    source?: string;
    tool_name?: string;
  };

  // Validate email
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 422 },
    );
  }

  // Validate source
  if (!source || !VALID_SOURCES.has(source)) {
    return NextResponse.json(
      { error: `Invalid source. Must be one of: ${[...VALID_SOURCES].join(", ")}` },
      { status: 422 },
    );
  }

  // Validate tier (optional)
  if (tier !== undefined && tier !== null && !VALID_TIERS.has(tier)) {
    return NextResponse.json(
      { error: `Invalid tier. Must be one of: ${[...VALID_TIERS].join(", ")}` },
      { status: 422 },
    );
  }

  // Insert into Supabase
  const { error } = await supabaseAdmin.from("waitlist_signups").insert({
    email: email.toLowerCase().trim(),
    tier: tier ?? null,
    source,
    tool_name: source === "tool_request" ? (tool_name ?? null) : null,
  });

  if (error) {
    // Unique constraint violation → duplicate email
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This email is already on the waitlist." },
        { status: 409 },
      );
    }
    console.error("Supabase insert error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "You're on the list." },
    { status: 201 },
  );
}
