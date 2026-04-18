"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import NoiseAccent from "@/components/ui/NoiseAccent";
import { siteContent } from "@/data/siteContent";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Subtle parallax — image moves slower than scroll
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const onScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-[100dvh] w-full overflow-hidden"
    >
      {/* Background image — parallax: moves at 0.3x scroll speed */}
      <div
        className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
        style={{
          opacity: loaded ? 1 : 0,
          transform: `translateY(${scrollY * 0.15}px) scale(1.08)`,
          willChange: "transform",
        }}
      >
        <Image
          src="/hero.png"
          alt="Soul Skin — Wear Your Soul"
          fill
          priority
          className="object-cover object-center"
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,9,8,0.3) 0%, transparent 30%, transparent 40%, #0A0908 100%)",
        }}
      />

      {/* Noise — bottom-left, drifts */}
      <NoiseAccent
        inset="auto auto 0 0"
        width="55%"
        height="60%"
        opacity={0.07}
        tileSize="180px"
        drift
        className="z-[2]"
      />

      {/* Noise — top-right corner */}
      <NoiseAccent
        inset="0 0 auto auto"
        width="25%"
        height="30%"
        opacity={0.04}
        tileSize="220px"
      />

      {/* Content — bottom-left */}
      <div className="absolute bottom-12 left-6 md:bottom-20 md:left-10 z-10">
        {/* Tag — slides in from left */}
        <p
          className="text-brand-label mb-5"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateX(0)" : "translateX(-12px)",
            transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1) 400ms, transform 700ms cubic-bezier(0.16,1,0.3,1) 400ms",
          }}
        >
          {siteContent.hero.tag}
        </p>

        {/* Main headline — heavier, with one-shot micro-glitch */}
        <h1
          className={`text-brand-display text-[76px] md:text-[130px] xl:text-[170px] tracking-[var(--tracking-brand-tight)] ${
            loaded ? "animate-hero-glitch" : ""
          }`}
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(28px)",
            transition:
              "opacity 900ms cubic-bezier(0.16,1,0.3,1) 600ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 600ms",
            textShadow: "0 2px 30px rgba(10,9,8,0.4)",
          }}
        >
          {siteContent.hero.titleLine1}
          <br />
          {siteContent.hero.titleLine2}
        </h1>

        {/* Thin horizontal accent line under the title */}
        <div
          className="mt-5 h-px bg-bone/30 origin-left"
          style={{
            width: loaded ? "120px" : "0px",
            transition: "width 1s cubic-bezier(0.16,1,0.3,1) 1.2s",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-12 right-6 md:right-10 z-10 flex flex-col items-center"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 700ms ease-out 1.4s",
        }}
        aria-hidden="true"
      >
        <div className="w-px h-[60px] overflow-hidden">
          <div
            className="w-full bg-bone animate-scroll-line"
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </section>
  );
}
