import React from "react";
import { AbsoluteFill } from "remotion";
import { useSlideIn } from "../../lib/use-animation";
import { PROBLEMS } from "../../lib/data";
import { OS, FONT_MONO } from "../../lib/design-tokens";

function ProblemCard({ title, body, borderColor, enterFrame }: {
  title: string;
  body: string;
  borderColor: string;
  enterFrame: number;
}) {
  const style = useSlideIn(enterFrame, 60);

  return (
    <div
      style={{
        ...style,
        background: OS.surface,
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 12,
        padding: "28px 36px",
        maxWidth: 900,
        fontFamily: FONT_MONO,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 800, color: OS.text, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 18, color: OS.textDim, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

export const SceneAgitation: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: OS.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      {PROBLEMS.map((p, i) => (
        <ProblemCard key={i} {...p} enterFrame={i * 45} />
      ))}
    </AbsoluteFill>
  );
};
