"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";

export default function CustomOrder() {
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
      className="relative overflow-hidden section-pad transition-colors duration-700"
      style={{
        backgroundColor: visible ? "var(--color-ember)" : "var(--color-void)",
      }}
    >
      {/* Noise accents */}
      <NoiseAccent
        inset="0 0 0 0"
        width="100%"
        height="100%"
        opacity={0.09}
        blendMode="multiply"
        tileSize="180px"
        pulse
      />
      <NoiseAccent
        inset="0 0 auto auto"
        width="50%"
        height="50%"
        opacity={0.06}
        blendMode="multiply"
        tileSize="140px"
      />

      <div className="relative z-10 container-base text-center">
        {/* Accent line */}
        <div
          className="mx-auto mb-8 md:mb-10 h-px bg-void/30 origin-center"
          style={{
            width: visible ? "80px" : "0px",
            transition: "width 800ms cubic-bezier(0.16,1,0.3,1) 200ms",
          }}
          aria-hidden="true"
        />

        {/* CTA title */}
        <ScrollReveal variant="fade-up">
          <h2 className="text-brand-display display-cta text-void mb-6 md:mb-8">
            {siteContent.customOrder.titleLine1}
            <br />
            {siteContent.customOrder.titleLine2}
          </h2>
        </ScrollReveal>

        {/* CTA copy */}
        <ScrollReveal delay={120} variant="fade-only">
          <p className="body-copy md:body-copy-md mb-10 md:mb-14 max-w-[420px] mx-auto text-void/65">
            {siteContent.customOrder.description}
          </p>
        </ScrollReveal>

        {/* CTA button */}
        <ScrollReveal delay={200} variant="fade-up">
          <Link
            href={siteContent.brand.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group btn-hover-fill cta-button"
          >
            <span className="transition-colors duration-300 group-hover:text-void">
              {siteContent.customOrder.cta}
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
