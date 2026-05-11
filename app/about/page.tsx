import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Camera as InstagramIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";
import { getSiteSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "About - Soul Skin",
  description:
    "Soul Skin is a streetwear label from Ulaanbaatar. Built for those who carry their identity on their back.",
  openGraph: {
    title: "About - Soul Skin",
    description:
      "Soul Skin is a streetwear label from Ulaanbaatar. Built for those who carry their identity on their back.",
    type: "article",
  },
};

async function safeGetSiteSettings() {
  try {
    return await getSiteSettings();
  } catch (error) {
    console.error("[about] safeGetSiteSettings", error);
    return null;
  }
}

const FACTS: Array<{ label: string; value: string }> = [
  { label: "Founded", value: "2021" },
  { label: "Studio", value: "Ulaanbaatar, MN" },
  { label: "Production", value: "Hand-finished" },
  { label: "Custom orders", value: "Open" },
];

export default async function AboutPage() {
  const settings = await safeGetSiteSettings();
  const description =
    settings?.about_description ??
    "Soul Skin is a streetwear label from Ulaanbaatar, Mongolia. Built for those who carry their identity on their back.";
  const imageUrl = settings?.about_image_url ?? null;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "var(--nav-h)" }}>
        <section className="section-pad-tight border-b border-cinder/40 bg-void">
          <div className="container-base">
            <ScrollReveal variant="fade-up">
              <p className="text-brand-label mb-4">
                {siteContent.about.label}
              </p>
              <h1 className="text-brand-display display-section">
                CHOOSE YOUR
                <br />
                SKIN.
              </h1>
            </ScrollReveal>
          </div>
        </section>

        <section className="relative overflow-hidden bg-ash">
          <div className="editorial-split flex flex-col md:flex-row">
            {imageUrl && (
              <div className="relative aspect-[5/4] overflow-hidden md:aspect-[16/12] md:w-[56%]">
                <Image
                  src={imageUrl}
                  alt="Soul Skin - Ulaanbaatar"
                  fill
                  priority
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

            <div
              className={`section-pad-editorial flex shrink-0 flex-col justify-center px-6 md:px-14 ${
                imageUrl ? "md:w-[44%]" : "md:w-full"
              }`}
            >
              <ScrollReveal delay={0}>
                <p className="text-brand-label mb-6 md:mb-8">Story</p>
              </ScrollReveal>
              <ScrollReveal delay={80}>
                <p className="body-copy-md text-measure-lg mb-6 text-bone md:mb-8">
                  {description}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={140}>
                <p className="text-brand-label">
                  {siteContent.brand.taglineShort}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="section-pad-tight border-t border-cinder/40 bg-void">
          <div className="container-base">
            <ScrollReveal variant="fade-up">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-cinder/60 pt-6 md:grid-cols-4">
                {FACTS.map((fact) => (
                  <div key={fact.label} className="flex flex-col gap-2">
                    <dt className="text-brand-label !text-iron">
                      {fact.label}
                    </dt>
                    <dd className="font-mono text-[12px] uppercase tracking-widest text-bone">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </ScrollReveal>
          </div>
        </section>

        <section className="section-pad border-t border-cinder/40 bg-void text-center">
          <div className="container-base">
            <ScrollReveal variant="fade-up">
              <p className="text-brand-label mb-5">Reach out</p>
              <Link
                href={siteContent.brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-display text-[28px] leading-none tracking-tight text-bone transition-opacity hover:opacity-70 md:text-[36px]"
              >
                <span>{siteContent.brand.handle}</span>
                <InstagramIcon size={22} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
