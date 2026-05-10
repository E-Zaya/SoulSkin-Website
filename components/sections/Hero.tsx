"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import NoiseAccent from "@/components/ui/NoiseAccent";
import { siteContent } from "@/data/siteContent";

type Props = {
  imageUrl?: string | null;
};

export default function Hero({ imageUrl }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Loading state — gives the hero image and title a clean first entrance.
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Parallax — image moves slower than scroll, disabled for reduced motion users.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.bottom > 0) setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative hero-shell w-full overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
        style={{
          opacity: loaded ? 1 : 0,
          // Subtle parallax — toned down from 0.15 to 0.08 so the image stays calm.
          transform: `translateY(${scrollY * 0.08}px) scale(1.06)`,
          willChange: "transform",
        }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Soul Skin — Wear Your Soul"
            fill
            preload
            className="object-cover object-center"
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>

      {/* Gradient overlays — keep the image visible, darken only text/bottom areas */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--overlay-hero)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--overlay-hero-bottom)" }}
      />

      {/* Noise accents */}
      <NoiseAccent
        inset="auto auto 0 0"
        width="55%"
        height="60%"
        opacity={0.07}
        tileSize="180px"
        drift
        className="z-[2]"
      />
      <NoiseAccent
        inset="0 0 auto auto"
        width="25%"
        height="30%"
        opacity={0.04}
        tileSize="220px"
      />

      {/* Hero copy */}
      <div className="absolute hero-content-position z-10">
        <p
          className="text-brand-label mb-4 md:mb-5"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateX(0)" : "translateX(-12px)",
            transition:
              "opacity 700ms cubic-bezier(0.16,1,0.3,1) 400ms, transform 700ms cubic-bezier(0.16,1,0.3,1) 400ms",
          }}
        >
          {siteContent.hero.tag}
        </p>

        <div
          className="hero-title-stack"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(28px)",
            transition:
              "opacity 900ms cubic-bezier(0.16,1,0.3,1) 600ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 600ms",
          }}
        >
          <h1
            className={`text-brand-display display-hero ${
              loaded ? "animate-hero-glitch" : ""
            }`}
          >
            {siteContent.hero.titleLine1}
            <br />
            {siteContent.hero.titleLine2}
          </h1>
          <span className="hero-title-split hero-title-split-a" aria-hidden="true">
            {siteContent.hero.titleLine1}
            <br />
            {siteContent.hero.titleLine2}
          </span>
          <span className="hero-title-split hero-title-split-b" aria-hidden="true">
            {siteContent.hero.titleLine1}
            <br />
            {siteContent.hero.titleLine2}
          </span>
        </div>

        <p
          className="mt-4 max-w-[18rem] font-sans text-[14px] leading-relaxed text-dust/80 md:mt-5 md:max-w-none md:text-[15px]"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(10px)",
            transition:
              "opacity 700ms cubic-bezier(0.16,1,0.3,1) 900ms, transform 700ms cubic-bezier(0.16,1,0.3,1) 900ms",
          }}
        >
          {siteContent.hero.subtitle}
        </p>

        {/* Accent line */}
        <div
          className="mt-4 md:mt-5 h-px bg-bone/30 origin-left"
          style={{
            width: loaded ? "120px" : "0px",
            transition: "width 1s cubic-bezier(0.16,1,0.3,1) 1.2s",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 right-6 md:bottom-12 md:right-10 z-10 flex flex-col items-center"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 700ms ease-out 1.4s",
        }}
        aria-hidden="true"
      >
        <div className="w-px h-[52px] md:h-[60px] overflow-hidden">
          <div className="w-full h-full bg-bone animate-scroll-line" />
        </div>
      </div>
    </section>
  );
}
