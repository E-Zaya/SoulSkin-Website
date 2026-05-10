"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import NoiseAccent from "@/components/ui/NoiseAccent";
import { siteContent } from "@/data/siteContent";
import type { LookbookItem } from "@/lib/db";

type Props = {
  data?: LookbookItem[];
};

type ViewItem = {
  key: string;
  label: string;
  src: string;
};

const STRIP_HEIGHTS = [158, 128, 172, 118, 148, 164, 124, 152, 140, 130];

export default function Lookbook({ data }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const items: ViewItem[] = (data ?? [])
    .filter((item): item is LookbookItem & { image_url: string } =>
      Boolean(item.image_url)
    )
    .map((item) => ({
      key: item.id,
      label: item.item_id,
      src: item.image_url,
    }));

  const goTo = useCallback(
    (idx: number) => {
      if (items.length === 0) return;
      setActiveIdx((idx + items.length) % items.length);
    },
    [items.length]
  );

  const goPrev = useCallback(() => goTo(activeIdx - 1), [activeIdx, goTo]);
  const goNext = useCallback(() => goTo(activeIdx + 1), [activeIdx, goTo]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) < 42) return;
    if (diff < 0) goNext();
    else goPrev();
  }

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // キーボード操作
  useEffect(() => {
    if (items.length === 0) return;
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext, items.length]);

  // フィルムストリップを常に水平スクロール
  useEffect(() => {
    if (items.length === 0) return;
    const inner = stripRef.current;
    if (!inner) return;
    const scroller = inner.parentElement;
    if (!scroller) return;
    const frame = inner.children[activeIdx] as HTMLElement | undefined;
    if (!frame) return;
    if (isDesktop) {
      const targetTop =
        frame.offsetTop - scroller.clientHeight / 2 + frame.clientHeight / 2;
      scroller.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
      return;
    }
    const targetLeft =
      frame.offsetLeft - scroller.clientWidth / 2 + frame.clientWidth / 2;
    scroller.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
  }, [activeIdx, isDesktop, items.length]);

  if (items.length === 0) return null;

  const activeItem = items[activeIdx];
  const frameNumber = String(activeIdx + 1).padStart(3, "0");
  const frameMeta = `${siteContent.hero.tag.replace(/\s+/g, "")} / FRAME ${frameNumber}`;

  // ════════════════════════════════════════
  // PC: Option A (フルワイド＋フィルムストリップ下)
  // ════════════════════════════════════════
  if (isDesktop) {
    return (
      <section id="lookbook" className="lookbook-desktop-layout relative overflow-hidden bg-void section-gap-before">
        {/* フルワイド画像エリア */}
        <div
          className="lookbook-desktop-main relative w-full overflow-hidden bg-ash"
          style={{ height: "80vh", maxHeight: "850px" }}
        >
          {/* 画像スタック（フェードトランジション） */}
          {items.map((item, i) => (
            <div
              key={item.key}
              className="absolute inset-0 transition-opacity duration-700 ease-out"
              style={{
                opacity: i === activeIdx ? 1 : 0,
                zIndex: i === activeIdx ? 1 : 0,
                pointerEvents: i === activeIdx ? "auto" : "none",
              }}
            >
              <Image
                src={item.src}
                alt={`Lookbook — ${item.label} — Soul Skin`}
                fill
                preload={i === 0}
                sizes="calc(100vw - 280px)"
                className="object-contain object-center"
              />
            </div>
          ))}

          {/* 下部グラデーション */}
          <div className="pointer-events-none absolute inset-0 z-10 lookbook-desktop-bottom-overlay" />

          {/* ノイズアクセント */}
          <NoiseAccent
            inset="0 0 auto auto"
            width="40%"
            height="50%"
            opacity={0.06}
            tileSize="180px"
            drift
            className="z-[2]"
          />

          {/* 縦ラベル */}
          <div
            className="absolute left-4 top-1/2 z-20 flex -translate-y-1/2"
            aria-hidden="true"
          >
            <span
              className="text-brand-label"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {siteContent.lookbook.label}
            </span>
          </div>

          {/* 左下キャプション */}
          <div className="lookbook-caption absolute z-20">
            <p className="mb-3 text-brand-label text-dust/70">
              {frameMeta}
            </p>
            <h2 className="lookbook-title mb-4 text-brand-display">
              {siteContent.lookbook.titleLine1}
              <br />
              {siteContent.lookbook.titleLine2}
              <br />
              {siteContent.lookbook.titleLine3}
            </h2>
            <p className="font-mono text-[10px] tracking-[0.28em] text-dust/85 transition-all duration-500">
              {activeItem.label}
            </p>
          </div>
        </div>

        {/* カウンター＋ナビゲーションバー */}
        <div className="lookbook-desktop-rail-header relative flex items-start justify-between border-b border-cinder/60 bg-void px-6 py-5">
          <div>
            <p className="text-brand-label text-iron">
              {siteContent.lookbook.label}
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-dust/60">
              {frameMeta}
            </p>
          </div>
          <span
            key={activeIdx}
            className="lookbook-counter-pop font-mono text-[11px] tracking-widest text-dust/50"
          >
            {String(activeIdx + 1).padStart(2, "0")}
            <span className="text-iron/50">
              {" / "}
              {String(items.length).padStart(2, "0")}
            </span>
          </span>
          <div className="absolute bottom-5 left-6 flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="前の画像"
              className="lookbook-nav-button"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="次の画像"
              className="lookbook-nav-button"
            >
              →
            </button>
          </div>
        </div>

        {/* フィルムストリップ（水平・全幅） */}
        <div className="lookbook-desktop-film relative bg-void">
          <Sprockets />
          <div
            className="lookbook-desktop-film-scroll bg-ash"
            style={{
              overflowX: "hidden",
              overflowY: "auto",
              height: "100%",
              scrollbarWidth: "none",
            }}
          >
            <div
              ref={stripRef}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                minHeight: "max-content",
                padding: "0.75rem 1rem",
              }}
            >
              {items.map((item, i) => (
                <FilmFrame
                  key={item.key}
                  item={item}
                  index={i}
                  isActive={i === activeIdx}
                  height={STRIP_HEIGHTS[i % STRIP_HEIGHTS.length]}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </div>
          <Sprockets />
        </div>
      </section>
    );
  }

  // ════════════════════════════════════════
  // スマホ: 元のレイアウトをそのまま維持
  // ════════════════════════════════════════
  return (
    <section id="lookbook" className="lookbook-section relative overflow-hidden bg-void">
      <div className="lookbook-inner">
        <div className="lookbook-grid">
          {/* メイン画像 */}
          <div
            className="lookbook-main"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={activeItem.src}
              alt={`Lookbook — ${activeItem.label} — Soul Skin`}
              fill
              sizes="100vw"
              className="lookbook-mobile-image"
            />

            {/* スマホ用グラデーション */}
            <div className="lookbook-mobile-fade pointer-events-none absolute inset-x-0 bottom-0 z-10" />

            {/* ノイズアクセント */}
            <NoiseAccent
              inset="0 0 auto auto"
              width="40%"
              height="50%"
              opacity={0.06}
              tileSize="180px"
              drift
              className="z-[2]"
            />

            {/* 左下キャプション */}
            <div className="lookbook-caption absolute z-20">
              <p className="mb-2 text-brand-label text-dust/70">
                {frameMeta}
              </p>
              <h2 className="lookbook-title mb-3 text-brand-display">
                {siteContent.lookbook.titleLine1}
                <br />
                {siteContent.lookbook.titleLine2}
                <br />
                {siteContent.lookbook.titleLine3}
              </h2>
              <p className="font-mono text-[10px] tracking-[0.28em] text-dust/85 transition-all duration-500">
                {activeItem.label}
              </p>
            </div>

            {/* ドットナビゲーション */}
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`画像 ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === activeIdx ? "w-5 bg-bone/90" : "w-1.5 bg-iron/45"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* フィルムストリップエリア */}
          <aside className="lookbook-aside relative flex flex-col bg-void">
            <div className="flex items-center justify-between border-b border-cinder/60 pb-4">
              <span
                key={activeIdx}
                className="lookbook-counter-pop font-mono text-[11px] tracking-widest text-dust/50"
              >
                {String(activeIdx + 1).padStart(2, "0")}
                <span className="text-iron/50">
                  {" / "}
                  {String(items.length).padStart(2, "0")}
                </span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="前の画像"
                  className="lookbook-nav-button"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="次の画像"
                  className="lookbook-nav-button"
                >
                  →
                </button>
              </div>
            </div>

            <div className="lookbook-copy-block">
              <p className="body-copy text-measure-lg text-dust/65">
                {siteContent.lookbook.description}
              </p>
            </div>

            <div className="relative min-h-0 flex-1">
              <Sprockets />
              <div className="lookbook-strip-scroller bg-ash">
                <div ref={stripRef} className="lookbook-strip-inner">
                  {items.map((item, i) => (
                    <FilmFrame
                      key={item.key}
                      item={item}
                      index={i}
                      isActive={i === activeIdx}
                      height={STRIP_HEIGHTS[i % STRIP_HEIGHTS.length]}
                      onClick={() => goTo(i)}
                    />
                  ))}
                </div>
              </div>
              <Sprockets />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* 個別フィルムフレーム */
function FilmFrame({
  item,
  index,
  isActive,
  height,
  onClick,
}: {
  item: ViewItem;
  index: number;
  isActive: boolean;
  height: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${item.label} を表示`}
      className="relative flex-shrink-0"
      style={{ width: 96, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          outline: isActive
            ? "1.5px solid var(--color-ember)"
            : "1.5px solid transparent",
        }}
      >
        <Image
          src={item.src}
          alt={`フィルム ${item.label}`}
          fill
          sizes="96px"
          className="object-cover object-center"
          style={{
            filter: isActive || hovered ? "none" : "grayscale(100%)",
            opacity: isActive ? 1 : hovered ? 0.85 : 0.45,
            transition: "filter 400ms ease, opacity 400ms ease",
          }}
        />
        <p
          className="pointer-events-none absolute bottom-1.5 left-2 font-mono text-[8px] tracking-widest"
          style={{
            color: isActive
              ? "var(--color-ember)"
              : hovered
                ? "rgba(255,255,255,0.6)"
                : "rgba(255,255,255,0.22)",
            transition: "color 300ms ease",
          }}
        >
          {String(index + 1).padStart(3, "0")}
        </p>
      </div>
    </button>
  );
}

/* スプロケット穴バー */
function Sprockets() {
  return (
    <div
      className="flex items-center gap-[10px] overflow-hidden bg-ash px-4"
      style={{ height: 18 }}
      aria-hidden="true"
    >
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 rounded-[2px] bg-void"
          style={{ width: 11, height: 8 }}
        />
      ))}
    </div>
  );
}
