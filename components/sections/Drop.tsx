"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Camera as InstagramIcon } from "lucide-react";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";
import { toSlug } from "@/lib/slug";
import type { Drop as DropData } from "@/lib/db";

type Props = {
  /**
   * 表示する Active Drops。新しい順 / order_index 順で渡される想定。
   * 後方互換: 単一の data prop が渡された場合もそれを drops[0] として扱う。
   */
  drops?: DropData[] | null;
  /** @deprecated 旧 API。drops を使うこと。 */
  data?: DropData | null;
};

const DOT_MAX = 10;
const AUTO_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD_PX = 50;

function ScarcityDots({ piecesLeft }: { piecesLeft: number }) {
  const filled = Math.min(piecesLeft, DOT_MAX);
  const empty = DOT_MAX - filled;

  return (
    <div className="flex items-center gap-[5px]">
      {Array.from({ length: filled }).map((_, i) => (
        <span
          key={`f-${i}`}
          className="block rounded-full bg-bone"
          style={{ width: 7, height: 7 }}
        />
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <span
          key={`e-${i}`}
          className="block rounded-full border border-iron/50"
          style={{ width: 7, height: 7 }}
        />
      ))}
      {piecesLeft > DOT_MAX && (
        <span className="ml-1 font-mono text-[10px] tracking-widest text-iron/60">
          +{piecesLeft - DOT_MAX}
        </span>
      )}
    </div>
  );
}

