import Image from "next/image";
import Link from "next/link";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";

type Props = {
  imageUrl?: string | null;
  description?: string | null;
};

/**
 * Compact about block used on the landing page.
 * Shows the brand image, a short summary and a link to /about.
 */
export default function AboutTeaser({ imageUrl, description }: Props) {
  const displayImage = imageUrl || "/about.png";
  const displayDescription =
    description || siteContent.about.descriptionFallback;

  return (
    <section id="about" className="section-gap-before relative bg-ash overflow-hidden">
      <div className="editorial-split flex flex-col md:flex-row">
        {/* Text column — on mobile comes first (order-1), image second (order-2) */}
        <div className="order-1 md:w-[44%] flex flex-col justify-center px-6 md:px-14 section-pad-editorial shrink-0">
          <ScrollReveal delay={0}>
            <div className="flex items-center gap-2.5 mb-6 md:mb-8">
              <span
                className="block h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: "var(--color-ember)" }}
                aria-hidden="true"
              />
              <p className="text-brand-label">
                {siteContent.about.label}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <p className="body-copy-md text-bone text-measure-lg mb-6 md:mb-8 line-clamp-4">
              {displayDescription}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={140}>
            <div className="flex flex-col gap-3">
              <Link
                href="/about"
                className="cta-link cta-link-sm text-dust hover:text-bone transition-colors w-fit"
              >
                <span className="link-underline-grow">{siteContent.about.cta}</span>
                <span>→</span>
              </Link>
              <p className="text-brand-label">
                {siteContent.brand.taglineShort}
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Image column */}
        <div className="order-2 relative md:w-[56%] aspect-[5/4] md:aspect-[16/10] overflow-hidden">
          <Image
            src={displayImage}
            alt="Soul Skin — Ulaanbaatar"
            fill
            sizes="(min-width: 768px) 56vw, 100vw"
            className="object-cover object-center"
          />
          <NoiseAccent
            inset="0 auto 0 0"
            width="30%"
            height="100%"
            opacity={0.06}
            tileSize="190px"
          />
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
