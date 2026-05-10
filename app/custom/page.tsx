import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "Custom Order — Soul Skin",
  description:
    "Bring us your idea. Every Soul Skin piece can be made one-of-one — sketch, fit, and finish, all from Ulaanbaatar.",
  openGraph: {
    title: "Custom Order — Soul Skin",
    description:
      "Bring us your idea. Every Soul Skin piece can be made one-of-one — sketch, fit, and finish, all from Ulaanbaatar.",
    type: "article",
  },
};

const PROCESS_STEPS: Array<{ no: string; title: string; body: string }> = [
  {
    no: "01",
    title: "Reach out",
    body: "DM us on Instagram or send an email. Tell us what you have in mind — references, sketches, anything.",
  },
  {
    no: "02",
    title: "Sketch & quote",
    body: "We come back within 48h with a rough sketch, material plan, lead time, and a quote.",
  },
  {
    no: "03",
    title: "Build",
    body: "We build it in our Ulaanbaatar studio. 3–4 weeks typical lead time. Ships worldwide.",
  },
];

export default function CustomOrderPage() {
  const { brand } = siteContent;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "var(--nav-h)" }}>
        {/* Hero */}
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
          <div className="relative z-10 container-base text-center">
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
              <p className="body-copy md:body-copy-md mt-7 max-w-[460px] mx-auto text-dust/75">
                Every Soul Skin piece can be made one-of-one. Tell us what you
                want — fabric, fit, story — and we build it with you.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Process */}
        <section className="bg-void section-pad border-t border-cinder/40">
          <div className="container-base">
            <ScrollReveal variant="fade-up">
              <div className="flex items-center gap-5 mb-10 md:mb-14">
                <span className="text-brand-label !text-iron">Process</span>
                <span className="h-px bg-iron/30 flex-1" />
                <span className="font-mono text-[11px] text-iron/50 tracking-widest">
                  3 STEPS
                </span>
              </div>
            </ScrollReveal>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {PROCESS_STEPS.map((step, i) => (
                <ScrollReveal key={step.no} delay={i * 120} variant="fade-up">
                  <li className="flex flex-col gap-3 md:gap-4 border-t border-cinder/60 pt-5 md:pt-6">
                    <span className="font-mono text-[11px] text-ember tracking-widest">
                      {step.no}
                    </span>
                    <h2 className="font-display text-bone text-[24px] md:text-[28px] leading-none tracking-tight">
                      {step.title}
                    </h2>
                    <p className="body-copy text-dust/80">{step.body}</p>
                  </li>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Lead time strip */}
        <section className="bg-ash border-t border-b border-cinder/60">
          <div className="container-base py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-4">
              <span className="text-brand-label !text-iron">Lead time</span>
              <span className="font-mono text-[12px] text-bone tracking-widest uppercase">
                3–4 weeks · Ships worldwide
              </span>
            </div>
            <span className="font-mono text-[10px] text-iron/60 tracking-widest uppercase">
              Reply within 48h
            </span>
          </div>
        </section>

        {/* CTA */}
        <section
          className="relative overflow-hidden section-pad"
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
          <div className="relative z-10 container-base text-center">
            <ScrollReveal variant="fade-up">
              <p className="text-brand-label mb-5">Start</p>
            </ScrollReveal>
            <ScrollReveal delay={80} variant="fade-up">
              <h2 className="text-brand-display display-section text-bone mb-8">
                READY WHEN YOU ARE.
              </h2>
            </ScrollReveal>
            <ScrollReveal
              delay={160}
              variant="fade-only"
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group btn-hover-fill cta-button border border-[color:var(--cta-accent-soft)] w-full sm:w-auto justify-center"
              >
                <span className="transition-colors duration-300 group-hover:text-void">
                  Start on Instagram
                </span>
                <span className="text-[16px] transition-all duration-300 group-hover:text-void group-hover:translate-x-1">
                  →
                </span>
              </Link>
              {brand.email && (
                <Link
                  href={`mailto:${brand.email}?subject=Soul%20Skin%20Custom%20Order`}
                  className="inline-flex items-center justify-center gap-2 border border-cinder px-6 py-4 font-mono text-[11px] tracking-widest uppercase text-dust hover:text-bone hover:border-iron transition-colors w-full sm:w-auto"
                >
                  <span>Email us</span>
                  <span>→</span>
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
