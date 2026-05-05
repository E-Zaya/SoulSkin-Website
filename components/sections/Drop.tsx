import Image from "next/image";
import Link from "next/link";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";
import type { Drop as DropData } from "@/lib/db";

type Props = {
  data?: DropData | null;
};

export default function Drop({ data }: Props) {
  // DB データがあればそちらを使い、なければ siteContent にフォールバック
  const label       = data?.label       ?? siteContent.drop.label;
  const titleLine1  = data?.title_line1 ?? siteContent.drop.titleLine1;
  const titleLine2  = data?.title_line2 ?? siteContent.drop.titleLine2;
  const description = data?.description ?? siteContent.drop.description;
  const piecesLeft  = data
    ? `PIECES LEFT: ${String(data.pieces_left).padStart(2, "0")}`
    : siteContent.drop.piecesLeft;
  const cta         = data?.cta         ?? siteContent.drop.cta;
  const imageSrc    = data?.image_url   ?? "/lookbook-01.png";

  return (
    <section id="drop" className="relative bg-ash overflow-hidden">
      <div className="container-base flex flex-col md:flex-row !px-0">
        {/* Image column */}
        <div className="relative md:w-[60%] aspect-[3/4] shrink-0 overflow-hidden">
          <Image
            src={imageSrc}
            alt={`${titleLine1} ${titleLine2} — Soul Skin Drop`}
            fill
            className="object-cover object-center"
          />

          {/* Noise accents */}
          <NoiseAccent
            inset="0 0 0 auto"
            width="30%"
            height="100%"
            opacity={0.08}
            tileSize="170px"
            blendMode="overlay"
          />
          <NoiseAccent
            inset="auto auto 0 0"
            width="40%"
            height="35%"
            opacity={0.05}
            tileSize="200px"
          />
        </div>

        {/* Text column */}
        <div className="relative md:w-[40%] flex flex-col justify-center px-6 md:px-16 py-10 md:py-24">
          <ScrollReveal delay={0}>
            <p className="text-brand-label mb-5 md:mb-6 text-ember">{label}</p>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h2 className="text-brand-display display-section mb-5 md:mb-6">
              {titleLine1}
              <br />
              {titleLine2}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="body-copy text-dust mb-7 md:mb-8 max-w-[320px]">
              {description}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="flex items-center gap-4 mb-8 md:mb-10">
              <span className="h-px bg-iron/40 w-12" />
              <p className="text-brand-label !text-ember !font-bold">{piecesLeft}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <Link
              href={siteContent.brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[13px] font-medium text-bone uppercase tracking-widest inline-flex items-center gap-2 group"
            >
              <span className="link-underline-grow">{cta}</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
