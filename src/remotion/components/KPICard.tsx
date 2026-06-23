import React from "react";
import { useCountUp, useSpring } from "../lib/use-animation";
import { OS, FONT_MONO } from "../lib/design-tokens";

interface Props {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color: string;
  format: "currency" | "number" | "integer" | "decimal";
  enterFrame: number;
}

function formatValue(raw: number, format: Props["format"], prefix: string, suffix: string): string {
  let formatted: string;
  switch (format) {
    case "currency":
      formatted = raw >= 1000 ? `${(raw / 1000).toFixed(1)}k` : raw.toFixed(0);
      break;
    case "number":
      formatted = Math.round(raw).toLocaleString("en-US");
      break;
    case "integer":
      formatted = Math.round(raw).toString();
      break;
    case "decimal":
      formatted = raw.toFixed(1);
      break;
  }
  return `${prefix}${formatted}${suffix}`;
}

export const KPICard: React.FC<Props> = ({ label, value, prefix = "", suffix = "", color, format, enterFrame }) => {
  const enter = useSpring(enterFrame, { damping: 10, stiffness: 120 });
  const count = useCountUp(enterFrame, enterFrame + 60, value);
  const displayValue = formatValue(count, format, prefix, suffix);

  return (
    <div
      style={{
        background: OS.surface,
        border: `1px solid ${OS.border}`,
        borderRadius: 16,
        padding: "40px 48px",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 40}px)`,
        fontFamily: FONT_MONO,
      }}
    >
      <div style={{ fontSize: 16, color: OS.textDim, letterSpacing: "0.15em", marginBottom: 16 }}>
        {label}
      </div>
      <div style={{ fontSize: 64, fontWeight: 900, color }}>
        {displayValue}
      </div>
    </div>
  );
};
