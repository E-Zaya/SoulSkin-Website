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

  // ← / → でスライド送り
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
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className="relative aspect-[4/5] overflow-hidden bg-ash select-none"
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
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover object-center"
              draggable={false}
            />
          </div>
        ))}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIdx((i) => (i - 1 + total) % total)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-void/55 backdrop-blur-[2px] text-bone/80 hover:text-bone transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M7.5 2L3.5 6L7.5 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % total)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-void/55 backdrop-blur-[2px] text-bone/80 hover:text-bone transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M4.5 2L8.5 6L4.5 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
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
          </>
        )}
      </div>

      {/* Thumbnails (PC only, 4枚以上のときのみ) */}
      {total > 1 && (
        <div className="hidden md:flex items-center gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Thumbnail ${i + 1}`}
              className="relative shrink-0 w-[68px] h-[85px] overflow-hidden"
              style={{
                outline:
                  i === idx
                    ? "1.5px solid var(--color-ember)"
                    : "1.5px solid transparent",
                opacity: i === idx ? 1 : 0.55,
                transition: "opacity 200ms ease",
              }}
            >
              <Image
                src={src}
                alt={`サムネイル ${i + 1}`}
                fill
                sizes="68px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
