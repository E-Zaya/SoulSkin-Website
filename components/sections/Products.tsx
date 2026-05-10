"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera as InstagramIcon } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";
import type { ProductWithImages } from "@/lib/db";

// ─── 型 ──────────────────────────────────────────────────────

type NormalizedProduct = {
  id: string;
  name: string;
  material: string;
  desc: string;
  price: string;
  images: string[];
  offset: string;
};

type Props = {
  data?: ProductWithImages[];
};

// ─── カルーセル＋オーバーレイ ─────────────────────────────────

function CarouselWithOverlay({
  images,
  name,
  material,
  onOpen,
}: {
  images: string[];
  name: string;
  material: string;
  onOpen: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const total = images.length;
  const THRESHOLD = 40;
  const TAP_MOVE_LIMIT = 10;

  // マウスドラッグ
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  function onMouseDown(e: React.MouseEvent) {
    dragStartX.current = e.clientX;
    isDragging.current = false;
  }
  function onMouseMove(e: React.MouseEvent) {
    if (dragStartX.current === null) return;
    if (Math.abs(e.clientX - dragStartX.current) > 5) isDragging.current = true;
  }
  function onMouseUp(e: React.MouseEvent) {
    if (dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(diff) >= THRESHOLD) {
      diff < 0
        ? setIdx((i) => (i + 1) % total)
        : setIdx((i) => (i - 1 + total) % total);
    } else if (!isDragging.current) {
      onOpen();
    }
    isDragging.current = false;
  }

  // タッチスワイプ
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    const verticalDiff = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(diff) >= THRESHOLD && Math.abs(diff) > Math.abs(verticalDiff)) {
      diff < 0
        ? setIdx((i) => (i + 1) % total)
        : setIdx((i) => (i - 1 + total) % total);
    } else if (Math.abs(diff) <= TAP_MOVE_LIMIT && Math.abs(verticalDiff) <= TAP_MOVE_LIMIT) {
      onOpen();
    }
  }

  return (
    <div className="relative image-frame-product overflow-hidden select-none group/carousel cursor-grab active:cursor-grabbing">
      {/* 画像スライド */}
      {images.map((src, i) => (
        <div
          key={src + i}
          className="absolute inset-0 transition-opacity duration-[400ms] ease-out"
          style={{ opacity: i === idx ? 1 : 0, zIndex: i === idx ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`${name} — ${i + 1}`}
            fill
            className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover/carousel:scale-[1.045]"
            draggable={false}
          />
        </div>
      ))}

      {/* ドラッグ / スワイプ レイヤー */}
      <div className="pointer-events-none absolute inset-0 z-[9] bg-void/0 transition-colors duration-500 md:group-hover/carousel:bg-void/18" />

      <div
        className="absolute inset-0 z-10"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={() => { dragStartX.current = null; isDragging.current = false; }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => { touchStartX.current = null; touchStartY.current = null; }}
      />

      {/* 矢印（2枚以上・hover時に出現） */}
      {total > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + total) % total); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center bg-void/60 backdrop-blur-[2px] text-bone/80 hover:text-bone transition-all opacity-0 group-hover/carousel:opacity-100 duration-200"
            aria-label="前の画像"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % total); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 flex items-center justify-center bg-void/60 backdrop-blur-[2px] text-bone/80 hover:text-bone transition-all opacity-0 group-hover/carousel:opacity-100 duration-200"
            aria-label="次の画像"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}

      {/* グラデーション（下部） */}
      <div className="absolute bottom-0 left-0 right-0 h-[58%] bg-gradient-to-t from-void/90 via-void/40 to-transparent z-10 pointer-events-none md:h-[45%] md:from-void/80 md:via-void/25" />

      {/* 情報オーバーレイ（名前 + マテリアル）+ ドット — 常時表示 */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-3 pointer-events-none md:px-3 md:pb-3">
        {/* ドット（2枚以上） */}
        {total > 1 && (
          <div className="flex gap-1.5 mb-2 pointer-events-auto">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                aria-label={`${i + 1}枚目`}
                className={`rounded-full transition-all duration-300 ${
                  i === idx
                    ? "w-[10px] h-[5px] bg-bone"
                    : "w-[5px] h-[5px] bg-bone/35 hover:bg-bone/60"
                }`}
              />
            ))}
          </div>
        )}
        {/* 名前 */}
        <p className="font-display text-bone text-[13px] leading-tight tracking-wide line-clamp-1 drop-shadow-sm md:text-[13px]">
          {name}
        </p>
        {/* マテリアル */}
        <p className="font-mono text-bone/55 text-[9px] tracking-[0.18em] uppercase mt-0.5 line-clamp-1 md:text-[9px]">
          {material}
        </p>
      </div>

      {/* SKU ホバーバー（PCのみ hover 時） */}
      <div className="absolute bottom-0 left-0 right-0 z-[21] px-4 py-2 bg-void/75 backdrop-blur-[4px]
        translate-y-full group-hover/carousel:translate-y-0 transition-transform duration-500 ease-out
        pointer-events-none hidden sm:block">
        <p className="font-mono text-[9px] text-dust tracking-[0.25em] uppercase">
          {/* SKU はカードコンポーネントから渡す必要があるのでここでは表示しない。
              SKU 表示が必要な場合は ProductCard 内で id prop として受け取る */}
        </p>
      </div>
    </div>
  );
}

// ─── モーダル ─────────────────────────────────────────────────

