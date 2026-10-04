import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublicProducts } from "@/lib/public-content";
import { toSlug } from "@/lib/slug";

export const metadata: Metadata = {
  title: "Pieces",
  description: "Hand-finished Soul Skin pieces from Ulaanbaatar.",
  alternates: { canonical: "/pieces" },
};

export default async function PiecesPage() {
  const products = await getPublicProducts();

  return (
    <>
      <Navbar />
      <main id="main" className="ss-public pt-[var(--nav-h)] md:pt-[var(--nav-h-md)]">
        <section className="ss-page-head" aria-labelledby="pieces-heading">
          <div>
            <p className="ss-kicker mb-7">Made to order / Ulaanbaatar</p>
            <h1 id="pieces-heading" className="ss-display">Pieces</h1>
          </div>
          <div className="flex flex-col justify-between gap-10">
            <p className="ss-body">Hand-finished in Ulaanbaatar. Built for repeat wear, hard weather and a silhouette that stays recognizable.</p>
            <div className="flex items-center gap-2 ss-kicker"><span className="ss-dot" /><span>Custom orders open</span></div>
          </div>
        </section>

        <section className="ss-pieces-grid" aria-label="All pieces">
          {products.map((product) => {
            const image = product.images[0]?.image_url ?? product.image_url;
            return (
              <Link key={product.id} href={`/pieces/${toSlug(product.sku)}`} className="ss-catalog-card group">
                <div className="ss-catalog-media">
                  {image && <Image src={image} alt={product.name} fill sizes="(min-width: 900px) 50vw, 100vw" className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.025]" />}
                  <span className="absolute right-4 top-4 z-[2] ss-kicker text-bone/70">Made to order</span>
                </div>
                <div className="ss-catalog-copy">
                  <div className="flex items-start justify-between gap-5">
                    <div><h2 className="ss-product-name">{product.name}</h2><p className="ss-kicker mt-2">{product.sku}</p></div>
                    
                  </div>
                  <dl className="mt-6 border-t ss-rule pt-4">
                    <dt className="ss-kicker">Material</dt>
                    <dd className="ss-meta-value">{product.material}</dd>
                  </dl>
                </div>
              </Link>
            );
          })}
        </section>
      </main>
      <Footer />
    </>
  );
}
