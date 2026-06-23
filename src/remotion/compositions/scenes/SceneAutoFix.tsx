import React from "react";
import { AbsoluteFill } from "remotion";
import { TerminalLog } from "../../components/TerminalLog";
import { AUTOFIX_STEPS } from "../../lib/data";
import { OS, FONT_MONO } from "../../lib/design-tokens";
import { useFadeIn, useSpring } from "../../lib/use-animation";

export const SceneAutoFix: React.FC = () => {
  const headerOpacity = useFadeIn(0, 15);
  const badgeScale = useSpring(280, { damping: 10, stiffness: 120 });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: OS.bg,
        fontFamily: FONT_MONO,
        padding: "60px 160px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 32,
          opacity: headerOpacity,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.2em", color: OS.red }}>
          GUARDIAN AUTO-FIX
        </span>
        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: OS.red, boxShadow: `0 0 8px ${OS.red}` }} />
        <span style={{ fontSize: 12, color: OS.red, fontWeight: 700 }}>EN PROCESO</span>
      </div>

      {/* Terminal log entries */}
      <div>
        {AUTOFIX_STEPS.map((step, i) => (
          <TerminalLog
            key={i}
            agent={step.agent}
            text={step.text}
            color={step.color}
            startFrame={20 + i * 40}
          />
        ))}
      </div>

      {/* Approval badge */}
      <div style={{ marginTop: 40, display: "flex", gap: 16 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.1em",
            transform: `scale(${badgeScale})`,
            color: OS.blue,
            border: `1px solid ${OS.blue}55`,
            background: `${OS.blueDim}33`,
          }}
        >
          PR #42 ABIERTO
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.1em",
            transform: `scale(${useSpring(320, { damping: 8, stiffness: 100 })})`,
            color: OS.green,
            border: `1px solid ${OS.green}55`,
            background: `${OS.greenDim}33`,
          }}
        >
          APROBADO
        </div>
      </div>
    </AbsoluteFill>
  );
};
