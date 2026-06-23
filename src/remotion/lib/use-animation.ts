import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export function useTypewriter(text: string, startFrame: number, charsPerFrame = 0.5) {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const visibleChars = Math.min(Math.floor(elapsed * charsPerFrame), text.length);
  const isTyping = visibleChars < text.length;
  const showCursor = isTyping || Math.floor(frame / 15) % 2 === 0;
  return { visibleText: text.slice(0, visibleChars), showCursor, isComplete: !isTyping };
}

export function useFadeIn(startFrame: number, duration = 20) {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function useSlideIn(startFrame: number, from = 50) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: Math.max(0, frame - startFrame), fps, config: { damping: 12 } });
  return {
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [from, 0])}px)`,
  };
}

export function useSlideInX(startFrame: number, from = 100) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: Math.max(0, frame - startFrame), fps, config: { damping: 14 } });
  return {
    opacity: progress,
    transform: `translateX(${interpolate(progress, [0, 1], [from, 0])}px)`,
  };
}

export function useCountUp(startFrame: number, endFrame: number, target: number) {
  const frame = useCurrentFrame();
  const raw = interpolate(frame, [startFrame, endFrame], [0, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.round(raw * 10) / 10;
}

export function useSpring(startFrame: number, config = { damping: 12, stiffness: 120 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: Math.max(0, frame - startFrame), fps, config });
}
