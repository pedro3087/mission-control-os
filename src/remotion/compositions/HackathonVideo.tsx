import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { OS, FONT_MONO } from "../lib/design-tokens";
import { SCENE_FRAMES } from "../lib/data";
import { ScanlineOverlay } from "../components/ScanlineOverlay";
import { ScenePain } from "./scenes/ScenePain";
import { SceneAgitation } from "./scenes/SceneAgitation";
import { SceneReveal } from "./scenes/SceneReveal";
import { SceneKPIs } from "./scenes/SceneKPIs";
import { SceneFeatures } from "./scenes/SceneFeatures";
import { SceneGuardianLive } from "./scenes/SceneGuardianLive";
import { SceneCTA } from "./scenes/SceneCTA";

export const HackathonVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: OS.bg, fontFamily: FONT_MONO }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_FRAMES.pain}>
          <ScenePain />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_FRAMES.agitation}>
          <SceneAgitation />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_FRAMES.reveal}>
          <SceneReveal />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_FRAMES.kpis}>
          <SceneKPIs />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_FRAMES.features}>
          <SceneFeatures />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_FRAMES.guardian}>
          <SceneGuardianLive />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_FRAMES.cta}>
          <SceneCTA />
        </Series.Sequence>
      </Series>
      <ScanlineOverlay />
    </AbsoluteFill>
  );
};
