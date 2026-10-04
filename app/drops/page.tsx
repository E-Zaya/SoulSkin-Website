import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublicDrops } from "@/lib/public-content";
import { toSlug } from "@/lib/slug";

export const metadata: Metadata = {
  title: "Drops",
  description: "Limited Soul Skin releases, built and documented in Ulaanbaatar.",
  alternates: { canonical: "/drops" },
};

export default async function DropsPage() {
  const drops = await getPublicDrops();
  const current = drops.find((drop) => drop.active) ?? drops[0];
  const archive = drops.filter((drop) => drop.id !== current?.id);

  return (
    <>
      <Navbar />
      <main id="main" className="ss-public pt-[var(--nav-h)] md:pt-[var(--nav-h-md)]">
        <section className="ss-page-head" aria-labelledby="drops-heading">
          <div>
            <p className="ss-kicker mb-7">All releases / Ulaanbaatar</p>
            <h1 id="drops-heading" className="ss-display">Drops</h1>
          </div>
          <div className="flex flex-col justify-between gap-10">
            <p className="ss-body">
              Limited runs out of Ulaanbaatar. Every drop is a closed window — once it is gone, it stays gone.
            </p>
            <p className="ss-kicker">Release ledger / 2021—present</p>
          </div>
        </section>

        {current ? (
          <section className="ss-drop-feature" aria-labelledby="current-drop-heading">
            <Link href={`/drops/${toSlug(current.label)}`} className="ss-drop-image group">
              {current.image_url && (
                <Image src={current.image_url} alt={`${current.title_line1} ${current.title_line2}`} fill priority sizes="(min-width: 900px) 65vw, 100vw" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]" />
              )}
            </Link>

            <div className="ss-drop-copy">
              <div>
                <div className="ss-drop-status ss-kicker">
                  <span className="ss-dot" />
                  <span className="ss-blue">{current.label}</span>
                  <span className="ss-signal">Live</span>
                  <span>{new Date(current.created_at).getFullYear()}</span>
                </div>
                <h2 id="current-drop-heading" className="ss-drop-title">
                  {current.title_line1}<br />{current.title_line2}
                </h2>
                <p className="ss-body">{current.description}</p>
              </div>

              <div>
                <dl className="mb-6 grid grid-cols-2 gap-4 border-y ss-rule py-5">
                  <div><dt className="ss-kicker">Availability</dt><dd className="ss-meta-value">{current.pieces_left} pieces left</dd></div>
                  <div><dt className="ss-kicker">Made in</dt><dd className="ss-meta-value">Ulaanbaatar</dd></div>
                </dl>
                <Link href={`/drops/${toSlug(current.label)}`} className="ss-link w-full"><span>Enter drop</span></Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="px-[var(--ss-gutter)] py-24"><p className="ss-kicker">No releases published yet.</p></section>
        )}

        <section aria-labelledby="archive-heading">
          <div className="ss-section-label">
            <span id="archive-heading" className="ss-kicker">Archive</span>
            <span className="ss-kicker">{archive.length} {archive.length === 1 ? "release" : "releases"}</span>
          </div>
          <div className="ss-release-list">
            {archive.map((drop, index) => (
              <Link key={drop.id} href={`/drops/${toSlug(drop.label)}`} className="ss-release-row">
                <span className="font-display text-xl text-bone/70 tabular-nums">{String(index + 2).padStart(2, "0")}</span>
                <span><strong className="block font-display text-xl uppercase text-bone">{drop.title_line1} {drop.title_line2}</strong><span className="ss-kicker mt-1 block">{drop.label}</span></span>
                <span className="ss-kicker">{new Date(drop.created_at).toLocaleDateString("en", { month: "short", year: "numeric" })}</span>
                <span className="ss-kicker">Archived</span>
                
              </Link>
            ))}
          </div>
        </section>

        <section className="ss-meta-grid">
          <div className="ss-meta-cell"><p className="ss-kicker">Method</p><p className="ss-meta-value">Limited runs</p></div>
          <div className="ss-meta-cell"><p className="ss-kicker">Origin</p><p className="ss-meta-value">Ulaanbaatar</p></div>
          <div className="ss-meta-cell"><p className="ss-kicker">Ordering</p><p className="ss-meta-value">Via Instagram</p></div>
          <div className="ss-meta-cell"><p className="ss-kicker">Archive</p><p className="ss-meta-value">Permanent record</p></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
