import React from "react";
import { AbsoluteFill } from "remotion";
import { KPICard } from "../../components/KPICard";
import { KPIS } from "../../lib/data";
import { OS, FONT_MONO } from "../../lib/design-tokens";
import { useFadeIn } from "../../lib/use-animation";

export const SceneKPIs: React.FC = () => {
  const gridOpacity = useFadeIn(0, 20);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: OS.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        fontFamily: FONT_MONO,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          width: "100%",
          maxWidth: 1000,
          opacity: gridOpacity,
        }}
      >
        {KPIS.map((kpi, i) => (
          <KPICard
            key={i}
            label={kpi.label}
            value={kpi.value}
            prefix={kpi.prefix}
            suffix={kpi.suffix}
            color={kpi.color}
            format={kpi.format}
            enterFrame={30 + i * 15}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
