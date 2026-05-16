"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NoiseAccent from "@/components/ui/NoiseAccent";
import { siteContent } from "@/data/siteContent";

type Props = {
  imageUrl?: string | null;
};

export default function Hero({ imageUrl }: Props) {
  const [loaded, setLoaded] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [entranceKey, setEntranceKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const heroImage = imageUrl || "/hero2.png";

  // Loading state — gives the hero image and title a clean first entrance.
  useEffect(() => {
    const replayEntrance = () => {
      setLoaded(false);
      setEntranceKey((key) => key + 1);
      window.setTimeout(() => setLoaded(true), 80);
    };

    window.addEventListener("soulskin:brand-home", replayEntrance);
    return () => window.removeEventListener("soulskin:brand-home", replayEntrance);
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
        <Image
          src={heroImage}
          alt="Soul Skin — Wear Your Soul"
          fill
          priority
          className="object-cover object-center"
          onLoad={() => setLoaded(true)}
        />
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
        inset="auto 0 0 auto"
        width="35%"
        height="45%"
        opacity={0.05}
        tileSize="200px"
        className="z-[2]"
      />

      {/* Hero copy */}
      <div key={entranceKey} className="absolute hero-content-position z-10 max-w-[58%] md:max-w-none">
        <p
          className="mb-4 font-mono text-[10px] uppercase tracking-[0.32em] text-bone/28 md:mb-5 md:text-[11px]"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateX(0)" : "translateX(-12px)",
            transition:
              "opacity 700ms cubic-bezier(0.16,1,0.3,1) 360ms, transform 700ms cubic-bezier(0.16,1,0.3,1) 360ms",
          }}
        >
          {siteContent.hero.tag.toUpperCase()}
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
          <h1 className="text-brand-display text-[4.75rem] leading-[0.86] tracking-normal [text-shadow:var(--shadow-hero-title)] md:text-[6.5rem] lg:text-[8rem] xl:text-[7.75rem]">
            {siteContent.hero.titleLine1}
            <br />
            {siteContent.hero.titleLine2}
          </h1>
        </div>

        <div
          className="mt-5 flex flex-col items-start gap-2 md:mt-6 md:flex-row md:flex-wrap md:items-center md:gap-3"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(10px)",
            transition:
              "opacity 700ms cubic-bezier(0.16,1,0.3,1) 780ms, transform 700ms cubic-bezier(0.16,1,0.3,1) 780ms",
          }}
        >
          <Link
            href="/drops"
            className="inline-flex min-h-11 items-center border border-bone/60 bg-bone px-5 font-mono text-[10px] uppercase tracking-[0.22em] text-void transition-colors hover:bg-transparent hover:text-bone"
          >
            {siteContent.hero.ctaPrimary}
          </Link>
          <Link
            href="/lookbook"
            className="inline-flex min-h-11 items-center border border-bone/25 px-5 font-mono text-[10px] uppercase tracking-[0.22em] text-bone transition-colors hover:border-bone/60"
          >
            {siteContent.hero.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
