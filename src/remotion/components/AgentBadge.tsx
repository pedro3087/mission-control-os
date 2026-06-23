import React from "react";
import { useSpring } from "../lib/use-animation";
import { OS, FONT_MONO } from "../lib/design-tokens";

interface Props {
  label: string;
  color: string;
  description: string;
  enterFrame: number;
}

export const AgentBadge: React.FC<Props> = ({ label, color, description, enterFrame }) => {
  const enter = useSpring(enterFrame, { damping: 10, stiffness: 120 });

  return (
    <div
      style={{
        background: OS.surface,
        border: `1px solid ${color}40`,
        borderRadius: 12,
        padding: "28px 32px",
        opacity: enter,
        transform: `scale(${0.8 + enter * 0.2})`,
        fontFamily: FONT_MONO,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}88`,
          }}
        />
        <span style={{ fontSize: 16, fontWeight: 900, color, letterSpacing: "0.15em" }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 14, color: OS.textDim, lineHeight: 1.4 }}>
        {description}
      </div>
    </div>
  );
};
