"use client";

import { useState } from "react";
import Image from "next/image";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";
import type { LookbookItem } from "@/lib/db";

type Props = {
  data?: LookbookItem[];
};

const FALLBACK_IMAGES = ["/lookbook-01.png", "/lookbook-02.png", "/lookbook-03.png"];

export default function Lookbook({ data }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // 最初の 3 件を使用（DB or フォールバック）
  const items = data && data.length > 0
    ? data.slice(0, 3).map((item, i) => ({
        id:  item.item_id,
        src: item.image_url ?? FALLBACK_IMAGES[i] ?? "/lookbook-01.png",
      }))
    : siteContent.lookbook.items.map((item, i) => ({
        id:  item.id,
        src: FALLBACK_IMAGES[i],
      }));

  const getImageOpacity = (idx: number) => {
    if (hoveredIdx === null) return 1;
    return hoveredIdx === idx ? 1 : 0.35;
  };

  const alts = [
    "Lookbook — Soul Skin SS25",
    "Lookbook — Soul Skin SS25 detail",
    "Lookbook — Soul Skin SS25 editorial",
  ];

  return (
    <section
      id="lookbook"
      className="relative bg-void section-pad-feature overflow-hidden"
    >
      {/* Rotated section label */}
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
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
          style={{ gridTemplateRows: "auto auto" }}
        >
          {/* Tall image */}
          <ScrollReveal
            className="md:row-span-2 relative group overflow-hidden"
            delay={0}
            variant="clip-up"
          >
            <div
              className="relative w-full h-full lookbook-tall-mobile md:min-h-0 md:aspect-[3/4] cursor-pointer"
              onMouseEnter={() => setHoveredIdx(0)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ opacity: getImageOpacity(0), transition: "opacity 500ms ease-out" }}
            >
              <Image
                src={items[0]?.src ?? FALLBACK_IMAGES[0]}
                alt={alts[0]}
                fill
                className="object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
              />
              <NoiseAccent
                inset="0 0 auto auto"
                width="45%"
                height="40%"
                opacity={0.09}
                tileSize="160px"
                drift
              />
              <p className="absolute bottom-4 left-4 font-mono text-[11px] text-iron z-10 transition-opacity duration-300 group-hover:text-dust tracking-widest">
                {items[0]?.id}
              </p>
            </div>
          </ScrollReveal>

          {/* Square image */}
          <ScrollReveal
            className="relative group overflow-hidden aspect-square md:-mt-4"
            delay={200}
            variant="fade-up"
          >
            <div
              className="relative w-full h-full cursor-pointer"
              onMouseEnter={() => setHoveredIdx(1)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ opacity: getImageOpacity(1), transition: "opacity 500ms ease-out" }}
            >
              <Image
                src={items[1]?.src ?? FALLBACK_IMAGES[1]}
                alt={alts[1]}
                fill
                className="object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
              />
              <NoiseAccent
                inset="auto 0 0 0"
                width="100%"
                height="30%"
                opacity={0.07}
                tileSize="190px"
              />
              <p className="absolute bottom-4 right-4 font-mono text-[11px] text-iron z-10 transition-opacity duration-300 group-hover:text-dust tracking-widest">
                {items[1]?.id}
              </p>
            </div>
          </ScrollReveal>

          {/* Season copy */}
          <ScrollReveal
            className="order-first md:order-none flex flex-col justify-end pb-1 md:pb-6 md:pl-3"
            delay={120}
            variant="fade-left"
          >
            <p className="text-brand-label mb-3">{siteContent.lookbook.season}</p>
            <p className="body-copy text-dust max-w-[300px] md:max-w-[260px]">
              {siteContent.lookbook.description}
            </p>
          </ScrollReveal>

          {/* Editorial title */}
          <ScrollReveal
            className="flex flex-col justify-start pt-1 md:pt-6 md:pl-3"
            delay={300}
            variant="fade-only"
          >
            <p className="text-brand-display display-lookbook mb-1 md:mb-2">
              {siteContent.lookbook.titleLine1}
              <br />
              {siteContent.lookbook.titleLine2}
              <br />
              {siteContent.lookbook.titleLine3}
            </p>
          </ScrollReveal>

          {/* Offset image */}
          <ScrollReveal
            className="relative group overflow-hidden aspect-[3/4] md:mt-6"
            delay={400}
            variant="clip-left"
          >
            <div
              className="relative w-full h-full cursor-pointer"
              onMouseEnter={() => setHoveredIdx(2)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ opacity: getImageOpacity(2), transition: "opacity 500ms ease-out" }}
            >
              <Image
                src={items[2]?.src ?? FALLBACK_IMAGES[2]}
                alt={alts[2]}
                fill
                className="object-cover object-top transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
              />
              <NoiseAccent
                inset="0 auto 0 0"
                width="35%"
                height="100%"
                opacity={0.08}
                tileSize="175px"
              />
              <p className="absolute bottom-4 left-4 font-mono text-[11px] text-iron z-10 transition-opacity duration-300 group-hover:text-dust tracking-widest">
                {items[2]?.id}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
