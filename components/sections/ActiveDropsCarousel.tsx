"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { Drop } from "@/lib/db";
import { toSlug } from "@/lib/slug";

type Props = { drops: Drop[] };

const AUTO_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD_PX = 50;

/**
 * /drops ページ上部の Active Drops を見せるカルーセル。
 * ホームの <Drop /> と同じインタラクション (5秒自動 / ホバー停止 / 矢印 / ドット / スワイプ) を持つが、
 * デザインは「View this drop へリンクするフィーチャーカード」スタイル。
 */
export default function ActiveDropsCarousel({ drops }: Props) {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (drops.length > 0 && active >= drops.length) setActive(0);
  }, [drops.length, active]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (drops.length <= 1 || isHovered || reduceMotion) return;
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % drops.length),
      AUTO_INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, [drops.length, isHovered, reduceMotion]);

  if (drops.length === 0) return null;

  const next = () => setActive((a) => (a + 1) % drops.length);
  const prev = () => setActive((a) => (a - 1 + drops.length) % drops.length);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || drops.length <= 1) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  }

  const hasMultiple = drops.length > 1;

  return (
    <section
      className="group relative overflow-hidden bg-ash"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription={hasMultiple ? "carousel" : undefined}
    >
      {/* スライドを grid stacking で重ねる */}
      <div className="relative grid" style={{ gridTemplateAreas: '"slide"' }}>
        {drops.map((d, i) => {
          const slug = toSlug(d.label);
          return (
            <div
              key={d.id}
              className="transition-opacity duration-500"
              style={{
                gridArea: "slide",
                opacity: i === active ? 1 : 0,
                pointerEvents: i === active ? "auto" : "none",
                visibility: i === active ? "visible" : "hidden",
              }}
              aria-hidden={i !== active}
              role={hasMultiple ? "group" : undefined}
              aria-roledescription={hasMultiple ? "slide" : undefined}
              aria-label={hasMultiple ? `${i + 1} of ${drops.length}` : undefined}
            >
              <div className="editorial-split flex flex-col md:flex-row">
                <Link
                  href={`/drops/${slug}`}
                  className="group/image relative block aspect-[4/5] shrink-0 overflow-hidden md:aspect-[16/13] md:w-[64%]"
                >
                  {d.image_url && (
                    <Image
                      src={d.image_url}
                      alt={`${d.title_line1} ${d.title_line2} — Soul Skin Drop`}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 768px) 64vw, 100vw"
                      className="object-cover object-center transition-transform duration-[800ms] ease-out group-hover/image:scale-[1.03]"
                    />
                  )}
                </Link>

                <div className="section-pad-editorial relative flex flex-col justify-center px-6 md:w-[36%] md:px-12 lg:px-14">
                  <ScrollReveal delay={0}>
                    <p className="text-brand-label mb-5 flex items-center gap-2.5">
                      <span className="text-ember">{d.label}</span>
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "var(--color-rust)" }}
                        aria-hidden="true"
                      />
                      <span style={{ color: "var(--color-rust)" }}>LIVE</span>
                    </p>
                  </ScrollReveal>
                  <ScrollReveal delay={80}>
                    <h2 className="text-brand-display display-section mb-5">
                      {d.title_line1}
                      <br />
                      {d.title_line2}
                    </h2>
                  </ScrollReveal>
                  <ScrollReveal delay={160}>
                    <p className="body-copy text-measure-sm mb-7 text-dust">
                      {d.description}
                    </p>
                  </ScrollReveal>
                  <ScrollReveal delay={240}>
                    <Link href={`/drops/${slug}`} className="cta-link group/cta">
                      <span className="link-underline-grow">View this drop</span>
                      <span className="transition-transform duration-200 group-hover/cta:translate-x-1">
                        →
                      </span>
                    </Link>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous drop"
            className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-iron/30 bg-coal/60 text-bone opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-coal/80 group-hover:opacity-100 md:flex lg:left-6"
          >
            <span className="text-2xl leading-none">‹</span>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next drop"
            className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-iron/30 bg-coal/60 text-bone opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-coal/80 group-hover:opacity-100 md:flex lg:right-6"
          >
            <span className="text-2xl leading-none">›</span>
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 md:bottom-6">
            <div className="flex items-center gap-2 rounded-full bg-coal/60 px-3 py-2 backdrop-blur-sm">
              {drops.map((d, i) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Go to drop ${i + 1}`}
                  aria-current={i === active}
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-6 bg-bone"
                      : "w-1.5 bg-iron/60 hover:bg-iron"
                  }`}
                />
              ))}
            </div>
            <span className="hidden font-mono text-[10px] tracking-widest text-iron md:inline">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(drops.length).padStart(2, "0")}
            </span>
          </div>
        </>
      )}

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {hasMultiple && (
          <>
            Drop {active + 1} of {drops.length}: {drops[active].title_line1}{" "}
            {drops[active].title_line2}
          </>
        )}
      </div>
    </section>
  );
}
