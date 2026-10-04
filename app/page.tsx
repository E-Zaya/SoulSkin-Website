import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";
import {
  getPublicActiveDrops,
  getPublicLookbook,
  getPublicProducts,
  getPublicSiteSettings,
} from "@/lib/public-content";
import { toSlug } from "@/lib/slug";

const chapters = ["Manifesto", "Live drop", "Selected pieces", "Lookbook", "Atelier"];

export default async function Home() {
  const [drops, products, lookbook, siteSettings] = await Promise.all([
    getPublicActiveDrops(),
    getPublicProducts(),
    getPublicLookbook(),
    getPublicSiteSettings(),
  ]);

  const currentDrop = drops[0];
  const featuredProducts = products.slice(0, 4);
  const featuredLookbook = lookbook.slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="ss-public">
        <Hero imageUrl={siteSettings.hero_image_url} />

        <section className="ss-home-index" aria-labelledby="manifesto-heading">
          <div className="ss-home-chapters">
            <p className="ss-kicker">Chapters / 01—05</p>
            <ol>
              {chapters.map((chapter, index) => (
                <li key={chapter}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{chapter}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="ss-home-manifesto">
            <ScrollReveal variant="fade-up">
              <p className="ss-kicker mb-8">01 / Manifesto</p>
              <h2 id="manifesto-heading">
                Made for the open.
                <br />
                <span className="ss-blue">Built for the city.</span>
              </h2>
              <p className="ss-body mt-8 max-w-xl">
                {siteContent.manifesto.line2} Rooted in the steppe, shaped by
                Ulaanbaatar after dark.
              </p>
            </ScrollReveal>
          </div>

          <div className="ss-home-note">
            <p className="ss-kicker">Field note / UB</p>
            <div>
              <p className="font-sans text-lg italic leading-tight text-bone/90">
                “Clothing should feel lived in before the first night out.”
              </p>
              <p className="ss-kicker mt-6">47.9180° N · 106.9177° E</p>
            </div>
          </div>
        </section>

        {currentDrop && (
          <section id="drop" aria-labelledby="home-drop-heading">
            <div className="ss-section-label">
              <span className="ss-kicker ss-blue">02 / Live drop</span>
              <span className="ss-kicker">Limited release</span>
            </div>
            <div className="ss-drop-feature">
              <Link href={`/drops/${toSlug(currentDrop.label)}`} className="ss-drop-image group">
                {currentDrop.image_url && (
                  <Image
                    src={currentDrop.image_url}
                    alt={`${currentDrop.title_line1} ${currentDrop.title_line2}`}
                    fill
                    sizes="(min-width: 900px) 65vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
                  />
                )}
                <span className="absolute bottom-5 left-5 z-[2] ss-kicker text-bone/70">
                  Ulaanbaatar / Campaign 01
                </span>
              </Link>
              <div className="ss-drop-copy">
                <div>
                  <div className="ss-drop-status ss-kicker">
                    <span className="ss-dot" />
                    <span className="ss-signal">{currentDrop.label} / Live</span>
                  </div>
                  <h2 id="home-drop-heading" className="ss-drop-title">
                    {currentDrop.title_line1}
                    <br />
                    <span className="ss-blue">{currentDrop.title_line2}</span>
                  </h2>
                  <p className="ss-body">{currentDrop.description}</p>
                </div>
                <div>
                  <div className="mb-6 grid grid-cols-2 gap-4 border-y ss-rule py-5">
                    <div>
                      <p className="ss-kicker">Availability</p>
                      <p className="ss-meta-value">{currentDrop.pieces_left} pieces left</p>
                    </div>
                    <div>
                      <p className="ss-kicker">Made in</p>
                      <p className="ss-meta-value">Ulaanbaatar</p>
                    </div>
                  </div>
                  <Link href={`/drops/${toSlug(currentDrop.label)}`} className="ss-link w-full">
                    <span>Enter drop</span><span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section aria-labelledby="pieces-heading">
          <div className="ss-section-label">
            <span className="ss-kicker">03 / Selected pieces</span>
            <Link href="/pieces" className="ss-kicker transition-colors hover:text-bone">View all ↗</Link>
          </div>
          <div className="ss-products-home">
            {featuredProducts.map((product, index) => {
              const image = product.images[0]?.image_url ?? product.image_url;
              return (
                <ScrollReveal key={product.id} delay={index * 80} variant="fade-up" className="ss-product-card">
                  <Link href={`/pieces/${toSlug(product.sku)}`} className="group block">
                    <div className="ss-product-media">
                      {image && (
                        <Image src={image} alt={product.name} fill sizes="(min-width: 600px) 50vw, 100vw" className="object-cover" />
                      )}
                      <span className="absolute left-4 top-4 z-[2] ss-kicker text-bone/65">
                        {String(index + 1).padStart(2, "0")} / {product.sku}
                      </span>
                    </div>
                    <div className="ss-product-caption">
                      <div>
                        <h2 id={index === 0 ? "pieces-heading" : undefined} className="ss-product-name">{product.name}</h2>
                        <p className="ss-kicker mt-2">{product.material}</p>
                      </div>
                      <span className="ss-kicker text-bone/70">DM to order ↗</span>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {featuredLookbook.length > 0 && (
          <section aria-labelledby="lookbook-heading">
            <div className="ss-section-label">
              <span id="lookbook-heading" className="ss-kicker ss-blue">04 / Lookbook</span>
              <Link href="/lookbook" className="ss-kicker transition-colors hover:text-bone">UB night files ↗</Link>
            </div>
            <div className="ss-lookbook-home">
              {featuredLookbook.map((item, index) => (
                <Link key={item.id} href="/lookbook" className="ss-lookbook-frame">
                  <Image src={item.image_url || "/lookbook-01.png"} alt={item.item_id} fill sizes="(min-width: 600px) 33vw, 100vw" className="object-cover" />
                  <span className="ss-kicker text-bone">{String(index + 1).padStart(3, "0")} / {item.item_id}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="ss-atelier-banner" aria-labelledby="atelier-heading">
          <div className="ss-atelier-copy">
            <p className="ss-kicker ss-blue">05 / Atelier</p>
            <div>
              <h2 id="atelier-heading" className="ss-display-sm">Made for one.</h2>
              <p className="ss-body mt-6">Small runs. Personal process. Cut, finished and checked by hand in Ulaanbaatar.</p>
            </div>
          </div>
          <div className="flex flex-col justify-between bg-bone !text-void">
            <p className="text-xs uppercase tracking-[0.2em] text-void/55">Custom orders / Open</p>
            <Link href="/custom" className="group flex items-end justify-between gap-6">
              <span className="font-display text-lg leading-[0.86] uppercase">Start a project</span>
              <span className="text-xl transition-transform group-hover:translate-x-2">→</span>
            </Link>
          </div>
        </section>

        <section className="ss-meta-grid">
          <div className="ss-meta-cell"><p className="ss-kicker">Founded</p><p className="ss-meta-value">2021</p></div>
          <div className="ss-meta-cell"><p className="ss-kicker">Studio</p><p className="ss-meta-value">Ulaanbaatar, MN</p></div>
          <div className="ss-meta-cell"><p className="ss-kicker">Production</p><p className="ss-meta-value">Hand-finished</p></div>
          <div className="ss-meta-cell"><p className="ss-kicker">Philosophy</p><p className="ss-meta-value">Limited / Intentional</p></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
