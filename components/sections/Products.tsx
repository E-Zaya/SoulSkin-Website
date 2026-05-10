"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) >= THRESHOLD) {
      diff < 0
        ? setIdx((i) => (i + 1) % total)
        : setIdx((i) => (i - 1 + total) % total);
    } else {
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
            className="object-cover object-center"
            draggable={false}
          />
        </div>
      ))}

      {/* ドラッグ / スワイプ レイヤー */}
      <div
        className="absolute inset-0 z-10"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={() => { dragStartX.current = null; isDragging.current = false; }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
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
      <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-void/80 via-void/25 to-transparent z-10 pointer-events-none" />

      {/* 情報オーバーレイ（名前 + マテリアル）+ ドット — 常時表示 */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-3 pointer-events-none">
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
        <p className="font-display text-bone text-[12px] md:text-[13px] leading-tight tracking-wide line-clamp-1 drop-shadow-sm">
          {name}
        </p>
        {/* マテリアル */}
        <p className="font-mono text-bone/55 text-[9px] tracking-[0.18em] uppercase mt-0.5 line-clamp-1">
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
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-void/90 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="modal-panel relative z-10 w-full max-w-3xl max-h-[90dvh] flex flex-col md:flex-row overflow-hidden"
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
          className="relative w-full md:w-[55%] aspect-[3/4] md:aspect-auto shrink-0 overflow-hidden bg-ash"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {product.images.map((src, i) => (
            <div
              key={src + i}
              className="absolute inset-0 transition-opacity duration-[400ms]"
              style={{ opacity: i === idx ? 1 : 0, zIndex: i === idx ? 1 : 0 }}
            >
              <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-cover object-center" />
            </div>
          ))}

          {/* 矢印 */}
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
        <div className="flex flex-col justify-center px-6 py-8 md:py-10 overflow-y-auto">
          <p className="font-mono text-[10px] text-iron/50 tracking-[0.3em] uppercase mb-4">
            {product.id}
          </p>
          <h2 className="font-display text-bone text-[22px] md:text-[26px] leading-none tracking-tight mb-2">
            {product.name}
          </h2>
          <p className="font-mono text-[10px] text-iron uppercase tracking-widest mb-5">
            {product.material}
          </p>
          <p className="font-sans text-[13px] text-dust/80 leading-relaxed mb-5">
            {product.desc}
          </p>
          <p className="font-mono text-[11px] text-bone/50 tracking-widest mb-8">
            {product.price}
          </p>
          <Link
            href={siteContent.brand.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-cinder px-6 py-3 text-center font-mono text-[11px] tracking-widest uppercase text-dust hover:text-bone hover:border-iron transition-colors"
          >
            {siteContent.products.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── ProductCard ──────────────────────────────────────────────

function ProductCard({ product, index }: { product: NormalizedProduct; index: number }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <ScrollReveal
        delay={index * 120}
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
          <h3
            className="product-title mb-1 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            {product.name}
          </h3>
          <p className="font-mono text-[10px] text-iron uppercase tracking-widest mb-2 transition-colors duration-300 group-hover:text-dust">
            {product.material}
          </p>
          <p className="font-sans text-[12px] text-dust/70 leading-relaxed mb-3 max-w-[90%]">
            {product.desc}
          </p>
          <p className="font-mono text-[10px] text-bone/50 tracking-widest mb-4">
            {product.price}
          </p>
          <Link
            href={siteContent.brand.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-link cta-link-sm text-dust group-hover:text-bone transition-colors duration-200"
          >
            {siteContent.products.cta}
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
    <section id="archive" className="bg-void section-pad-tight">
      <div className="container-base">
        <ScrollReveal className="mb-8 md:mb-10" variant="fade-left">
          <p className="text-brand-label">{siteContent.products.label}</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
          {items.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
