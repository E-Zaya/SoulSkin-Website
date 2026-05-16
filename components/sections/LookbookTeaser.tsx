import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";
import type { LookbookItem } from "@/lib/db";

type Props = {
  data?: LookbookItem[];
  /** Number of preview thumbnails to show. Defaults to 4. */
  limit?: number;
};

/**
 * Compact lookbook strip used on the landing page.
 * Shows a small editorial grid of preview images and links to /lookbook.
 */
export default function LookbookTeaser({ data, limit = 4 }: Props) {
  const items = (data ?? [])
    .filter((item): item is LookbookItem & { image_url: string } =>
      Boolean(item.image_url)
    )
    .slice(0, limit);

  if (items.length === 0) return null;

  return (
    <section className="section-gap-before relative bg-void section-pad overflow-hidden">
      <div className="container-base">
        <ScrollReveal variant="fade-up">
          <div className="flex items-end justify-between gap-6 mb-8 md:mb-12">
            <div>
              <p className="text-brand-label mb-3 text-dust/70">
                {siteContent.lookbook.season}
              </p>
              <h2 className="text-brand-display display-section leading-[0.92]">
                {siteContent.lookbook.titleLine1}
                <br />
                <span className="text-dust/55">
                  {siteContent.lookbook.titleLine2}{" "}
                  {siteContent.lookbook.titleLine3}
                </span>
              </h2>
            </div>
            <Link
              href="/lookbook"
              className="cta-link cta-link-sm text-dust hover:text-bone transition-colors hidden md:inline-flex"
            >
              <span className="link-underline-grow">Full lookbook</span>
              <span>→</span>
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {items.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 80} variant="fade-up">
              <Link
                href="/lookbook"
                className="group block relative aspect-[3/4] overflow-hidden bg-ash"
                aria-label={`Lookbook — ${item.item_id}`}
              >
                <Image
                  src={item.image_url}
                  alt={`Lookbook — ${item.item_id} — Soul Skin`}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-void/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-0 left-0 right-0 font-mono text-[9px] tracking-widest pointer-events-none px-2.5 py-2 text-bone/50 group-hover:text-bone transition-colors duration-300 bg-gradient-to-t from-void/60 to-transparent opacity-0 group-hover:opacity-100">
                  {item.item_id}
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal variant="fade-up" className="mt-8 md:hidden text-center">
          <Link
            href="/lookbook"
            className="cta-link cta-link-sm text-dust hover:text-bone transition-colors"
          >
            <span className="link-underline-grow">Full lookbook</span>
            <span>→</span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
