import React from "react";
import { useSpring } from "../lib/use-animation";
import { OS, FONT_MONO } from "../lib/design-tokens";
import type { AlertSeverity } from "../lib/data";

const SEVERITY_CONFIG: Record<AlertSeverity, { color: string; bg: string; border: string; icon: string }> = {
  critical: { color: OS.red, bg: `${OS.redDim}33`, border: `${OS.red}4D`, icon: "⚠" },
  warning: { color: OS.yellow, bg: `${OS.yellowDim}33`, border: `${OS.yellow}4D`, icon: "⚠" },
  info: { color: OS.blue, bg: `${OS.blueDim}33`, border: `${OS.blue}4D`, icon: "ℹ" },
  resolved: { color: OS.green, bg: `${OS.greenDim}33`, border: `${OS.green}4D`, icon: "✓" },
};

interface Props {
  severity: AlertSeverity;
  project: string;
  title: string;
  detail: string;
  enterFrame: number;
  prBadge?: { status: "open" | "merged"; delayFrames: number };
}

export const AlertEntry: React.FC<Props> = ({ severity, project, title, detail, enterFrame, prBadge }) => {
  const s = SEVERITY_CONFIG[severity];
  const enter = useSpring(enterFrame, { damping: 14, stiffness: 100 });
  const badgeEnter = prBadge ? useSpring(enterFrame + prBadge.delayFrames, { damping: 10, stiffness: 120 }) : 0;

  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 12,
        padding: "20px 28px",
        opacity: enter,
        transform: `translateX(${(1 - enter) * 120}px)`,
        fontFamily: FONT_MONO,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 18, color: s.color }}>{s.icon}</span>
        <span style={{ fontSize: 20, fontWeight: 800, color: OS.text }}>{title}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: s.color, letterSpacing: "0.1em", marginBottom: 6 }}>
        {project}
      </div>
      <div style={{ fontSize: 14, color: OS.textDim, lineHeight: 1.5 }}>{detail}</div>

      {prBadge && (
        <div
          style={{
            marginTop: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.1em",
            transform: `scale(${badgeEnter})`,
            color: prBadge.status === "merged" ? OS.green : OS.blue,
            border: `1px solid ${prBadge.status === "merged" ? OS.green : OS.blue}55`,
            background: prBadge.status === "merged" ? `${OS.greenDim}33` : `${OS.blueDim}33`,
          }}
        >
          PR {prBadge.status === "merged" ? "MERGED" : "ABIERTO"}
        </div>
      )}
    </div>
  );
};
