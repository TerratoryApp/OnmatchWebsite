export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--rule)",
        padding: "40px 0 56px",
      }}
    >
      <div
        className="wrap"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "var(--ink)",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              background: "var(--accent)",
              borderRadius: 2,
              display: "inline-block",
              boxShadow:
                "0 0 12px color-mix(in oklab, var(--accent) 40%, transparent)",
            }}
          />
          <span style={{ fontWeight: 600, letterSpacing: "-0.025em" }}>
            Onmatch
          </span>
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-4)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginLeft: 6,
            }}
          >
            Sell-then-build · v0.1
          </span>
        </div>
        <div
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-4)",
          }}
        >
          © 2026 · hello@onmatch.ai
        </div>
      </div>
    </footer>
  );
}
