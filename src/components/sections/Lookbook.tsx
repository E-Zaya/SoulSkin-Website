"use client";

import { useState } from "react";
import Image from "next/image";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";

export default function Lookbook() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  /** When one image is hovered, others dim. None hovered = all full. */
  const getImageOpacity = (idx: number) => {
    if (hoveredIdx === null) return 1;
    return hoveredIdx === idx ? 1 : 0.35;
  };

  return (
    <section
      id="lookbook"
      className="relative bg-void py-16 md:py-24 overflow-hidden"
    >
      {/* Section label — rotated, left edge */}
      <div
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10"
        aria-hidden="true"
      >
        <span
          className="text-brand-label"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {siteContent.lookbook.label}
        </span>
      </div>

      <div className="container-wide">
        {/* ── Asymmetric grid ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ gridTemplateRows: "auto auto" }}
        >
          {/* Col 1: Tall image — spans 2 rows, clip-up reveal */}
          <ScrollReveal
            className="md:row-span-2 relative group overflow-hidden"
            delay={0}
            variant="clip-up"
          >
            <div
              className="relative w-full h-full min-h-[500px] md:min-h-0 md:aspect-[3/4] cursor-pointer"
              onMouseEnter={() => setHoveredIdx(0)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                opacity: getImageOpacity(0),
                transition: "opacity 500ms ease-out",
              }}
            >
              <Image
                src="/lookbook-01.png"
                alt="Lookbook — Soul Skin SS25"
                fill
                className="object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
              />
              {/* Noise: top-right corner */}
              <NoiseAccent
                inset="0 0 auto auto"
                width="45%"
                height="40%"
                opacity={0.09}
                tileSize="160px"
                drift
              />
              <p className="absolute bottom-4 left-4 font-mono text-[11px] text-iron z-10 transition-opacity duration-300 group-hover:text-dust tracking-widest">
                {siteContent.lookbook.items[0].id}
              </p>
            </div>
          </ScrollReveal>

          {/* Col 2 row 1: Square image — fade-up reveal, slight offset upward */}
          <ScrollReveal
            className="relative group overflow-hidden aspect-square md:-mt-4"
            delay={200}
            variant="fade-up"
          >
            <div
              className="relative w-full h-full cursor-pointer"
              onMouseEnter={() => setHoveredIdx(1)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                opacity: getImageOpacity(1),
                transition: "opacity 500ms ease-out",
              }}
            >
              <Image
                src="/lookbook-02.png"
                alt="Lookbook — Soul Skin SS25 detail"
                fill
                className="object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
              />
              {/* Noise: bottom strip only */}
              <NoiseAccent
                inset="auto 0 0 0"
                width="100%"
                height="30%"
                opacity={0.07}
                tileSize="190px"
              />
              <p className="absolute bottom-4 right-4 font-mono text-[11px] text-iron z-10 transition-opacity duration-300 group-hover:text-dust tracking-widest">
                {siteContent.lookbook.items[1].id}
              </p>
            </div>
          </ScrollReveal>

          {/* Col 3 row 1: Text block — fade-left */}
          <ScrollReveal
            className="flex flex-col justify-end pb-6 pl-3"
            delay={350}
            variant="fade-left"
          >
            <p className="text-brand-label mb-3">
              {siteContent.lookbook.season}
            </p>
            <p className="font-sans text-[15px] text-dust leading-[1.7] max-w-[260px]">
              {siteContent.lookbook.description}
            </p>
          </ScrollReveal>

          {/* Col 2 row 2: Text block — fade-only, gives a breathing pause */}
          <ScrollReveal
            className="flex flex-col justify-start pt-6 pl-3"
            delay={300}
            variant="fade-only"
          >
            <p className="text-brand-display text-[36px] md:text-[42px] mb-2">
              {siteContent.lookbook.titleLine1}
              <br />
              {siteContent.lookbook.titleLine2}
              <br />
              {siteContent.lookbook.titleLine3}
            </p>
          </ScrollReveal>

          {/* Col 3 row 2: Offset image — clip-left, slight push down */}
          <ScrollReveal
            className="relative group overflow-hidden aspect-[3/4] md:mt-6"
            delay={400}
            variant="clip-left"
          >
            <div
              className="relative w-full h-full cursor-pointer"
              onMouseEnter={() => setHoveredIdx(2)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                opacity: getImageOpacity(2),
                transition: "opacity 500ms ease-out",
              }}
            >
              <Image
                src="/lookbook-03.png"
                alt="Lookbook — Soul Skin SS25 editorial"
                fill
                className="object-cover object-top transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
              />
              {/* Noise: left edge */}
              <NoiseAccent
                inset="0 auto 0 0"
                width="35%"
                height="100%"
                opacity={0.08}
                tileSize="175px"
              />
              <p className="absolute bottom-4 left-4 font-mono text-[11px] text-iron z-10 transition-opacity duration-300 group-hover:text-dust tracking-widest">
                {siteContent.lookbook.items[2].id}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
