import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteContent } from "@/data/siteContent";
import {
  getPublicDropBySlug,
  getPublicDrops,
} from "@/lib/public-content";
import { toSlug } from "@/lib/slug";

export async function generateStaticParams() {
  const drops = await getPublicDrops();
  return drops
    .map((d) => ({ slug: toSlug(d.label) }))
    .filter((p) => p.slug.length > 0);
}

type DropDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  props: DropDetailProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const drop = await getPublicDropBySlug(slug);
  if (!drop) return { title: "Drop not found" };
  const title = `${drop.title_line1} ${drop.title_line2} — ${drop.label}`;
  return {
    title,
    description: drop.description,
    openGraph: {
      title: `${title} — Soul Skin`,
      description: drop.description,
      type: "article",
      images: drop.image_url ? [drop.image_url] : undefined,
    },
  };
}

export default async function DropDetailPage(props: DropDetailProps) {
  const { slug } = await props.params;

  const drop = await getPublicDropBySlug(slug);
  if (!drop) notFound();

  const isSoldOut = drop.pieces_left === 0;
  // The cover is shown in the header, so the gallery only lists detail images.
  const gallery = drop.images;

  return (
    <>
      <Navbar />
      <main id="main" className="ss-public pt-[var(--nav-h)] md:pt-[var(--nav-h-md)]">
        <nav className="ss-section-label" aria-label="Breadcrumb">
          <Link href="/drops" className="ss-kicker transition-colors hover:text-bone">
            All drops
          </Link>
          <span className="ss-kicker text-bone">{drop.label}</span>
        </nav>

        <section className="ss-drop-feature" aria-labelledby="drop-heading">
          <div className="ss-drop-image">
            {drop.image_url && (
              <Image
                src={drop.image_url}
                alt={`${drop.title_line1} ${drop.title_line2}`}
                fill
                priority
                sizes="(min-width: 900px) 65vw, 100vw"
                className={`object-cover object-center ${isSoldOut ? "grayscale" : ""}`}
              />
            )}
            {isSoldOut && (
              <span className="absolute left-5 top-5 z-[2] ss-kicker ss-signal">Sold out</span>
            )}
          </div>

          <div className="ss-drop-copy">
            <div>
              <div className="ss-drop-status ss-kicker">
                {!isSoldOut && <span className="ss-dot" />}
                <span className="ss-blue">{drop.label}</span>
                <span className={isSoldOut ? undefined : "ss-signal"}>
                  {isSoldOut ? "Closed" : "Live"}
                </span>
              </div>
              <h1 id="drop-heading" className="ss-drop-title">
                {drop.title_line1}
                <br />
                {drop.title_line2}
              </h1>
              <p className="ss-body">{drop.description}</p>
            </div>

            <div>
              <dl className="mb-6 grid grid-cols-2 gap-4 border-y ss-rule py-5">
                <div>
                  <dt className="ss-kicker">Availability</dt>
                  <dd className="ss-meta-value">
                    {isSoldOut ? "Sold out" : `${drop.pieces_left} pieces left`}
                  </dd>
                </div>
                <div>
                  <dt className="ss-kicker">Made in</dt>
                  <dd className="ss-meta-value">Ulaanbaatar</dd>
                </div>
              </dl>
              {isSoldOut ? (
                <p className="ss-kicker">This release is closed. Custom orders stay open.</p>
              ) : (
                <Link
                  href={siteContent.brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ss-link w-full"
                >
                  <span>{drop.cta}</span>
                  
                </Link>
              )}
            </div>
          </div>
        </section>

        {gallery.length > 0 && (
          <section aria-labelledby="gallery-heading">
            <div className="ss-section-label">
              <span id="gallery-heading" className="ss-kicker">Detail</span>
              <span className="ss-kicker">
                {gallery.length} {gallery.length === 1 ? "image" : "images"}
              </span>
            </div>
            <div className="ss-gallery">
              {gallery.map((img, i) => (
                <figure key={img.id} className={i % 3 === 0 ? "ss-gallery-wide" : undefined}>
                  <div className="relative overflow-hidden bg-ash">
                    <Image
                      src={img.image_url}
                      alt={`${drop.title_line1} ${drop.title_line2} — detail ${i + 1}`}
                      fill
                      sizes={i % 3 === 0 ? "100vw" : "(min-width: 900px) 50vw, 100vw"}
                      className={`object-cover object-center ${isSoldOut ? "grayscale" : ""}`}
                    />
                  </div>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="ss-atelier-banner" aria-labelledby="atelier-heading">
          <div className="ss-atelier-copy">
            <p className="ss-kicker ss-blue">Custom</p>
            <div>
              <h2 id="atelier-heading" className="ss-display-sm">Make it yours.</h2>
              <p className="ss-body mt-6">{siteContent.customOrder.dropVariant.description}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between bg-bone !text-void">
            <p className="text-xs uppercase tracking-label text-void/55">Custom orders / Open</p>
            <Link href="/custom" className="group flex items-end justify-between gap-6">
              <span className="font-display text-2xl leading-[0.86] uppercase">Start a project</span>
              
            </Link>
          </div>
        </section>

        <nav className="ss-pager" aria-label="More">
          <Link href="/drops" className="ss-link">
            
            <span>All drops</span>
          </Link>
          <Link href="/lookbook" className="ss-link">
            <span>Lookbook</span>
            
          </Link>
        </nav>
      </main>
      <Footer />
    </>
  );
}
