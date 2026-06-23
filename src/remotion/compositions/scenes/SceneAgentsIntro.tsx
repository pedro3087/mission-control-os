import React from "react";
import { AbsoluteFill } from "remotion";
import { TypewriterText } from "../../components/TypewriterText";
import { AgentBadge } from "../../components/AgentBadge";
import { AGENT_CARDS } from "../../lib/data";
import { OS, FONT_MONO } from "../../lib/design-tokens";

export const SceneAgentsIntro: React.FC = () => {
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
        padding: 80,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <TypewriterText text="Tu portafolio SaaS opera solo." startFrame={10} color={OS.text} fontSize={38} />
        <div style={{ marginTop: 16 }}>
          <TypewriterText text="5 agentes de IA. Cada uno con su rol." startFrame={70} color={OS.textDim} fontSize={24} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 1200 }}>
        {AGENT_CARDS.map((agent, i) => (
          <AgentBadge
            key={i}
            label={agent.label}
            color={agent.color}
            description={agent.description}
            enterFrame={120 + i * 20}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
