"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LookbookItem } from "@/lib/db";
import { siteContent } from "@/data/siteContent";

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
  const frame = String(active + 1).padStart(2, "0");
  const total = String(count).padStart(2, "0");

  return (
    <section aria-label="Soul Skin lookbook">
      <div className="ss-lookbook-topbar">
        <p className="ss-kicker"><span className="ss-blue">Lookbook</span> &nbsp; {siteContent.lookbook.season}</p>
        <p className="ss-kicker ss-blue tabular-nums" aria-live="polite">{frame} / {total}</p>
      </div>

      <div className="ss-lookbook-stage">
        <div className="ss-lookbook-copy">
          <div>
            <p className="ss-kicker mb-7">Shot in Ulaanbaatar</p>
            <h1 className="ss-display-sm">
              {siteContent.lookbook.titleLine1}<br />
              {siteContent.lookbook.titleLine2}<br />
              {siteContent.lookbook.titleLine3}
            </h1>
          </div>
          <p className="ss-body">{siteContent.lookbook.description}</p>
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
          <p className="absolute bottom-4 left-4 z-[2] ss-kicker text-bone">{item.item_id}</p>
        </div>

        <aside className="ss-lookbook-side">
          <div className="ss-filmstrip">
            {data.map((thumb, index) => (
              <button key={thumb.id} type="button" onClick={() => go(index)} className={`ss-film-thumb ${index === active ? "is-active" : ""}`} aria-label={`Open frame ${index + 1}`} aria-current={index === active ? "true" : undefined}>
                <Image src={thumb.image_url || "/lookbook-01.png"} alt="" fill sizes="100px" className="object-cover" />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 border-t ss-rule pt-5">
            <p className="ss-kicker">Frame {frame}</p>
            <div className="flex gap-2">
              <button type="button" onClick={previous} className="ss-link !min-h-11 !min-w-11 justify-center !px-3" aria-label="Previous frame">←</button>
              <button type="button" onClick={next} className="ss-link !min-h-11 !min-w-11 justify-center !px-3" aria-label="Next frame">→</button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
