"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";

type Props = {
  variant?: "default" | "drop";
};

export default function CustomOrder({ variant = "default" }: Props) {
  const content =
    variant === "drop"
      ? siteContent.customOrder.dropVariant
      : siteContent.customOrder;
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Detect section visibility — triggers the ember color change.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-gap-before relative overflow-hidden section-pad transition-colors duration-700"
      style={{ backgroundColor: "var(--cta-bg)" }}
    >
      {/* Noise accents */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ backgroundColor: "var(--cta-accent-soft)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ backgroundColor: "var(--cta-accent-faint)" }}
        aria-hidden="true"
      />
      <NoiseAccent
        inset="0 0 0 0"
        width="100%"
        height="100%"
        opacity={0.045}
        blendMode="overlay"
        tileSize="180px"
        pulse
      />
      <NoiseAccent
        inset="0 0 auto auto"
        width="50%"
        height="50%"
        opacity={0.035}
        blendMode="overlay"
        tileSize="140px"
      />

      <div className="relative z-10 container-base text-center">
        {/* Accent line */}
        <div
          className="mx-auto mb-7 md:mb-8 h-px origin-center"
          style={{
            width: visible ? "84px" : "0px",
            backgroundColor: "var(--cta-accent)",
            transition: "width 800ms cubic-bezier(0.16,1,0.3,1) 200ms",
          }}
          aria-hidden="true"
        />

        {/* CTA title */}
        <ScrollReveal variant="fade-up">
          <h2 className="text-brand-display display-cta text-bone mb-5 md:mb-6">
            {content.titleLine1}
            <br />
            {content.titleLine2}
          </h2>
        </ScrollReveal>

        {/* CTA copy */}
        <ScrollReveal delay={120} variant="fade-only">
          <p className="body-copy md:body-copy-md mb-8 md:mb-10 max-w-[420px] mx-auto text-dust/70">
            {content.description}
          </p>
        </ScrollReveal>

        {/* CTA button — leads to /custom which holds Instagram + email actions */}
        <ScrollReveal delay={200} variant="fade-up">
          <Link
            href="/custom"
            className="group btn-hover-fill cta-button border border-[color:var(--cta-accent-soft)]"
          >
            <span className="transition-colors duration-300 group-hover:text-void">
              {content.cta}
            </span>
            <span className="text-[16px] transition-all duration-300 group-hover:text-void group-hover:translate-x-1">
              →
            </span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
