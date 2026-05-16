import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getProductsWithImages } from "@/lib/db";
import { toSlug } from "@/lib/slug";

export const metadata: Metadata = {
  title: "Pieces",
  description:
    "Selected pieces from Soul Skin. Each one is hand-finished in Ulaanbaatar — built to be worn, not to be browsed.",
  alternates: { canonical: "/pieces" },
  openGraph: {
    title: "Pieces — Soul Skin",
    description:
      "Selected pieces from Soul Skin. Each one is hand-finished in Ulaanbaatar — built to be worn, not to be browsed.",
    type: "website",
    url: "/pieces",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Soul Skin Pieces" }],
  },
};

async function safeGetProducts() {
  try {
    return await getProductsWithImages();
  } catch {
    return [];
  }
}

export default async function PiecesPage() {
  const products = await safeGetProducts();

  const items = products
    .map((p) => ({
      id: p.id,
      slug: toSlug(p.sku),
      sku: p.sku,
      name: p.name,
      material: p.material,
      price: p.price,
      cover:
        p.images && p.images.length > 0
          ? p.images[0].image_url
          : p.image_url ?? null,
    }))
    .filter((p) => p.cover && p.slug);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "var(--nav-h)" }}>
        {/* Page header */}
        <section className="bg-void section-pad-tight border-b border-cinder/40">
          <div className="container-base">
            <ScrollReveal variant="fade-up">
              <p className="text-brand-label mb-4">Selected Pieces</p>
              <h1 className="text-brand-display display-section">PIECES</h1>
              <p className="body-copy text-dust/70 mt-5 max-w-[480px]">
                Hand-finished in Ulaanbaatar. Custom orders open via Instagram.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {items.length === 0 ? (
          <section className="bg-void section-pad text-center">
            <p className="font-mono text-[11px] text-iron/60 tracking-widest uppercase">
              No pieces published yet.
            </p>
          </section>
        ) : (
          <section className="bg-void section-pad">
            <div className="container-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {items.map((p, i) => (
                  <ScrollReveal
                    key={p.id}
                    delay={i * 80}
                    variant="fade-up"
                  >
                    <Link
                      href={`/pieces/${p.slug}`}
                      className="group block"
                    >
                      <div className="relative image-frame-product overflow-hidden bg-ash">
                        {p.cover && (
                          <Image
                            src={p.cover}
                            alt={`${p.name} — Soul Skin`}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-[1.03]"
                          />
                        )}
                        <div className="absolute inset-0 bg-void/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div>
                          <h2 className="product-title mb-1">{p.name}</h2>
                          <p className="font-mono text-[10px] text-iron uppercase tracking-widest">
                            {p.material}
                          </p>
                        </div>
                        <p className="font-mono text-[10px] text-bone/55 tracking-widest mt-0.5 shrink-0">
                          {p.price}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
