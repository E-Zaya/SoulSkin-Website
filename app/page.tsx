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

const chapters = [
  { label: "Manifesto", href: "#manifesto" },
  { label: "Live drop", href: "#drop" },
  { label: "Selected pieces", href: "#pieces" },
  { label: "Lookbook", href: "#lookbook" },
  { label: "Atelier", href: "#atelier" },
];

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
      <main id="main" className="ss-public">
        <Hero imageUrl={siteSettings.hero_image_url} />

        <section id="manifesto" className="ss-home-index" aria-labelledby="manifesto-heading">
          <nav className="ss-home-chapters" aria-label="On this page">
            <p className="ss-kicker">On this page</p>
            <ol>
              {chapters.map((chapter) => (
                <li key={chapter.href}>
                  <a href={chapter.href} className="inline-flex min-h-11 items-center transition-colors hover:text-bone">
                    {chapter.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="ss-home-manifesto">
            {/* The one scroll reveal on the site: the manifesto is the showpiece. */}
            <ScrollReveal variant="fade-up">
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
            <p className="ss-kicker">Field note</p>
            <p className="font-sans text-lg italic leading-tight text-bone/90">
              “Clothing should feel lived in before the first night out.”
            </p>
          </div>
        </section>

        {currentDrop && (
          <section id="drop" aria-labelledby="home-drop-heading">
            <div className="ss-section-label">
              <span className="ss-kicker ss-blue">Live drop</span>
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
                  Ulaanbaatar
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
                  <dl className="mb-6 grid grid-cols-2 gap-4 border-y ss-rule py-5">
                    <div>
                      <dt className="ss-kicker">Availability</dt>
                      <dd className="ss-meta-value">{currentDrop.pieces_left} pieces left</dd>
                    </div>
                    <div>
                      <dt className="ss-kicker">Made in</dt>
                      <dd className="ss-meta-value">Ulaanbaatar</dd>
                    </div>
                  </dl>
                  <Link href={`/drops/${toSlug(currentDrop.label)}`} className="ss-link w-full">
                    Enter drop
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="pieces" aria-labelledby="pieces-heading">
          <div className="ss-section-label">
            <span id="pieces-heading" className="ss-kicker">Selected pieces</span>
            <Link href="/pieces" className="ss-kicker inline-flex min-h-11 items-center transition-colors hover:text-bone">View all pieces</Link>
          </div>
          <div className="ss-products-home">
            {featuredProducts.map((product) => {
              const image = product.images[0]?.image_url ?? product.image_url;
              return (
                <div key={product.id} className="ss-product-card">
                  <Link href={`/pieces/${toSlug(product.sku)}`} className="group block">
                    <div className="ss-product-media">
                      {image && (
                        <Image src={image} alt={product.name} fill sizes="(min-width: 600px) 50vw, 100vw" className="object-cover" />
                      )}
                      <span className="absolute left-4 top-4 z-[2] ss-kicker text-bone/65">
                        {product.sku}
                      </span>
                    </div>
                    <div className="ss-product-caption">
                      <div>
                        <h3 className="ss-product-name">{product.name}</h3>
                        <p className="ss-kicker mt-2">{product.material}</p>
                      </div>
                      <span className="ss-kicker text-bone/70">Made to order</span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {featuredLookbook.length > 0 && (
          <section id="lookbook" aria-labelledby="lookbook-heading">
            <div className="ss-section-label">
              <span id="lookbook-heading" className="ss-kicker ss-blue">Lookbook</span>
              <Link href="/lookbook" className="ss-kicker inline-flex min-h-11 items-center transition-colors hover:text-bone">Open the lookbook</Link>
            </div>
            <div className="ss-lookbook-home">
              {featuredLookbook.map((item) => (
                <Link key={item.id} href="/lookbook" className="ss-lookbook-frame">
                  <Image src={item.image_url || "/lookbook-01.webp"} alt={item.item_id} fill sizes="(min-width: 600px) 33vw, 100vw" className="object-cover" />
                  <span className="ss-kicker text-bone">{item.item_id}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section id="atelier" className="ss-atelier-banner" aria-labelledby="atelier-heading">
          <div className="ss-atelier-copy">
            <p className="ss-kicker ss-blue">Atelier</p>
            <div>
              <h2 id="atelier-heading" className="ss-display-sm">Made for one.</h2>
              <p className="ss-body mt-6">Small runs. Personal process. Cut, finished and checked by hand in Ulaanbaatar.</p>
            </div>
          </div>
          <div className="flex flex-col justify-between bg-bone !text-void">
            <p className="text-xs uppercase tracking-label text-void/55">Custom orders / Open</p>
            <Link href="/custom" className="group inline-flex min-h-11 items-end">
              <span className="font-display text-2xl leading-[0.86] uppercase transition-transform group-hover:translate-x-2">Start a project</span>
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
