import React from "react";
import { Composition, registerRoot } from "remotion";
import { HackathonVideo } from "./compositions/HackathonVideo";
import { AgentsVideo } from "./compositions/AgentsVideo";
import { TOTAL_FRAMES, AGENTS_TOTAL_FRAMES } from "./lib/data";

const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HackathonVideo"
        component={HackathonVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AgentsVideo"
        component={AgentsVideo}
        durationInFrames={AGENTS_TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

registerRoot(RemotionRoot);
