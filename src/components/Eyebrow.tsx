import { ReactNode } from "react";

interface EyebrowProps {
  num?: string;
  children: ReactNode;
  right?: string;
  dot?: boolean;
}

export default function Eyebrow({
  num,
  children,
  right,
  dot = true,
}: EyebrowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: "clamp(28px, 3vw, 40px)",
      }}
    >
      <div className="eyebrow">
        {dot && <span className="dot" />}
        {num && <span className="num">{num}</span>}
        <span>{children}</span>
      </div>
      <span
        className="rule"
        style={{ flex: 1, height: 1, background: "var(--rule)" }}
      />
      {right && (
        <div
          className="eyebrow nowrap hide-sm"
          style={{ color: "var(--ink-4)" }}
        >
          {right}
        </div>
      )}
    </div>
  );
}
