import React from "react";
import { AbsoluteFill } from "remotion";
import { AlertEntry } from "../../components/AlertEntry";
import { TypewriterText } from "../../components/TypewriterText";
import { OS, FONT_MONO } from "../../lib/design-tokens";

export const SceneIncident: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: OS.bg,
        fontFamily: FONT_MONO,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "80px 160px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 900 }}>
        <AlertEntry
          severity="critical"
          project="Meridian Real Estate"
          title="TypeError en /api/listings — 412 errors in 2h"
          detail="Error rate 2400% above baseline. Usuarios afectados: todos. Revenue impactado."
          enterFrame={20}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <TypewriterText
          text="Guardian detecta el error en segundos."
          startFrame={100}
          color={OS.green}
          fontSize={28}
        />
      </div>
    </AbsoluteFill>
  );
};