function Modal({
  product,
  onClose,
}: {
  product: NormalizedProduct;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const total = product.images.length;
  const touchStartX = useRef<number | null>(null);

  // ESC / 矢印キー
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")  setIdx((i) => (i - 1 + total) % total);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % total);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, total]);

  // 背景スクロール禁止
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) >= 40) {
      diff < 0
        ? setIdx((i) => (i + 1) % total)
        : setIdx((i) => (i - 1 + total) % total);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto p-3 md:items-center md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-void/90 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="modal-panel relative z-10 my-3 flex w-full max-w-3xl flex-col overflow-hidden md:my-0 md:max-h-[90dvh] md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center text-iron hover:text-bone transition-colors"
          aria-label="閉じる"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* 画像カルーセル */}
        <div
          className="relative h-[56svh] min-h-[340px] w-full shrink-0 overflow-hidden bg-ash md:h-auto md:min-h-0 md:w-[55%]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {product.images.map((src, i) => (
            <div
              key={src + i}
              className="absolute inset-0 transition-opacity duration-[400ms]"
              style={{ opacity: i === idx ? 1 : 0, zIndex: i === idx ? 1 : 0 }}
            >
              <Image
                src={src}
                alt={`${product.name} ${i + 1}`}
                fill
                sizes="(min-width: 768px) 55vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          ))}

          {/* 矢印 */}
          <div className="absolute inset-x-0 bottom-0 z-10 h-[42%] bg-gradient-to-t from-void/85 via-void/28 to-transparent pointer-events-none md:hidden" />
          <div className="absolute bottom-5 left-5 right-14 z-20 md:hidden">
            <p className="font-display text-[26px] leading-none text-bone line-clamp-2">
              {product.name}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-bone/62 line-clamp-1">
              {product.material}
            </p>
          </div>

          {total > 1 && (
            <>
              <button
                onClick={() => setIdx((i) => (i - 1 + total) % total)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-void/60 backdrop-blur-[2px] text-bone/80 hover:text-bone transition-colors"
                aria-label="前の画像"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={() => setIdx((i) => (i + 1) % total)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-void/60 backdrop-blur-[2px] text-bone/80 hover:text-bone transition-colors"
                aria-label="次の画像"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}

          {/* ドット */}
          {total > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`${i + 1}枚目`}
                  className={`rounded-full transition-all duration-300 ${
                    i === idx ? "w-[10px] h-[5px] bg-bone" : "w-[5px] h-[5px] bg-bone/40 hover:bg-bone/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 詳細情報 */}
        <div className="flex flex-col px-5 py-8 md:justify-center md:px-6 md:py-10 md:overflow-y-auto">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-iron/50">
            {product.id}
          </p>
          <h2 className="mb-3 font-display text-[28px] leading-none tracking-tight text-bone md:mb-2 md:text-[26px]">
            {product.name}
          </h2>
          <p className="mb-6 font-mono text-[10px] uppercase tracking-widest text-iron md:mb-5">
            {product.material}
          </p>
          <p className="mb-6 max-w-[34rem] font-sans text-[14px] leading-[1.85] text-dust/82 md:mb-5 md:text-[13px] md:leading-relaxed">
            {product.desc}
          </p>
          <p className="mb-9 font-mono text-[11px] tracking-widest text-bone/55 md:mb-8">
            {product.price}
          </p>
          <Link
            href={siteContent.brand.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 border border-cinder px-6 py-4 text-center font-mono text-[11px] uppercase tracking-widest text-dust transition-colors hover:border-iron hover:text-bone md:w-auto md:py-3"
          >
            <span>{siteContent.products.cta}</span>
            <InstagramIcon size={14} strokeWidth={1.6} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── ProductCard ──────────────────────────────────────────────

function ProductCard({
  product,
  index,
}: {
  product: NormalizedProduct;
  index: number;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <ScrollReveal
        delay={Math.min(index, 2) * 120}
        variant={index === 1 ? "fade-up" : "fade-only"}
      >
        <div className={`group ${product.offset}`}>
          {/* カルーセル */}
          <div className="relative overflow-hidden mb-4 md:mb-5">
            <CarouselWithOverlay
              images={product.images}
              name={product.name}
              material={product.material}
              onOpen={() => setModalOpen(true)}
            />
          </div>

          {/* カード下テキスト */}
          <p className="mb-4 flex items-center gap-2 font-mono text-[10px] text-bone/55 tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-bone/55 shadow-[0_0_10px_rgba(237,232,225,0.28)]" aria-hidden="true" />
            {product.price}
          </p>
          <Link
            href={siteContent.brand.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-link cta-link-sm text-dust transition-colors duration-200 group-hover:text-bone"
          >
            <span>{siteContent.products.cta}</span>
            <InstagramIcon size={13} strokeWidth={1.6} aria-hidden="true" />
          </Link>
        </div>
      </ScrollReveal>

      {modalOpen && (
        <Modal product={product} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}

// ─── メインコンポーネント ──────────────────────────────────────

export default function Products({ data }: Props) {
  const items: NormalizedProduct[] = (data ?? [])
    .map((p) => ({
      id: p.sku,
      name: p.name,
      material: p.material,
      desc: p.description,
      price: p.price,
      images:
        p.images && p.images.length > 0
          ? p.images.map((img) => img.image_url)
          : p.image_url
            ? [p.image_url]
            : [],
      offset: p.offset_class,
    }))
    .filter((p) => p.images.length > 0);

  if (items.length === 0) return null;

  return (
    <section id="archive" className="section-gap-before bg-void section-pad">
      <div className="container-base">
        <ScrollReveal className="mb-6 md:mb-12" variant="fade-left">
          <p className="text-brand-label">{siteContent.products.label}</p>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {items.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
