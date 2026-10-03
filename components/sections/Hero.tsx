"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import NoiseAccent from "@/components/ui/NoiseAccent";
import { siteContent } from "@/data/siteContent";

type Props = {
  imageUrl?: string | null;
};

const HERO_SCENE_DURATION_MS = 2000;

const HERO_SCENES = [
  {
    src: "/hero-film/soulskin-steppe-01.jpg",
    label: "Before sunrise",
    startX: "0%",
    endX: "-1.2%",
    startY: "0%",
    endY: "0.4%",
    startScale: 1.015,
    endScale: 1.06,
  },
  {
    src: "/hero-film/soulskin-steppe-02.jpg",
    label: "Through the grass",
    startX: "0.8%",
    endX: "-0.8%",
    startY: "0.3%",
    endY: "-0.2%",
    startScale: 1.04,
    endScale: 1.085,
  },
  {
    src: "/hero-film/soulskin-steppe-03.jpg",
    label: "Skin detail",
    startX: "-0.7%",
    endX: "0.45%",
    startY: "0%",
    endY: "0.2%",
    startScale: 1.055,
    endScale: 1.015,
  },
  {
    src: "/hero-film/soulskin-steppe-04.jpg",
    label: "On the ridge",
    startX: "0.5%",
    endX: "-0.45%",
    startY: "0.35%",
    endY: "-0.25%",
    startScale: 1.01,
    endScale: 1.055,
  },
  {
    src: "/hero-film/soulskin-steppe-05.jpg",
    label: "After dark",
    startX: "-0.45%",
    endX: "0.2%",
    startY: "-0.2%",
    endY: "0.2%",
    startScale: 1.05,
    endScale: 1.015,
  },
] as const;

export default function Hero({ imageUrl }: Props) {
  const [loaded, setLoaded] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [entranceKey, setEntranceKey] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const heroImage = imageUrl || HERO_SCENES[0].src;

  // Loading state — gives the hero image and title a clean first entrance.
  useEffect(() => {
    const replayEntrance = () => {
      setLoaded(false);
      setActiveScene(0);
      setEntranceKey((key) => key + 1);
      window.setTimeout(() => setLoaded(true), 80);
    };

    window.addEventListener("soulskin:brand-home", replayEntrance);
    return () => window.removeEventListener("soulskin:brand-home", replayEntrance);
  }, []);

  // Five film frames, paced as a ten-second loop. Reduced-motion users keep
  // the opening still while retaining the full Hero layout and copy.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setActiveScene((scene) => (scene + 1) % HERO_SCENES.length);
    }, HERO_SCENE_DURATION_MS);

    return () => window.clearInterval(timer);
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
      {/* Poster fallback + five-frame campaign film */}
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
          preload
          sizes="100vw"
          className="object-cover object-center"
          onLoad={() => setLoaded(true)}
        />

        {HERO_SCENES.map((scene, index) => (
          <div
            key={scene.src}
            className={`hero-film-scene absolute inset-0 ${
              index === activeScene ? "is-active" : ""
            }`}
            style={
              {
                "--hero-scene-start-x": scene.startX,
                "--hero-scene-end-x": scene.endX,
                "--hero-scene-start-y": scene.startY,
                "--hero-scene-end-y": scene.endY,
                "--hero-scene-start-scale": scene.startScale,
                "--hero-scene-end-scale": scene.endScale,
              } as CSSProperties
            }
            aria-hidden={index !== activeScene}
          >
            <Image
              src={scene.src}
              alt=""
              fill
              sizes="100vw"
              loading="eager"
              fetchPriority={index === 0 ? "high" : "auto"}
              className="hero-film-frame object-cover object-center"
              onLoad={index === 0 ? () => setLoaded(true) : undefined}
            />
          </div>
        ))}
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

      <div className="hero-film-timeline" aria-hidden="true">
        <span className="hero-film-counter">
          {String(activeScene + 1).padStart(2, "0")} / {String(HERO_SCENES.length).padStart(2, "0")}
        </span>
        <div className="flex gap-1.5">
          {HERO_SCENES.map((scene, index) => (
            <span key={scene.src} className="hero-film-tick">
              {index === activeScene && <span className="hero-film-tick-progress" />}
            </span>
          ))}
        </div>
        <span className="sr-only">{HERO_SCENES[activeScene].label}</span>
      </div>
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
