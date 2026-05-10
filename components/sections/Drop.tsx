import Image from "next/image";
import Link from "next/link";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";
import type { Drop as DropData } from "@/lib/db";

type Props = {
  data?: DropData | null;
};

// ドット表示の最大枚数（ドロップの最大ロット想定）
const DOT_MAX = 10;

function ScarcityDots({ piecesLeft }: { piecesLeft: number }) {
  const filled = Math.min(piecesLeft, DOT_MAX);
  const empty  = DOT_MAX - filled;

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
        <span className="font-mono text-[10px] text-iron/60 tracking-widest ml-1">
          +{piecesLeft - DOT_MAX}
        </span>
      )}
    </div>
  );
}

export default function Drop({ data }: Props) {
  if (!data) return null;

  const label = siteContent.drop.label;
  const titleLine1 = data.title_line1;
  const titleLine2 = data.title_line2;
  const description = data.description;
  const piecesLeft = data.pieces_left;
  const cta = siteContent.drop.cta;
  const imageSrc = data.image_url;

  const isSoldOut = piecesLeft === 0;

  return (
    <section id="drop" className="section-gap-before relative bg-ash overflow-hidden">
      <div className="drop-bg-type" aria-hidden="true">
        DROP {titleLine2}
      </div>
      <div className="editorial-split relative z-10 flex flex-col md:flex-row">
        {/* Image column */}
        <div className="relative md:w-[64%] aspect-[4/5] md:aspect-[16/13] shrink-0 overflow-hidden">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={`${titleLine1} ${titleLine2} — Soul Skin Drop`}
              fill
              className={`object-cover object-center transition-all duration-700 ${isSoldOut ? "grayscale" : ""}`}
            />
          )}

          {/* SOLD OUT オーバーレイ — rust accent */}
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="px-6 py-3 rotate-[-6deg]"
                style={{
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "rgba(168, 69, 62, 0.65)",
                  backgroundColor: "rgba(10,9,8,0.5)",
                }}
              >
                <span
                  className="font-mono text-[13px] md:text-[15px] tracking-[0.4em] uppercase"
                  style={{ color: "rgba(232, 168, 162, 0.95)" }}
                >
                  SOLD OUT
                </span>
              </div>
            </div>
          )}

          {/* Noise accents */}
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

        {/* Text column */}
        <div className="relative md:w-[36%] flex flex-col justify-center px-6 md:px-12 lg:px-14 section-pad-editorial">
          <ScrollReveal delay={0}>
            <p className="text-brand-label mb-5 md:mb-6 text-dust/70">{label}</p>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h2 className="text-brand-display display-section mb-5 md:mb-6">
              {titleLine1}
              <br />
              {titleLine2}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="body-copy text-dust mb-6 md:mb-7 text-measure-sm">
              {description}
            </p>
          </ScrollReveal>

          {/* Scarcity 視覚化 */}
          <ScrollReveal delay={200}>
            <div className="mb-7 md:mb-8">
              {isSoldOut ? (
                /* SOLD OUT 状態 */
                <div className="flex items-center gap-4">
                  <span className="h-px bg-iron/40 w-12" />
                  <p className="font-mono text-[11px] text-iron/60 tracking-[0.3em] uppercase line-through">
                    SOLD OUT
                  </p>
                </div>
              ) : (
                /* 残り枚数 + ドット */
                <div className="space-y-2.5">
                  <div className="flex items-center gap-4">
                    <span className="h-px bg-iron/40 w-12" />
                    <p className="text-brand-label !text-dust !font-bold">
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
            {isSoldOut ? (
              /* SOLD OUT 時は CTA を非活性に */
              <span className="font-sans text-[13px] font-medium text-iron/40 uppercase tracking-widest inline-flex items-center gap-2 cursor-not-allowed select-none">
                <span>{cta}</span>
                <span>—</span>
              </span>
            ) : (
              <Link
                href={siteContent.brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-link group"
              >
                <span className="link-underline-grow">{cta}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
