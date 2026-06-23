import React from "react";
import { useCurrentFrame, AbsoluteFill, interpolate } from "remotion";
import { TypewriterText } from "../../components/TypewriterText";
import { useSpring, useFadeIn } from "../../lib/use-animation";
import { OS, FONT_MONO } from "../../lib/design-tokens";

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoScale = useSpring(30, { damping: 10, stiffness: 100 });
  const ctaOpacity = useFadeIn(130, 25);
  const footerOpacity = useFadeIn(180, 25);
  const badgeOpacity = useFadeIn(200, 20);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: OS.bg,
        fontFamily: FONT_MONO,
        opacity: fadeIn,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: OS.green,
            letterSpacing: "0.08em",
            transform: `scale(${logoScale})`,
          }}
        >
          {">_"} MISSION CONTROL
        </div>

        {/* Tagline typewriter */}
        <div style={{ marginTop: 16 }}>
          <TypewriterText
            text="Un founder. Ocho productos. Un cockpit."
            startFrame={60}
            color={OS.text}
            fontSize={40}
            charsPerFrame={0.8}
          />
        </div>

        {/* CTA */}
        <div
          style={{
            fontSize: 22,
            color: OS.purple,
            fontWeight: 700,
            opacity: ctaOpacity,
            marginTop: 8,
            textShadow: `0 0 20px ${OS.purple}33`,
          }}
        >
          Construido por la fabrica. Para la fabrica.
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: 16,
            color: OS.textDim,
            opacity: footerOpacity,
            marginTop: 24,
          }}
        >
          github.com/pedro3087/mission-control-os
        </div>

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: OS.textDim,
            border: `1px solid ${OS.border}`,
            borderRadius: 6,
            padding: "6px 16px",
            opacity: badgeOpacity,
            marginTop: 8,
          }}
        >
          <span style={{ color: OS.purple }}>◆</span>
          <span>SaaS Factory OS v5.0</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
