import React from "react";
import { AbsoluteFill } from "remotion";
import { AgentBadge } from "../../components/AgentBadge";
import { AGENT_CARDS } from "../../lib/data";
import { OS, FONT_MONO } from "../../lib/design-tokens";
import { useFadeIn } from "../../lib/use-animation";

export const SceneAgentGrid: React.FC = () => {
  const titleOpacity = useFadeIn(0, 20);

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
      <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.2em", color: OS.textDim, opacity: titleOpacity }}>
        5 AGENTES ESPECIALIZADOS
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 20,
          maxWidth: 1000,
          width: "100%",
        }}
      >
        {AGENT_CARDS.slice(0, 3).map((agent, i) => (
          <AgentBadge
            key={i}
            label={agent.label}
            color={agent.color}
            description={agent.description}
            enterFrame={20 + i * 25}
          />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          maxWidth: 660,
          width: "100%",
        }}
      >
        {AGENT_CARDS.slice(3).map((agent, i) => (
          <AgentBadge
            key={i + 3}
            label={agent.label}
            color={agent.color}
            description={agent.description}
            enterFrame={95 + i * 25}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
