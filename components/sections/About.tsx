import Image from "next/image";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";
import { DEFAULT_IMAGES } from "@/lib/images";

type Props = {
  imageUrl?: string | null;
  description?: string | null;
};

export default function About({ imageUrl, description }: Props) {
  const aboutImage = imageUrl || siteContent.about.image || DEFAULT_IMAGES.about;
  const aboutDescription = description || siteContent.about.description;
  return (
    <section id="about" className="relative bg-ash overflow-hidden">
      <div className="container-base flex flex-col md:flex-row !px-0">
        {/* Text column */}
        <div className="md:w-[40%] flex flex-col justify-center px-6 md:px-16 py-10 md:py-24 shrink-0">
          <ScrollReveal delay={0}>
            <p className="text-brand-label mb-6 md:mb-8">
              {siteContent.about.label}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <p className="body-copy-md text-bone max-w-[380px] mb-6 md:mb-8">
              {aboutDescription}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={140}>
            <p className="text-brand-label">{siteContent.brand.taglineShort}</p>
          </ScrollReveal>
        </div>

        {/* Image column */}
        <div className="relative md:w-[60%] aspect-[4/5] md:aspect-auto overflow-hidden">
          <Image
            src={aboutImage}
            alt="Soul Skin — Ulaanbaatar"
            fill
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
