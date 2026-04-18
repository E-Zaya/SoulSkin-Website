import Image from "next/image";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";

export default function About() {
  return (
    <section id="about" className="relative bg-ash overflow-hidden">
      <div className="container-base flex flex-col md:flex-row !px-0">

        {/* ── Left: Text (40%) ── */}
        <div className="md:w-[40%] flex flex-col justify-center px-6 md:px-16 py-16 md:py-24 shrink-0">
          <ScrollReveal delay={0}>
            <p className="text-brand-label mb-8">
              {siteContent.about.label}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <p className="font-sans text-[16px] text-bone leading-[1.7] max-w-[380px] mb-8">
              {siteContent.about.description}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={140}>
            <p className="text-brand-label">
              {siteContent.brand.taglineShort}
            </p>
          </ScrollReveal>
        </div>

        {/* ── Right: Image (60%) ── */}
        <div className="relative md:w-[60%] aspect-[4/5] md:aspect-auto overflow-hidden">
          <Image
            src="/lookbook-03.png"
            alt="Soul Skin — Ulaanbaatar"
            fill
            className="object-cover object-center"
          />
          {/* Noise — left edge where it meets the text column */}
          <NoiseAccent
            inset="0 auto 0 0"
            width="30%"
            height="100%"
            opacity={0.06}
            tileSize="190px"
          />
          {/* Noise — bottom-right corner, barely visible */}
          <NoiseAccent
            inset="auto 0 0 auto"
            width="40%"
            height="35%"
            opacity={0.04}
            tileSize="210px"
          />
        </div>
      </div>
    </section>
  );
}
