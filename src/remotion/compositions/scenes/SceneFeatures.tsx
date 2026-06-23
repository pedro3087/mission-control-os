import React from "react";
import { useCurrentFrame, AbsoluteFill } from "remotion";
import { ScreenshotSlide } from "../../components/ScreenshotSlide";
import { FEATURE_SLIDES, SCENE_FRAMES } from "../../lib/data";
import { OS } from "../../lib/design-tokens";

const FRAMES_PER_SLIDE = Math.floor(SCENE_FRAMES.features / FEATURE_SLIDES.length);

export const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const currentIndex = Math.min(
    Math.floor(frame / FRAMES_PER_SLIDE),
    FEATURE_SLIDES.length - 1
  );
  const slide = FEATURE_SLIDES[currentIndex];

  return (
    <AbsoluteFill style={{ backgroundColor: OS.bg }} key={currentIndex}>
      <ScreenshotSlide
        image={slide.image}
        title={slide.title}
        body={slide.body}
        totalFrames={FRAMES_PER_SLIDE}
      />
    </AbsoluteFill>
  );
};
