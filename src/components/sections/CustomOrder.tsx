"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";

export default function CustomOrder() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Detect when section enters viewport for the air-change effect
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
      className="relative overflow-hidden py-16 md:py-20 transition-colors duration-700"
      style={{
        backgroundColor: visible ? "#C8431A" : "#0A0908",
      }}
    >
      {/* Noise — multiply on ember. Worn poster feel. */}
      <NoiseAccent
        inset="0 0 0 0"
        width="100%"
        height="100%"
        opacity={0.09}
        blendMode="multiply"
        tileSize="180px"
        pulse
      />
      {/* Secondary noise — top-right corner */}
      <NoiseAccent
        inset="0 0 auto auto"
        width="50%"
        height="50%"
        opacity={0.06}
        blendMode="multiply"
        tileSize="140px"
      />

      <div className="relative z-10 container-base text-center">

        {/* Horizontal accent line — expands when section appears */}
        <div
          className="mx-auto mb-10 h-px bg-void/30 origin-center"
          style={{
            width: visible ? "80px" : "0px",
            transition: "width 800ms cubic-bezier(0.16,1,0.3,1) 200ms",
          }}
          aria-hidden="true"
        />

        <ScrollReveal variant="fade-up">
          <h2 className="text-brand-display text-[72px] md:text-[96px] xl:text-[120px] text-void mb-8">
            {siteContent.customOrder.titleLine1}
            <br />
            {siteContent.customOrder.titleLine2}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={120} variant="fade-only">
          <p
            className="font-sans text-[16px] leading-[1.7] mb-14 max-w-[420px] mx-auto text-void/65"
          >
            {siteContent.customOrder.description}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200} variant="fade-up">
          <Link
            href={siteContent.brand.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group btn-hover-fill bg-void text-bone font-sans text-[14px] font-semibold tracking-widest uppercase px-12 py-5"
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
