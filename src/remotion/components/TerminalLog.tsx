import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTypewriter } from "../lib/use-animation";
import { OS, FONT_MONO } from "../lib/design-tokens";

interface Props {
  agent: string;
  text: string;
  color: string;
  startFrame: number;
}

export const TerminalLog: React.FC<Props> = ({ agent, text, color, startFrame }) => {
  const frame = useCurrentFrame();
  const { visibleText, showCursor, isComplete } = useTypewriter(text, startFrame + 10, 0.6);

  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        padding: "12px 0",
        borderBottom: `1px solid ${OS.border}`,
        fontFamily: FONT_MONO,
      }}
    >
      <span style={{ fontSize: 13, color, fontWeight: 800, letterSpacing: "0.1em", minWidth: 100 }}>
        {agent}
      </span>
      <span style={{ color: OS.textDim, fontSize: 14 }}>→</span>
      <span style={{ fontSize: 15, color: OS.text, lineHeight: 1.5, flex: 1 }}>
        {visibleText}
        {!isComplete && <span style={{ opacity: showCursor ? 1 : 0, color: OS.green }}>▋</span>}
      </span>
    </div>
  );
};
