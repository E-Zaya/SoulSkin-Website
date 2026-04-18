import type { CSSProperties } from "react";

interface NoiseAccentProps {
  /** CSS inset shorthand — controls position */
  inset?: string;
  /** Element width */
  width?: string;
  /** Element height */
  height?: string;
  /** Opacity — keep low (0.03–0.09) */
  opacity?: number;
  /** blend mode */
  blendMode?: "overlay" | "multiply" | "screen";
  /** SVG tile size */
  tileSize?: string;
  /** Adds slow position drift animation */
  drift?: boolean;
  /** Adds slow opacity pulse animation */
  pulse?: boolean;
  /** Extra classes for z-index, etc. */
  className?: string;
}

/**
 * NoiseAccent — a precisely placed noise texture fragment.
 * Every instance must be placed with intent: never copy-paste uniformly.
 */
export default function NoiseAccent({
  inset = "0 0 0 0",
  width = "100%",
  height = "100%",
  opacity = 0.05,
  blendMode = "overlay",
  tileSize = "200px",
  drift = false,
  pulse = false,
  className = "",
}: NoiseAccentProps) {
  const style: CSSProperties = {
    position: "absolute",
    inset,
    width,
    height,
    backgroundImage: "url('/noise.svg')",
    backgroundRepeat: "repeat",
    backgroundSize: tileSize,
    opacity,
    mixBlendMode: blendMode,
    pointerEvents: "none",
    userSelect: "none",
  };

  const animClass = drift
    ? "animate-noise-drift"
    : pulse
    ? "animate-noise-pulse"
    : "";

  return (
    <div
      aria-hidden="true"
      className={`${animClass} ${className}`}
      style={style}
    />
  );
}
