import React from "react";
import { useTypewriter } from "../lib/use-animation";
import { OS } from "../lib/design-tokens";

interface Props {
  text: string;
  startFrame: number;
  color?: string;
  fontSize?: number;
  charsPerFrame?: number;
}

export const TypewriterText: React.FC<Props> = ({
  text,
  startFrame,
  color = OS.text,
  fontSize = 42,
  charsPerFrame = 0.5,
}) => {
  const { visibleText, showCursor } = useTypewriter(text, startFrame, charsPerFrame);

  if (visibleText.length === 0 && !showCursor) return null;

  return (
    <div style={{ color, fontSize, fontWeight: 700, lineHeight: 1.4 }}>
      {visibleText}
      <span style={{ opacity: showCursor ? 1 : 0, color: OS.green }}>▋</span>
    </div>
  );
};
