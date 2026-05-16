import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PieceGallery from "@/components/sections/PieceGallery";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";
import {
  getProductBySlugWithImages,
  getProductsWithImages,
} from "@/lib/db";
import { toSlug } from "@/lib/slug";

export async function generateStaticParams() {
  try {
    const products = await getProductsWithImages();
    return products
      .map((p) => ({ slug: toSlug(p.sku) }))
      .filter((p) => p.slug.length > 0);
  } catch {
    return [];
  }
}

type PieceDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  props: PieceDetailProps
): Promise<Metadata> {
  const { slug } = await props.params;
  try {
    const product = await getProductBySlugWithImages(slug);
    if (!product) return { title: "Piece not found — Soul Skin" };
    const cover =
      product.images && product.images.length > 0
        ? product.images[0].image_url
        : product.image_url ?? undefined;
    return {
      title: `${product.name} — Soul Skin`,
      description: product.description,
      openGraph: {
        title: `${product.name} — Soul Skin`,
        description: product.description,
        type: "article",
        images: cover ? [cover] : undefined,
      },
    };
  } catch {
    return { title: "Piece — Soul Skin" };
  }
}

export default async function PieceDetailPage(props: PieceDetailProps) {
  const { slug } = await props.params;

  let product = null;
  try {
    product = await getProductBySlugWithImages(slug);
  } catch {
    // silently fall through to notFound()
  }
  if (!product) notFound();

  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.image_url)
      : product.image_url
        ? [product.image_url]
        : [];

  if (images.length === 0) notFound();

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
              href="/pieces"
              className="text-iron/70 hover:text-bone transition-colors"
            >
              ← All pieces
            </Link>
            <span className="text-iron/40">/</span>
            <span className="text-dust">{product.sku}</span>
          </div>
        </nav>

        <section className="bg-void">
          <div className="container-base grid grid-cols-1 md:grid-cols-[1fr_380px] lg:grid-cols-[1fr_420px] gap-0 md:gap-10 lg:gap-16 items-start py-8 md:py-12">
            {/* Gallery — 左に大きく */}
            <div className="w-full">
              <PieceGallery images={images} alt={product.name} />
            </div>

            {/* Detail column — sticky で画像スクロール中も見える */}
            <aside className="flex flex-col pt-6 md:pt-0 md:sticky md:top-[calc(var(--nav-h)+2rem)]">
              <ScrollReveal delay={0}>
                <p className="font-mono text-[10px] text-iron/60 tracking-[0.3em] uppercase mb-4">
                  {product.sku}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={80}>
                <h1 className="text-brand-display display-section mb-3">
                  {product.name}
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={140}>
                <p className="font-mono text-[11px] text-dust/60 uppercase tracking-widest mb-6">
                  {product.material}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={160}>
                <div className="h-px bg-cinder/40 mb-6" />
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <p className="body-copy text-dust/80 mb-7 leading-relaxed">
                  {product.description}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={240}>
                <p className="font-mono text-[13px] text-bone tracking-widest mb-8">
                  {product.price}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <Link
                  href={siteContent.brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-cinder w-full px-6 py-4 font-mono text-[11px] tracking-widest uppercase text-dust hover:text-bone hover:border-iron transition-colors"
                >
                  <span>{siteContent.products.cta}</span>
                  <span>→</span>
                </Link>
              </ScrollReveal>
            </aside>
          </div>
        </section>

        <section className="bg-void section-pad-tight border-t border-cinder/40">
          <div className="container-base flex items-center justify-between gap-4">
            <Link
              href="/pieces"
              className="cta-link cta-link-sm text-dust hover:text-bone transition-colors"
            >
              <span>←</span>
              <span className="link-underline-grow">All pieces</span>
            </Link>
            <Link
              href="/custom"
              className="cta-link cta-link-sm text-dust hover:text-bone transition-colors"
            >
              <span className="link-underline-grow">Custom order</span>
              <span>→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
