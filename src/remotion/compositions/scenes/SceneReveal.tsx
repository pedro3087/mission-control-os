import React from "react";
import { useCurrentFrame, AbsoluteFill, interpolate } from "remotion";
import { useSpring, useFadeIn } from "../../lib/use-animation";
import { OS, FONT_MONO } from "../../lib/design-tokens";

export const SceneReveal: React.FC = () => {
  const frame = useCurrentFrame();

  const flashOpacity = interpolate(frame, [0, 2, 4], [0, 0.85, 0], {
    extrapolateRight: "clamp",
  });

  const logoScale = useSpring(10, { damping: 8, stiffness: 100 });
  const glowSize = interpolate(logoScale, [0, 1], [0, 20]);

  const titleScale = useSpring(50, { damping: 12, stiffness: 120 });
  const taglineOpacity = useFadeIn(110, 25);
  const subtitleOpacity = useFadeIn(150, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: OS.bg, fontFamily: FONT_MONO }}>
      {/* White flash */}
      <AbsoluteFill style={{ backgroundColor: "#ffffff", opacity: flashOpacity, zIndex: 10 }} />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {/* Terminal icon */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: OS.green,
            transform: `scale(${logoScale})`,
            textShadow: `0 0 ${glowSize}px ${OS.green}, 0 0 ${glowSize * 2}px ${OS.green}55`,
          }}
        >
          {">_"}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: OS.green,
            letterSpacing: "0.08em",
            transform: `scale(${titleScale})`,
          }}
        >
          MISSION CONTROL
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: OS.textDim,
            opacity: taglineOpacity,
            marginTop: 8,
          }}
        >
          Tu portafolio SaaS en una sola pantalla.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: OS.purple,
            fontWeight: 700,
            letterSpacing: "0.15em",
            opacity: subtitleOpacity,
            marginTop: 4,
          }}
        >
          Monitoreo · Memoria · Auto-fix
        </div>
      </div>
    </AbsoluteFill>
  );
};
