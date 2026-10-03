"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LookbookItem } from "@/lib/db";

type Props = { data?: LookbookItem[] };

export default function Lookbook({ data = [] }: Props) {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);
  const count = data.length;

  const go = useCallback((next: number) => {
    if (!count) return;
    setActive((next + count) % count);
  }, [count]);

  const next = useCallback(() => go(active + 1), [active, go]);
  const previous = useCallback(() => go(active - 1), [active, go]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, previous]);

  if (!count) {
    return <section className="px-[var(--ss-gutter)] py-24"><p className="ss-kicker">No frames published yet.</p></section>;
  }

  const item = data[active];
  const frame = String(active + 1).padStart(3, "0");

  return (
    <section aria-label="Soul Skin lookbook">
      <div className="ss-lookbook-topbar">
        <p className="ss-kicker"><span className="ss-blue">Lookbook</span> &nbsp; UB night files</p>
        <p className="ss-kicker ss-blue">{frame} / {String(count).padStart(3, "0")}</p>
        <p className="ss-kicker text-right">47.9180° N · 106.9177° E</p>
      </div>

      <div className="ss-lookbook-stage">
        <div className="ss-lookbook-copy">
          <div>
            <p className="ss-kicker mb-7">Archive / 2021—present</p>
            <h1 className="ss-display-sm">UB<br />Night<br />Files</h1>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-dust/65">
            <dt>Location</dt><dd>Zaisan Hill</dd>
            <dt>Time</dt><dd>23:41</dd>
            <dt>Temp</dt><dd>−18°C</dd>
            <dt>Wind</dt><dd>12 km/h</dd>
            <dt>Frame</dt><dd>{item.item_id}</dd>
            <dt>Color</dt><dd>Blue hour</dd>
          </dl>
        </div>

        <div
          className="ss-lookbook-main"
          onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const delta = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
            if (Math.abs(delta) > 45) {
              if (delta < 0) next();
              else previous();
            }
            touchStart.current = null;
          }}
        >
          <Image key={item.id} src={item.image_url || "/lookbook-01.png"} alt={`Soul Skin lookbook ${item.item_id}`} fill priority sizes="(min-width: 900px) 55vw, 100vw" className="object-cover animate-lookbook-slide" />
          <div className="absolute inset-0 bg-gradient-to-t from-void/35 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-[2] flex items-center justify-between border-t ss-rule p-4 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/70">
            <span>35mm</span><span>ISO 3200</span><span>1/125</span><span>F2.8</span><span>5600K</span>
          </div>
        </div>

        <aside className="ss-lookbook-side">
          <div>
            <div className="ss-filmstrip">
              {data.map((thumb, index) => (
                <button key={thumb.id} type="button" onClick={() => go(index)} className={`ss-film-thumb ${index === active ? "is-active" : ""}`} aria-label={`Open frame ${index + 1}`} aria-current={index === active ? "true" : undefined}>
                  <Image src={thumb.image_url || "/lookbook-01.png"} alt="" fill sizes="100px" className="object-cover" />
                </button>
              ))}
            </div>
            <div className="mt-8 border-l border-ember pl-5">
              <p className="ss-kicker ss-blue">{item.item_id}</p>
              <p className="mt-4 font-mono text-[10px] uppercase leading-7 tracking-[0.1em] text-dust/70">Delivered in darkness.<br />Built for movement.<br />Made in Ulaanbaatar.</p>
              <p className="mt-6 flex items-center gap-2 ss-kicker ss-signal"><span className="ss-dot" /> REC</p>
            </div>
          </div>

          <div className="border ss-rule p-5">
            <p className="ss-kicker ss-blue">Next frame</p>
            <div className="mt-4 flex items-end justify-between">
              <span className="font-display text-6xl leading-none">{String(((active + 1) % count) + 1).padStart(3, "0")}</span>
              <div className="flex gap-2">
                <button type="button" onClick={previous} className="ss-link !min-h-10 !px-3" aria-label="Previous frame">←</button>
                <button type="button" onClick={next} className="ss-link !min-h-10 !px-3" aria-label="Next frame">→</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
