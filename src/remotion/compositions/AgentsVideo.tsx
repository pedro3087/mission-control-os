import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { OS, FONT_MONO } from "../lib/design-tokens";
import { AGENTS_SCENE_FRAMES } from "../lib/data";
import { ScanlineOverlay } from "../components/ScanlineOverlay";
import { SceneAgentsIntro } from "./scenes/SceneAgentsIntro";
import { SceneIncident } from "./scenes/SceneIncident";
import { SceneAutoFix } from "./scenes/SceneAutoFix";
import { SceneOpsCenter } from "./scenes/SceneOpsCenter";
import { SceneAgentConfig } from "./scenes/SceneAgentConfig";
import { SceneAgentGrid } from "./scenes/SceneAgentGrid";
import { SceneCTA } from "./scenes/SceneCTA";

export const AgentsVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: OS.bg, fontFamily: FONT_MONO }}>
      <Series>
        <Series.Sequence durationInFrames={AGENTS_SCENE_FRAMES.intro}>
          <SceneAgentsIntro />
        </Series.Sequence>
        <Series.Sequence durationInFrames={AGENTS_SCENE_FRAMES.incident}>
          <SceneIncident />
        </Series.Sequence>
        <Series.Sequence durationInFrames={AGENTS_SCENE_FRAMES.autofix}>
          <SceneAutoFix />
        </Series.Sequence>
        <Series.Sequence durationInFrames={AGENTS_SCENE_FRAMES.opsCenter}>
          <SceneOpsCenter />
        </Series.Sequence>
        <Series.Sequence durationInFrames={AGENTS_SCENE_FRAMES.agentConfig}>
          <SceneAgentConfig />
        </Series.Sequence>
        <Series.Sequence durationInFrames={AGENTS_SCENE_FRAMES.agentGrid}>
          <SceneAgentGrid />
        </Series.Sequence>
        <Series.Sequence durationInFrames={AGENTS_SCENE_FRAMES.cta}>
          <SceneCTA />
        </Series.Sequence>
      </Series>
      <ScanlineOverlay />
    </AbsoluteFill>
  );
};
