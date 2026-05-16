"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  alt: string;
};

const SWIPE_THRESHOLD = 40;

export default function PieceGallery({ images, alt }: Props) {
  const [idx, setIdx] = useState(0);
  const total = images.length;
  const touchStartX = useRef<number | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  // ← / → キーでスライド
  useEffect(() => {
    if (total <= 1) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + total) % total);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % total);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  // アクティブなサムネイルをスクロール
  useEffect(() => {
    const container = thumbsRef.current;
    if (!container) return;
    const active = container.children[idx] as HTMLElement | undefined;
    if (!active) return;
    active.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [idx]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) >= SWIPE_THRESHOLD) {
      if (diff < 0) setIdx((i) => (i + 1) % total);
      else setIdx((i) => (i - 1 + total) % total);
    }
  }

  if (total === 0) return null;

  return (
    <div className="flex gap-3 h-full">
      {/* サムネイル列 — 複数画像のとき左に縦並び */}
      {total > 1 && (
        <div
          ref={thumbsRef}
          className="hidden md:flex flex-col gap-2 overflow-y-auto shrink-0 w-[72px]"
          style={{ scrollbarWidth: "none", maxHeight: "80svh" }}
        >
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Thumbnail ${i + 1}`}
              className="relative shrink-0 w-[72px] aspect-[3/4] overflow-hidden transition-opacity duration-200"
              style={{
                outline:
                  i === idx
                    ? "1.5px solid var(--color-ember)"
                    : "1.5px solid transparent",
                opacity: i === idx ? 1 : 0.45,
              }}
            >
              <Image
                src={src}
                alt={`${alt} — thumbnail ${i + 1}`}
                fill
                sizes="72px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* メイン画像 */}
      <div
        className="relative flex-1 overflow-hidden bg-ash select-none"
        style={{ minHeight: "60svh", maxHeight: "90svh" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((src, i) => (
          <div
            key={src + i}
            className="absolute inset-0 transition-opacity duration-[400ms] ease-out"
            style={{ opacity: i === idx ? 1 : 0, zIndex: i === idx ? 1 : 0 }}
          >
            <Image
              src={src}
              alt={`${alt} — ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-contain object-center"
              draggable={false}
            />
          </div>
        ))}

        {/* 矢印ナビ */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIdx((i) => (i - 1 + total) % total)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-void/55 backdrop-blur-[2px] text-bone/80 hover:text-bone transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % total)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-void/55 backdrop-blur-[2px] text-bone/80 hover:text-bone transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {/* カウンター */}
        {total > 1 && (
          <div className="absolute bottom-3 right-3 z-10 font-mono text-[10px] tracking-widest text-bone/50">
            {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        )}

        {/* モバイル用ドットナビ */}
        {total > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 md:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Image ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === idx
                    ? "w-[10px] h-[5px] bg-bone"
                    : "w-[5px] h-[5px] bg-bone/40 hover:bg-bone/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
