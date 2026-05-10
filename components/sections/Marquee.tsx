import NoiseAccent from "@/components/ui/NoiseAccent";

interface MarqueeProps {
  /** The text to repeat. Should end naturally for looping. */
  text: string;
  /** Which border edge gets noise — top or bottom, not both */
  noiseSide?: "top" | "bottom" | "none";
}

export default function Marquee({
  text,
  noiseSide = "none",
}: MarqueeProps) {
  // Repeat enough times so the -50% translate always looks seamless
  const items = Array(12).fill(text);

  return (
    <div className="section-gap-before relative border-t border-b border-cinder h-10 overflow-hidden flex items-center">
      {/* Noise — only on one side, creates a boundary-glitch feel */}
      {noiseSide === "top" && (
        <NoiseAccent
          inset="0 0 auto 0"
          width="100%"
          height="24px"
          opacity={0.06}
          tileSize="160px"
        />
      )}
      {noiseSide === "bottom" && (
        <NoiseAccent
          inset="auto 0 0 0"
          width="70%"
          height="20px"
          opacity={0.05}
          tileSize="160px"
        />
      )}

      {/* Scrolling text — two identical halves so -50% loops perfectly */}
      <div
        className="animate-marquee flex whitespace-nowrap select-none"
        aria-hidden="true"
      >
        {items.map((t, i) => (
          <span
            key={i}
            className="font-display text-[12px] text-iron/70 tracking-normal mr-8 shrink-0"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
