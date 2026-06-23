import React from "react";
import { AbsoluteFill } from "remotion";
import { ScreenshotSlide } from "../../components/ScreenshotSlide";
import { AGENTS_SCENE_FRAMES } from "../../lib/data";

export const SceneOpsCenter: React.FC = () => {
  return (
    <AbsoluteFill>
      <ScreenshotSlide
        image="screenshots/07-tasks.png"
        title="OPS Center"
        body="Todas las tareas de todos los agentes. Aprobacion humana cuando importa."
        totalFrames={AGENTS_SCENE_FRAMES.opsCenter}
      />
    </AbsoluteFill>
  );
};
