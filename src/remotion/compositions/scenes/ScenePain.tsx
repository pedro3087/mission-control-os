import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { TypewriterText } from "../../components/TypewriterText";
import { PAIN_LINES } from "../../lib/data";
import { OS, FONT_MONO } from "../../lib/design-tokens";

export const ScenePain: React.FC = () => {
  const frame = useCurrentFrame();

  const glitchStart = 250;
  const glitchOpacity = interpolate(frame, [glitchStart, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glitchX = frame > glitchStart
    ? Math.sin(frame * 3) * interpolate(frame, [glitchStart, 300], [0, 8], { extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: OS.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: 160,
        gap: 24,
        fontFamily: FONT_MONO,
        opacity: glitchOpacity,
        transform: `translateX(${glitchX}px)`,
      }}
    >
      {PAIN_LINES.map((line, i) => (
        <TypewriterText
          key={i}
          text={line.text}
          startFrame={line.delayFrames}
          color={line.color}
          fontSize={i === 3 ? 46 : 42}
        />
      ))}
    </AbsoluteFill>
  );
};
