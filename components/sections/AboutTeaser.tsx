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
  const hasContent = Boolean(imageUrl || description);
  if (!hasContent) return null;

  return (
    <section id="about" className="section-gap-before relative bg-ash overflow-hidden">
      <div className="editorial-split flex flex-col md:flex-row">
        {/* Text column */}
        <div className="md:w-[44%] flex flex-col justify-center px-6 md:px-14 section-pad-editorial shrink-0">
          <ScrollReveal delay={0}>
            <p className="text-brand-label mb-6 md:mb-8">
              {siteContent.about.label}
            </p>
          </ScrollReveal>

          {description && (
            <ScrollReveal delay={80}>
              <p className="body-copy-md text-bone text-measure-lg mb-6 md:mb-8 line-clamp-4">
                {description}
              </p>
            </ScrollReveal>
          )}

          <ScrollReveal delay={140}>
            <div className="flex flex-col gap-3">
              <Link
                href="/about"
                className="cta-link cta-link-sm text-dust hover:text-bone transition-colors w-fit"
              >
                <span className="link-underline-grow">Read more</span>
                <span>→</span>
              </Link>
              <p className="text-brand-label">
                {siteContent.brand.taglineShort}
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Image column */}
        {imageUrl && (
          <div className="relative md:w-[56%] aspect-[5/4] md:aspect-[16/10] overflow-hidden">
            <Image
              src={imageUrl}
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
        )}
      </div>
    </section>
  );
}
