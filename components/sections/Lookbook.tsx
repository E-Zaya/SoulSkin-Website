"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import NoiseAccent from "@/components/ui/NoiseAccent";
import { siteContent } from "@/data/siteContent";
import type { LookbookItem } from "@/lib/db";

type Props = {
  data?: LookbookItem[];
};

const FALLBACK_IMAGES = ["/lookbook-01.png", "/lookbook-02.png", "/lookbook-03.png"];

type ViewItem = {
  key: string;
  label: string;
  src: string;
};

// フィルムストリップの高さパターン（変化をつける）
const STRIP_HEIGHTS = [158, 128, 172, 118, 148, 164, 124, 152, 140, 130];

export default function Lookbook({ data }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const items =
    data && data.length > 0
      ? data.map((item, i): ViewItem => ({
          key: item.id,
          label: item.item_id,
          src: item.image_url ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
        }))
      : siteContent.lookbook.items.map((item, i): ViewItem => ({
          key: item.id,
          label: item.id,
          src: FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
        }));

  const goTo = useCallback(
    (idx: number) => {
      setActiveIdx((idx + items.length) % items.length);
    },
    [items.length]
  );

  const goPrev = useCallback(() => goTo(activeIdx - 1), [activeIdx, goTo]);
  const goNext = useCallback(() => goTo(activeIdx + 1), [activeIdx, goTo]);

  // キーボード操作
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext]);

  // アクティブなフィルムフレームをスクロールで中央に
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const frame = strip.children[activeIdx] as HTMLElement;
    if (!frame) return;
    const stripRect = strip.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    const offset =
      frameRect.left -
      stripRect.left -
      stripRect.width / 2 +
      frameRect.width / 2;
    strip.scrollBy({ left: offset, behavior: "smooth" });
  }, [activeIdx]);

  const activeItem = items[activeIdx];

  return (
    <section id="lookbook" className="relative bg-void overflow-hidden">

      {/* ══════════════════════════════════════
          ① フルスクリーンスライダー (Option A)
         ══════════════════════════════════════ */}
      <div
        className="relative w-full overflow-hidden"
        style={{ minHeight: "70vh" }}
      >
        {/* 全画像を absolute で重ねてクロスフェード */}
        {items.map((item, i) => (
          <div
            key={item.key}
            className="absolute inset-0"
            style={{
              opacity: i === activeIdx ? 1 : 0,
              transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1)",
              zIndex: i === activeIdx ? 1 : 0,
            }}
          >
            <Image
              src={item.src}
              alt={`Lookbook — ${item.label} — Soul Skin`}
              fill
              className="object-cover object-center"
              priority={i === 0}
            />
          </div>
        ))}

        {/* 左→右グラデ（テキスト可読性） */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to right, rgba(10,9,8,0.72) 0%, rgba(10,9,8,0.2) 45%, transparent 70%)",
          }}
        />
        {/* 下→上グラデ（ナビ可読性） */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,9,8,0.25) 0%, transparent 20%, transparent 55%, rgba(10,9,8,0.85) 100%)",
          }}
        />

        {/* Noise accent */}
        <NoiseAccent
          inset="0 0 auto auto"
          width="40%"
          height="50%"
          opacity={0.06}
          tileSize="180px"
          drift
          className="z-[2]"
        />

        {/* ── 縦ラベル（デスクトップ） ── */}
        <div
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20"
          aria-hidden="true"
        >
          <span
            className="text-brand-label"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {siteContent.lookbook.label}
          </span>
        </div>

        {/* ── フレームカウンター（右上） ── */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
          <span
            className="font-mono text-[11px] tracking-widest"
            style={{ color: "rgba(184,176,166,0.5)" }}
          >
            {String(activeIdx + 1).padStart(2, "0")}
            <span style={{ color: "rgba(92,86,80,0.5)" }}>
              {" / "}
              {String(items.length).padStart(2, "0")}
            </span>
          </span>
        </div>

        {/* ── 左下テキスト ── */}
        <div className="absolute bottom-16 md:bottom-12 left-6 md:left-14 z-20 max-w-[340px]">
          <p className="text-brand-label mb-3 text-ember">
            {siteContent.lookbook.season}
          </p>
          <h2
            className="text-brand-display mb-4"
            style={{ fontSize: "clamp(2.8rem,10vw,5rem)", lineHeight: 0.88 }}
          >
            {siteContent.lookbook.titleLine1}
            <br />
            {siteContent.lookbook.titleLine2}
            <br />
            {siteContent.lookbook.titleLine3}
          </h2>
          <p
            className="font-mono text-[10px] tracking-[0.28em] transition-all duration-500"
            style={{ color: "rgba(92,86,80,0.8)" }}
          >
            {activeItem?.label}
          </p>
        </div>

        {/* ── ナビゲーション矢印（右下） ── */}
        <div className="absolute bottom-10 right-6 z-20 flex items-center gap-2">
          <button
            onClick={goPrev}
            aria-label="前の画像"
            className="group w-10 h-10 flex items-center justify-center border transition-all duration-200"
            style={{
              borderColor: "rgba(92,86,80,0.35)",
              color: "rgba(184,176,166,0.6)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(237,232,225,0.6)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(237,232,225,1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(92,86,80,0.35)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(184,176,166,0.6)";
            }}
          >
            ←
          </button>
          <button
            onClick={goNext}
            aria-label="次の画像"
            className="group w-10 h-10 flex items-center justify-center border transition-all duration-200"
            style={{
              borderColor: "rgba(92,86,80,0.35)",
              color: "rgba(184,176,166,0.6)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(237,232,225,0.6)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(237,232,225,1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(92,86,80,0.35)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(184,176,166,0.6)";
            }}
          >
            →
          </button>
        </div>

        {/* ── モバイル用ドットインジケーター ── */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 md:hidden">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`画像 ${i + 1}`}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === activeIdx ? 20 : 6,
                background:
                  i === activeIdx
                    ? "rgba(237,232,225,0.9)"
                    : "rgba(92,86,80,0.45)",
              }}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          ② フィルムストリップ (Option C)
         ══════════════════════════════════════ */}
      <div className="relative bg-void pt-10 pb-12 md:pt-14 md:pb-16">
        {/* キャプション */}
        <div className="container-base mb-8">
          <p
            className="body-copy max-w-[380px]"
            style={{ color: "rgba(184,176,166,0.65)" }}
          >
            {siteContent.lookbook.description}
          </p>
        </div>

        {/* フィルム全体 */}
        <div className="relative">
          {/* スプロケット穴 — 上段 */}
          <Sprockets />

          {/* 画像ストリップ */}
          <div
            className="bg-ash overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <div
              ref={stripRef}
              className="flex gap-[3px] items-end px-4 py-3"
              style={{ minWidth: "max-content" }}
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

          {/* スプロケット穴 — 下段 */}
          <Sprockets />
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
      onClick={onClick}
      aria-label={`${item.label} を表示`}
      className="relative flex-shrink-0"
      style={{ width: 96, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          outline: isActive ? "1.5px solid #442fbd" : "1.5px solid transparent",
        }}
      >
        <Image
          src={item.src}
          alt={`フィルム ${item.label}`}
          fill
          className="object-cover object-center"
          style={{
            filter:
              isActive || hovered ? "none" : "grayscale(100%)",
            opacity: isActive ? 1 : hovered ? 0.85 : 0.45,
            transition: "filter 400ms ease, opacity 400ms ease",
          }}
        />

        {/* フレーム番号 */}
        <p
          className="absolute bottom-1.5 left-2 font-mono text-[8px] tracking-widest pointer-events-none"
          style={{
            color: isActive
              ? "#442fbd"
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
      className="flex items-center gap-[10px] px-4 overflow-hidden bg-ash"
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
