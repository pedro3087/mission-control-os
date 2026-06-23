import React from "react";
import { AbsoluteFill } from "remotion";

export const ScanlineOverlay: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      pointerEvents: "none",
      zIndex: 9999,
    }}
  />
);