/** 1 Drop ぶんのスライド本体 (中身は元の Drop UI を流用)。 */
function DropSlide({ drop }: { drop: DropData }) {
  const label = siteContent.drop.label;
  const titleLine1 = drop.title_line1;
  const titleLine2 = drop.title_line2;
  const description = drop.description;
  const piecesLeft = drop.pieces_left;
  const cta = siteContent.drop.cta;
  const imageSrc = drop.image_url;
  const isSoldOut = piecesLeft === 0;

  return (
    <div className="editorial-split flex flex-col md:flex-row">
      <div className="relative aspect-[4/5] shrink-0 overflow-hidden md:aspect-[16/13] md:w-[64%]">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={`${titleLine1} ${titleLine2} - Soul Skin Drop`}
            fill
            className={`object-cover object-center transition-all duration-700 ${
              isSoldOut ? "grayscale" : ""
            }`}
          />
        )}

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="rotate-[-6deg] px-6 py-3"
              style={{
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "rgba(168, 69, 62, 0.65)",
                backgroundColor: "rgba(10,9,8,0.5)",
              }}
            >
              <span
                className="font-mono text-[13px] uppercase tracking-[0.4em] md:text-[15px]"
                style={{ color: "rgba(232, 168, 162, 0.95)" }}
              >
                SOLD OUT
              </span>
            </div>
          </div>
        )}

        {/* Mobile-only overlay header: ラベル + タイトルを画像下部に重ねる */}
        <Link
          href={`/drops/${toSlug(drop.label)}`}
          className="absolute inset-x-0 bottom-0 z-10 md:hidden"
        >
          <div
            className="px-6 pb-5 pt-24"
            style={{
              background:
                "linear-gradient(to top, #1c1a18 0%, rgba(28,26,24,0.92) 35%, rgba(28,26,24,0.55) 70%, rgba(28,26,24,0) 100%)",
            }}
          >
            <p className="text-brand-label mb-2 text-dust/80">{label}</p>
            <h2 className="text-brand-display display-section">
              {titleLine1}
              <br />
              {titleLine2}
            </h2>
          </div>
        </Link>

        <NoiseAccent
          inset="0 0 0 auto"
          width="30%"
          height="100%"
          opacity={0.08}
          tileSize="170px"
          blendMode="overlay"
        />
        <NoiseAccent
          inset="auto auto 0 0"
          width="40%"
          height="35%"
          opacity={0.05}
          tileSize="200px"
        />
      </div>

      <div className="section-pad-editorial relative flex flex-col justify-center px-6 pt-6 md:w-[36%] md:px-12 md:pt-0 lg:px-14">
        <ScrollReveal delay={0} className="hidden md:block">
          <p className="text-brand-label mb-5 text-dust/70 md:mb-6">{label}</p>
        </ScrollReveal>

        <ScrollReveal delay={80} className="hidden md:block">
          <h2 className="text-brand-display display-section mb-5 md:mb-6">
            {titleLine1}
            <br />
            {titleLine2}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <p className="body-copy text-measure-sm mb-5 text-dust md:mb-7">
            {description}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mb-5 md:mb-8">
            {isSoldOut ? (
              <div className="flex items-center gap-4">
                <span className="h-px w-12 bg-iron/40" />
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-iron/60 line-through">
                  SOLD OUT
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center gap-4">
                  <span className="h-px w-12 bg-iron/40" />
                  <p className="text-brand-label !font-bold !text-dust">
                    PIECES LEFT:{" "}
                    <span className="tabular-nums">
                      {String(piecesLeft).padStart(2, "0")}
                    </span>
                  </p>
                </div>
                <div className="pl-16">
                  <ScarcityDots piecesLeft={piecesLeft} />
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={240}>
          <div className="flex flex-col gap-4">
            {isSoldOut ? (
              <span className="inline-flex cursor-not-allowed select-none items-center gap-2 font-sans text-[13px] font-medium uppercase tracking-widest text-iron/40">
                <span>{cta}</span>
                <span aria-hidden="true">-</span>
              </span>
            ) : (
              <Link
                href={siteContent.brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-link group"
              >
                <span className="link-underline-grow">{cta}</span>
                <InstagramIcon
                  size={14}
                  strokeWidth={1.6}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            )}
            <Link
              href={`/drops/${toSlug(drop.label)}`}
              className="cta-link cta-link-sm text-dust/60 hover:text-bone transition-colors"
            >
              <span className="link-underline-grow">View drop</span>
              <span>→</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

export default function Drop({ drops, data }: Props) {
  // 後方互換: data prop が来た場合は単独配列に変換
  const list: DropData[] = drops && drops.length > 0
    ? drops
    : data
    ? [data]
    : [];

  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // active を範囲内に丸める (drops が減ったときのため)
  useEffect(() => {
    if (list.length > 0 && active >= list.length) {
      setActive(0);
    }
  }, [list.length, active]);

  // prefers-reduced-motion 監視
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // 自動スライド (5秒)。ホバー中 / reduce-motion / スライド1枚以下では止める。
  useEffect(() => {
    if (list.length <= 1 || isHovered || reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % list.length);
    }, AUTO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [list.length, isHovered, reduceMotion]);

  if (list.length === 0) return null;

  const next = () => setActive((a) => (a + 1) % list.length);
  const prev = () => setActive((a) => (a - 1 + list.length) % list.length);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || list.length <= 1) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  }

  const hasMultiple = list.length > 1;
  const activeDrop = list[active];

  return (
    <section
      id="drop"
      className="section-gap-before group relative overflow-hidden bg-ash"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription={hasMultiple ? "carousel" : undefined}
    >
      {/* 背景の巨大文字 — アクティブな drop に同期してフェード切替 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {list.map((d, i) => (
          <div
            key={d.id}
            className="drop-bg-type absolute inset-0 transition-opacity duration-300"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            DROP {d.title_line2}
          </div>
        ))}
      </div>

      {/* スライド本体 — grid stacking で全スライドを同じセルに重ねて height を最大化 */}
      <div
        className="relative z-10 grid"
        style={{ gridTemplateAreas: '"slide"' }}
      >
        {list.map((d, i) => (
          <div
            key={d.id}
            className="transition-opacity duration-300"
            style={{
              gridArea: "slide",
              opacity: i === active ? 1 : 0,
              pointerEvents: i === active ? "auto" : "none",
              visibility: i === active ? "visible" : "hidden",
            }}
            aria-hidden={i !== active}
            role={hasMultiple ? "group" : undefined}
            aria-roledescription={hasMultiple ? "slide" : undefined}
            aria-label={hasMultiple ? `${i + 1} of ${list.length}` : undefined}
          >
            <DropSlide drop={d} />
          </div>
        ))}
      </div>

      {/* デスクトップ用ナビ矢印 — ホバー時のみ表示 */}
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
        </>
      )}

      {/* ドットインジケーター + カウンター */}
      {hasMultiple && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 md:bottom-6">
          <div className="flex items-center gap-2 rounded-full bg-coal/60 px-3 py-2 backdrop-blur-sm">
            {list.map((d, i) => (
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
            {String(active + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* SR-only live region — スクリーンリーダーに切替を通知 */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {hasMultiple && activeDrop && (
          <>
            Drop {active + 1} of {list.length}: {activeDrop.title_line1}{" "}
            {activeDrop.title_line2}
          </>
        )}
      </div>
    </section>
  );
}
