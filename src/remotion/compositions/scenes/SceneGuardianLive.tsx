import React from "react";
import { AbsoluteFill } from "remotion";
import { AlertEntry } from "../../components/AlertEntry";
import { GUARDIAN_ENTRIES } from "../../lib/data";
import { OS, FONT_MONO } from "../../lib/design-tokens";
import { useFadeIn } from "../../lib/use-animation";

export const SceneGuardianLive: React.FC = () => {
  const headerOpacity = useFadeIn(0, 15);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: OS.bg,
        padding: "60px 120px",
        fontFamily: FONT_MONO,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 40,
          opacity: headerOpacity,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.2em", color: OS.textDim }}>
          GUARDIAN · EN VIVO
        </span>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: OS.green,
            boxShadow: `0 0 8px ${OS.green}`,
          }}
        />
        <span style={{ fontSize: 12, color: OS.green, fontWeight: 700 }}>ACTIVO</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: OS.textDim }}>auto-fix ACTIVO</span>
      </div>

      {/* Alert feed */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {GUARDIAN_ENTRIES.map((entry, i) => (
          <AlertEntry
            key={i}
            severity={entry.severity}
            project={entry.project}
            title={entry.title}
            detail={entry.detail}
            enterFrame={30 + i * 55}
            prBadge={entry.prBadge}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
