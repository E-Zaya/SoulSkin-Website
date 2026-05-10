import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NoiseAccent from "@/components/ui/NoiseAccent";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";
import { getAllPublicDrops, getDropBySlugWithImages } from "@/lib/db";
import { toSlug } from "@/lib/slug";

const DOT_MAX = 10;

function ScarcityDots({ piecesLeft }: { piecesLeft: number }) {
  const filled = Math.min(piecesLeft, DOT_MAX);
  const empty = DOT_MAX - filled;
  return (
    <div className="flex items-center gap-[5px]">
      {Array.from({ length: filled }).map((_, i) => (
        <span
          key={`f-${i}`}
          className="block rounded-full bg-ember"
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

export async function generateStaticParams() {
  try {
    const drops = await getAllPublicDrops();
    return drops
      .map((d) => ({ slug: toSlug(d.label) }))
      .filter((p) => p.slug.length > 0);
  } catch (error) {
    console.error("[drops/[slug]] generateStaticParams", error);
    return [];
  }
}

type DropDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  props: DropDetailProps
): Promise<Metadata> {
  const { slug } = await props.params;
  try {
    const drop = await getDropBySlugWithImages(slug);
    if (!drop) return { title: "Drop not found — Soul Skin" };
    const title = `${drop.title_line1} ${drop.title_line2} — ${drop.label}`;
    return {
      title: `${title} — Soul Skin`,
      description: drop.description,
      openGraph: {
        title: `${title} — Soul Skin`,
        description: drop.description,
        type: "article",
        images: drop.image_url ? [drop.image_url] : undefined,
      },
    };
  } catch {
    return { title: "Drop — Soul Skin" };
  }
}

/**
 * 「メイン画像 + 詳細サブ画像」を全部含めたギャラリー配列を返す。
 * 詳細ページの大小交互エディトリアルで使う。
 */
function buildGallery(
  mainUrl: string | null,
  images: { id: string; image_url: string }[]
): { key: string; url: string }[] {
  const gallery: { key: string; url: string }[] = [];
  if (mainUrl) gallery.push({ key: "main", url: mainUrl });
  for (const img of images) {
    gallery.push({ key: img.id, url: img.image_url });
  }
  return gallery;
}

export default async function DropDetailPage(props: DropDetailProps) {
  const { slug } = await props.params;

  let drop = null;
  try {
    drop = await getDropBySlugWithImages(slug);
  } catch (error) {
    console.error("[drops/[slug]] getDropBySlugWithImages", error);
  }
  if (!drop) notFound();

  const isSoldOut = drop.pieces_left === 0;
  const gallery = buildGallery(drop.image_url, drop.images);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "var(--nav-h)" }}>
        {/* Breadcrumb */}
        <nav
          className="bg-void border-b border-cinder/40"
          aria-label="Breadcrumb"
        >
          <div className="container-base py-4 flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase">
            <Link
              href="/drops"
              className="text-iron/70 hover:text-bone transition-colors"
            >
              ← All drops
            </Link>
            <span className="text-iron/40">/</span>
            <span className="text-dust">{drop.label}</span>
          </div>
        </nav>

        {/* Drop hero */}
        <section className="relative bg-ash overflow-hidden">
          <div className="editorial-split flex flex-col md:flex-row">
            <div className="relative md:w-[64%] aspect-[4/5] md:aspect-[16/13] shrink-0 overflow-hidden">
              {drop.image_url && (
                <Image
                  src={drop.image_url}
                  alt={`${drop.title_line1} ${drop.title_line2} — Soul Skin Drop`}
                  fill
                  priority
                  sizes="(min-width: 768px) 64vw, 100vw"
                  className={`object-cover object-center transition-all duration-700 ${
                    isSoldOut ? "grayscale" : ""
                  }`}
                />
              )}

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

            <div className="relative md:w-[36%] flex flex-col justify-center px-6 md:px-12 lg:px-14 section-pad-editorial">
              <ScrollReveal delay={0}>
                <p className="text-brand-label mb-5 md:mb-6 text-ember">
                  {drop.label}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={80}>
                <h1 className="text-brand-display display-section mb-5 md:mb-6">
                  {drop.title_line1}
                  <br />
                  {drop.title_line2}
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={160}>
                <p className="body-copy text-dust mb-6 md:mb-7 text-measure-sm">
                  {drop.description}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="mb-7 md:mb-8">
                  {isSoldOut ? (
                    <div className="flex items-center gap-4">
                      <span className="h-px bg-iron/40 w-12" />
                      <p className="font-mono text-[11px] text-iron/60 tracking-[0.3em] uppercase line-through">
                        SOLD OUT
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-4">
                        <span className="h-px bg-iron/40 w-12" />
                        <p className="text-brand-label !text-ember !font-bold">
                          PIECES LEFT:{" "}
                          <span className="tabular-nums">
                            {String(drop.pieces_left).padStart(2, "0")}
                          </span>
                        </p>
                      </div>
                      <div className="pl-16">
                        <ScarcityDots piecesLeft={drop.pieces_left} />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={240}>
                {isSoldOut ? (
                  <span className="font-sans text-[13px] font-medium text-iron/40 uppercase tracking-widest inline-flex items-center gap-2 cursor-not-allowed select-none">
                    <span>{drop.cta}</span>
                    <span>—</span>
                  </span>
                ) : (
                  <Link
                    href={siteContent.brand.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-link group"
                  >
                    <span className="link-underline-grow">{drop.cta}</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                )}
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Editorial gallery — main + detail images, 大小交互パターン */}
        {gallery.length > 0 && (
          <section className="relative bg-void section-pad overflow-hidden">
            <div className="container-base">
              <ScrollReveal variant="fade-up">
                <div className="flex items-center gap-5 mb-10 md:mb-14">
                  <span className="text-brand-label !text-iron">Detail</span>
                  <span className="h-px bg-iron/30 flex-1" />
                  <span className="font-mono text-[11px] text-iron/50 tracking-widest">
                    {String(gallery.length).padStart(2, "0")} IMAGE
                    {gallery.length !== 1 ? "S" : ""}
                  </span>
                </div>
              </ScrollReveal>

              {/* Saint Laurent 風: cycle of 3
                    i % 3 === 0 → full width
                    i % 3 === 1 → 60% 右寄せ
                    i % 3 === 2 → 60% 左寄せ
                  モバイルでは全部フルワイド単縦並び (overflow しないように)。
              */}
              <div className="space-y-6 md:space-y-12">
                {gallery.map((img, i) => {
                  const mod = i % 3;
                  const isFull = mod === 0;
                  const alignRight = mod === 1;
                  // mod 2 → 左寄せ
                  const wrapperClass = isFull
                    ? "w-full"
                    : alignRight
                    ? "w-full md:w-[62%] md:ml-auto"
                    : "w-full md:w-[62%] md:mr-auto";
                  // 大は 4:5、小は 3:4 (より縦長) で雰囲気を変える
                  const aspectClass = isFull
                    ? "aspect-[4/5] md:aspect-[16/10]"
                    : "aspect-[3/4]";

                  return (
                    <ScrollReveal
                      key={img.key}
                      delay={i * 60}
                      variant={isFull ? "fade-up" : alignRight ? "fade-left" : "fade-up"}
                    >
                      <figure className={wrapperClass}>
                        <div
                          className={`relative ${aspectClass} overflow-hidden bg-ash`}
                        >
                          <Image
                            src={img.url}
                            alt={`${drop.title_line1} ${drop.title_line2} — image ${i + 1}`}
                            fill
                            sizes={
                              isFull
                                ? "(min-width: 1024px) 1200px, 100vw"
                                : "(min-width: 768px) 62vw, 100vw"
                            }
                            className={`object-cover object-center ${
                              isSoldOut ? "grayscale" : ""
                            }`}
                          />
                        </div>
                        <figcaption className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-widest text-iron/50 uppercase">
                          <span>
                            {drop.label} · {String(i + 1).padStart(2, "0")} /{" "}
                            {String(gallery.length).padStart(2, "0")}
                          </span>
                          {i === 0 && <span>Cover</span>}
                        </figcaption>
                      </figure>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Back to all drops */}
        <section className="bg-void section-pad-tight border-t border-cinder/40">
          <div className="container-base flex items-center justify-between gap-4">
            <Link
              href="/drops"
              className="cta-link cta-link-sm text-dust hover:text-bone transition-colors"
            >
              <span>←</span>
              <span className="link-underline-grow">All drops</span>
            </Link>
            <Link
              href="/lookbook"
              className="cta-link cta-link-sm text-dust hover:text-bone transition-colors"
            >
              <span className="link-underline-grow">Lookbook</span>
              <span>→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
