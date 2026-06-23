import React from "react";
import { useCurrentFrame, interpolate, Img, staticFile } from "remotion";
import { useSpring } from "../lib/use-animation";
import { OS, FONT_MONO } from "../lib/design-tokens";

interface Props {
  image: string;
  title: string;
  body: string;
  totalFrames: number;
}

export const ScreenshotSlide: React.FC<Props> = ({ image, title, body, totalFrames }) => {
  const frame = useCurrentFrame();

  const imgEnter = useSpring(5, { damping: 14, stiffness: 100 });
  const textEnter = useSpring(20, { damping: 12, stiffness: 100 });
  const kenBurns = interpolate(frame, [0, totalFrames], [1, 1.04], { extrapolateRight: "clamp" });

  return (
    <div style={{ width: "100%", height: "100%", background: OS.bg, position: "relative", overflow: "hidden" }}>
      {/* Screenshot */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px 160px",
          opacity: imgEnter,
        }}
      >
        <Img
          src={staticFile(image)}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            borderRadius: 12,
            border: `1px solid ${OS.border}`,
            boxShadow: "0 0 80px rgba(0,0,0,0.8)",
            transform: `scale(${kenBurns})`,
          }}
        />
      </div>

      {/* Text overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "80px 80px 50px",
          background: "linear-gradient(transparent, rgba(7,11,15,0.97))",
          opacity: textEnter,
          transform: `translateY(${(1 - textEnter) * 20}px)`,
          fontFamily: FONT_MONO,
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800, color: OS.text, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 22, color: OS.textDim }}>{body}</div>
      </div>
    </div>
  );
};
