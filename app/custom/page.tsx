import type { Metadata } from "next";
import Link from "next/link";
import { Camera as InstagramIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "Custom Order",
  description:
    "Bring us your idea. Every Soul Skin piece can be made one-of-one — sketch, fit, and finish, all from Ulaanbaatar.",
  alternates: { canonical: "/custom" },
  openGraph: {
    title: "Custom Order — Soul Skin",
    description:
      "Bring us your idea. Every Soul Skin piece can be made one-of-one — sketch, fit, and finish, all from Ulaanbaatar.",
    type: "article",
    url: "/custom",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Soul Skin Custom Order" }],
  },
};

const PROCESS_STEPS: Array<{ no: string; title: string; body: string }> = [
  {
    no: "01",
    title: "Reach out",
    body: "DM us on Instagram or send an email. Tell us what you have in mind - references, sketches, anything.",
  },
  {
    no: "02",
    title: "Sketch & quote",
    body: "We come back within 48h with a rough sketch, material plan, lead time, and a quote.",
  },
  {
    no: "03",
    title: "Build",
    body: "We build it in our Ulaanbaatar studio. 3-4 weeks typical lead time.",
  },
];

export default function CustomOrderPage() {
  const { brand } = siteContent;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "var(--nav-h)" }}>
        <section
          className="relative overflow-hidden section-pad-feature"
          style={{ backgroundColor: "var(--cta-bg)" }}
        >
          <NoiseAccent
            inset="0 0 0 0"
            width="100%"
            height="100%"
            opacity={0.04}
            blendMode="overlay"
            tileSize="180px"
            pulse
          />
          <div className="container-base relative z-10 text-center">
            <ScrollReveal variant="fade-up">
              <p className="text-brand-label mb-6">Custom Order</p>
            </ScrollReveal>
            <ScrollReveal delay={80} variant="fade-up">
              <h1 className="text-brand-display display-cta text-bone">
                BRING US
                <br />
                YOUR IDEA
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={160} variant="fade-only">
              <p className="body-copy mx-auto mt-7 max-w-[460px] text-dust/75 md:body-copy-md">
                Every Soul Skin piece can be made one-of-one. Tell us what you
                want - fabric, fit, story - and we build it with you.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="section-pad border-t border-cinder/40 bg-void">
          <div className="container-base">
            <ScrollReveal variant="fade-up">
              <div className="mb-10 flex items-center gap-5 md:mb-14">
                <span className="text-brand-label !text-iron">Process</span>
                <span className="h-px flex-1 bg-iron/30" />
                <span className="font-mono text-[11px] tracking-widest text-iron/50">
                  3 STEPS
                </span>
              </div>
            </ScrollReveal>
            <ol className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
              {PROCESS_STEPS.map((step, i) => (
                <ScrollReveal key={step.no} delay={i * 120} variant="fade-up">
                  <li className="flex flex-col gap-3 border-t border-cinder/60 pt-5 md:gap-4 md:pt-6">
                    <span className="font-mono text-[11px] tracking-widest text-ember">
                      {step.no}
                    </span>
                    <h2 className="font-display text-[24px] leading-none tracking-tight text-bone md:text-[28px]">
                      {step.title}
                    </h2>
                    <p className="body-copy text-dust/80">{step.body}</p>
                  </li>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-cinder/60 bg-ash">
          <div className="container-base flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="text-brand-label !text-iron">Lead time</span>
              <span className="font-mono text-[12px] uppercase tracking-widest text-bone">
                3-4 weeks
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-iron/60">
              Reply within 48h
            </span>
          </div>
        </section>

        <section
          className="section-pad relative overflow-hidden"
          style={{ backgroundColor: "var(--cta-bg)" }}
        >
          <NoiseAccent
            inset="0 0 0 0"
            width="100%"
            height="100%"
            opacity={0.035}
            blendMode="overlay"
            tileSize="180px"
          />
          <div className="container-base relative z-10 text-center">
            <ScrollReveal variant="fade-up">
              <p className="text-brand-label mb-5">Start</p>
            </ScrollReveal>
            <ScrollReveal delay={80} variant="fade-up">
              <h2 className="text-brand-display display-section mb-8 text-bone">
                READY WHEN YOU ARE.
              </h2>
            </ScrollReveal>
            <ScrollReveal
              delay={160}
              variant="fade-only"
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group btn-hover-fill cta-button w-full justify-center border border-[color:var(--cta-accent-soft)] sm:w-auto"
              >
                <span className="transition-colors duration-300 group-hover:text-void">
                  Start on Instagram
                </span>
                <InstagramIcon
                  size={16}
                  strokeWidth={1.6}
                  className="transition-all duration-300 group-hover:translate-x-1 group-hover:text-void"
                  aria-hidden="true"
                />
              </Link>
              {brand.email && (
                <Link
                  href={`mailto:${brand.email}?subject=Soul%20Skin%20Custom%20Order`}
                  className="inline-flex w-full items-center justify-center gap-2 border border-cinder px-6 py-4 font-mono text-[11px] uppercase tracking-widest text-dust transition-colors hover:border-iron hover:text-bone sm:w-auto"
                >
                  <span>Email us</span>
                  <span aria-hidden="true">-&gt;</span>
                </Link>
              )}
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
