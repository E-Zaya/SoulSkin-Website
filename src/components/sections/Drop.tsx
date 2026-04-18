import Image from "next/image";
import Link from "next/link";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";

export default function Drop() {
  return (
    <section id="drop" className="relative bg-ash overflow-hidden">
      <div className="container-base flex flex-col md:flex-row !px-0">

        {/* ── Left: Image (60%) ── */}
        <div className="relative md:w-[60%] aspect-[3/4] shrink-0 overflow-hidden">
          <Image
            src="/lookbook-01.png"
            alt="Void Series 001 — Soul Skin Drop"
            fill
            className="object-cover object-center"
          />
          {/* Noise: right edge of the image — where image meets text */}
          <NoiseAccent
            inset="0 0 0 auto"
            width="30%"
            height="100%"
            opacity={0.08}
            tileSize="170px"
            blendMode="overlay"
          />
          {/* Noise: bottom-left corner of image — organic, not centered */}
          <NoiseAccent
            inset="auto auto 0 0"
            width="40%"
            height="35%"
            opacity={0.05}
            tileSize="200px"
          />
        </div>

        {/* ── Right: Text (40%) ── */}
        <div className="relative md:w-[40%] flex flex-col justify-center px-8 md:px-16 py-16 md:py-24">
          <ScrollReveal delay={0}>
            <p className="text-brand-label mb-6 text-ember">
              {siteContent.drop.label}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h2 className="text-brand-display text-[56px] md:text-[72px] mb-6">
              {siteContent.drop.titleLine1}
              <br />
              {siteContent.drop.titleLine2}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="font-sans text-[15px] text-dust leading-[1.7] mb-8 max-w-[320px]">
              {siteContent.drop.description}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="flex items-center gap-4 mb-10">
              <span className="h-px bg-iron/40 w-12" />
              <p className="text-brand-label !text-ember !font-bold">
                {siteContent.drop.piecesLeft}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <Link
              href={siteContent.brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[13px] font-medium text-bone uppercase tracking-widest inline-flex items-center gap-2 group"
            >
              <span className="link-underline-grow">
                {siteContent.drop.cta}
              </span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
