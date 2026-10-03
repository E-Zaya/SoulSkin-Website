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
      <main className="ss-public pt-[var(--nav-h)] md:pt-[var(--nav-h-md)]">
        <section className="ss-page-head" aria-labelledby="pieces-heading">
          <div>
            <p className="ss-kicker mb-7">UB raw precision / Collection 01</p>
            <h1 id="pieces-heading" className="ss-display">Pieces</h1>
          </div>
          <div className="flex flex-col justify-between gap-10">
            <p className="ss-body">Hand-finished in Ulaanbaatar. Built for repeat wear, hard weather and a silhouette that stays recognizable.</p>
            <div className="flex items-center gap-2 ss-kicker"><span className="ss-dot" /><span>Custom orders open</span></div>
          </div>
        </section>

        <section className="ss-pieces-shell">
          <aside className="ss-pieces-rail" aria-label="Collection information">
            <div className="sticky top-24 flex min-h-[70svh] flex-col justify-between">
              <div><p className="ss-kicker ss-blue">UB / RAW / PRECISION</p><div className="mt-7 h-10 w-10 border border-ember/50 rotate-45" /></div>
              <div className="space-y-3 ss-kicker"><p>Ulaanbaatar</p><p>Mongolia</p><p className="pt-5">UB — Est. 2021</p></div>
            </div>
          </aside>

          <div className="ss-pieces-grid">
            {products.map((product, index) => {
              const image = product.images[0]?.image_url ?? product.image_url;
              return (
                <Link key={product.id} href={`/pieces/${toSlug(product.sku)}`} className="ss-catalog-card group">
                  <div className="ss-catalog-media">
                    {image && <Image src={image} alt={product.name} fill sizes="(min-width: 900px) 40vw, 100vw" className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.025]" />}
                    <span className="absolute left-4 top-4 z-[2] ss-kicker text-bone/70">{String(index + 1).padStart(2, "0")}</span>
                    <span className="absolute right-4 top-4 z-[2] ss-kicker ss-signal">Made to order</span>
                  </div>
                  <div className="ss-catalog-copy">
                    <div className="flex items-start justify-between gap-5">
                      <div><h2 className="ss-product-name">{product.name}</h2><p className="ss-kicker mt-2">{product.sku}</p></div>
                      <span className="text-xl transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
                    </div>
                    <dl className="mt-6 grid grid-cols-2 gap-4 border-t ss-rule pt-4 font-mono text-[9px] uppercase tracking-[0.12em]">
                      <div><dt className="text-iron">Material</dt><dd className="mt-2 text-dust">{product.material}</dd></div>
                      <div><dt className="text-iron">Edition</dt><dd className="mt-2 text-dust">SS 24 — {String(index + 1).padStart(2, "0")}</dd></div>
                    </dl>
                  </div>
                </Link>
              );
            })}
          </div>

          <aside className="ss-pieces-filter" aria-label="Catalog index">
            <div className="sticky top-24">
              <div className="flex items-center justify-between"><p className="ss-kicker text-bone">Index</p><span className="ss-kicker">—</span></div>
              <div className="ss-filter-group">
                <p className="ss-kicker">Category</p>
                <ul><li className="!text-bone">All ({String(products.length).padStart(2, "0")})</li><li>Hoodies</li><li>Jackets</li><li>Accessories</li></ul>
              </div>
              <div className="ss-filter-group">
                <p className="ss-kicker">Material</p>
                <ul><li>Cotton fleece</li><li>Cotton canvas</li><li>Nylon</li><li>Leather</li></ul>
              </div>
              <div className="relative mt-8 aspect-[4/5] overflow-hidden bg-ash">
                <Image src="/lookbook-03.png" alt="Soul Skin graphic detail" fill sizes="256px" className="object-cover" />
              </div>
              <p className="ss-kicker mt-8 leading-relaxed">Location / Ulaanbaatar<br />Elevation / 1351m<br />Timezone / UTC +8</p>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
