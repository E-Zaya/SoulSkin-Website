import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PieceGallery from "@/components/sections/PieceGallery";
import { siteContent } from "@/data/siteContent";
import {
  getPublicProductBySlug,
  getPublicProducts,
} from "@/lib/public-content";
import { toSlug } from "@/lib/slug";

export async function generateStaticParams() {
  const products = await getPublicProducts();
  return products
    .map((p) => ({ slug: toSlug(p.sku) }))
    .filter((p) => p.slug.length > 0);
}

type PieceDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  props: PieceDetailProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getPublicProductBySlug(slug);
  if (!product) return { title: "Piece not found" };
  const cover =
    product.images && product.images.length > 0
      ? product.images[0].image_url
      : product.image_url ?? undefined;
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} — Soul Skin`,
      description: product.description,
      type: "article",
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function PieceDetailPage(props: PieceDetailProps) {
  const { slug } = await props.params;

  const product = await getPublicProductBySlug(slug);
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
      <main id="main" className="ss-public pt-[var(--nav-h)] md:pt-[var(--nav-h-md)]">
        <nav className="ss-section-label" aria-label="Breadcrumb">
          <Link href="/pieces" className="ss-kicker transition-colors hover:text-bone">
            All pieces
          </Link>
          <span className="ss-kicker text-bone">{product.sku}</span>
        </nav>

        <section className="ss-piece-detail" aria-labelledby="piece-heading">
          <div className="ss-piece-gallery">
            <PieceGallery images={images} alt={product.name} />
          </div>

          <aside className="ss-piece-panel">
            <div>
              <p className="ss-kicker">{product.sku}</p>
              <h1 id="piece-heading" className="ss-display-sm mt-6">
                {product.name}
              </h1>
              <p className="ss-body mt-8">{product.description}</p>
            </div>

            <div>
              <dl className="mb-6 grid grid-cols-2 gap-4 border-y ss-rule py-5">
                <div>
                  <dt className="ss-kicker">Material</dt>
                  <dd className="ss-meta-value">{product.material}</dd>
                </div>
                <div>
                  <dt className="ss-kicker">Price</dt>
                  <dd className="ss-meta-value">{product.price}</dd>
                </div>
              </dl>
              <Link
                href={siteContent.brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ss-link w-full"
              >
                <span>{siteContent.products.cta}</span>
                
              </Link>
              <p className="ss-kicker mt-4">
                Opens Instagram. Send the piece name and your size.
              </p>
            </div>
          </aside>
        </section>

        <nav className="ss-pager" aria-label="More">
          <Link href="/pieces" className="ss-link">
            
            <span>All pieces</span>
          </Link>
          <Link href="/custom" className="ss-link">
            <span>Custom order</span>
            
          </Link>
        </nav>
      </main>
      <Footer />
    </>
  );
}
