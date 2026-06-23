import React from "react";
import { AbsoluteFill } from "remotion";
import { ScreenshotSlide } from "../../components/ScreenshotSlide";
import { AGENTS_SCENE_FRAMES } from "../../lib/data";

export const SceneAgentConfig: React.FC = () => {
  return (
    <AbsoluteFill>
      <ScreenshotSlide
        image="screenshots/09-agent-config.png"
        title="Cada agente es configurable"
        body="Modelo, tools, acciones, skills y memoria — control total."
        totalFrames={AGENTS_SCENE_FRAMES.agentConfig}
      />
    </AbsoluteFill>
  );
};
