import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getAllPublicDrops } from "@/lib/db";
import { toSlug } from "@/lib/slug";

export const metadata: Metadata = {
  title: "Drops — Soul Skin",
  description:
    "Every Soul Skin release. Limited drops out of Ulaanbaatar — each piece is a document of the season it was made in.",
  openGraph: {
    title: "Drops — Soul Skin",
    description:
      "Every Soul Skin release. Limited drops out of Ulaanbaatar — each piece is a document of the season it was made in.",
    type: "website",
  },
};

async function safeGetAllPublicDrops() {
  try {
    return await getAllPublicDrops();
  } catch (error) {
    console.error("[drops] safeGetAllPublicDrops", error);
    return [];
  }
}

export default async function DropsPage() {
  const drops = await safeGetAllPublicDrops();
  const active = drops.find((d) => d.active) ?? null;
  const past = drops.filter((d) => !d.active);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "var(--nav-h)" }}>
        {/* Page header */}
        <section className="bg-void section-pad-tight border-b border-cinder/40">
          <div className="container-base">
            <ScrollReveal variant="fade-up">
              <p className="text-brand-label mb-4">All Releases</p>
              <h1 className="text-brand-display display-section">DROPS</h1>
              <p className="body-copy text-dust/70 mt-5 max-w-[480px]">
                Limited runs out of Ulaanbaatar. Every drop is a closed window —
                once it&apos;s gone, it stays gone.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Active drop — feature card */}
        {active && (
          <section className="relative bg-ash overflow-hidden">
            <div className="editorial-split flex flex-col md:flex-row">
              <Link
                href={`/drops/${toSlug(active.label)}`}
                className="relative md:w-[64%] aspect-[4/5] md:aspect-[16/13] shrink-0 overflow-hidden block group"
              >
                {active.image_url && (
                  <Image
                    src={active.image_url}
                    alt={`${active.title_line1} ${active.title_line2} — Soul Skin Drop`}
                    fill
                    priority
                    sizes="(min-width: 768px) 64vw, 100vw"
                    className="object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-[1.03]"
                  />
                )}
              </Link>

              <div className="relative md:w-[36%] flex flex-col justify-center px-6 md:px-12 lg:px-14 section-pad-editorial">
                <ScrollReveal delay={0}>
                  <p className="text-brand-label mb-5 flex items-center gap-2.5">
                    <span className="text-ember">{active.label}</span>
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "var(--color-rust)" }}
                      aria-hidden="true"
                    />
                    <span style={{ color: "var(--color-rust)" }}>LIVE</span>
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={80}>
                  <h2 className="text-brand-display display-section mb-5">
                    {active.title_line1}
                    <br />
                    {active.title_line2}
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={160}>
                  <p className="body-copy text-dust mb-7 text-measure-sm">
                    {active.description}
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={240}>
                  <Link
                    href={`/drops/${toSlug(active.label)}`}
                    className="cta-link group"
                  >
                    <span className="link-underline-grow">View this drop</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </ScrollReveal>
              </div>
            </div>
          </section>
        )}

        {/* Past drops grid */}
        {past.length > 0 && (
          <section className="relative bg-void section-pad overflow-hidden">
            <div className="container-base">
              <ScrollReveal variant="fade-up">
                <div className="flex items-center gap-5 mb-10 md:mb-14">
                  <span className="text-brand-label !text-iron">Archive</span>
                  <span className="h-px bg-iron/30 flex-1" />
                  <span className="font-mono text-[11px] text-iron/50 tracking-widest">
                    {past.length} DROP{past.length !== 1 ? "S" : ""}
                  </span>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-6">
                {past.map((drop, i) => {
                  const title = `${drop.title_line1} ${drop.title_line2}`;
                  const year = new Date(drop.created_at).getFullYear();
                  const slug = toSlug(drop.label);

                  return (
                    <ScrollReveal key={drop.id} delay={i * 60} variant="fade-up">
                      <Link
                        href={`/drops/${slug}`}
                        className="group relative block"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-ash">
                          {drop.image_url && (
                            <Image
                              src={drop.image_url}
                              alt={`${title} — Soul Skin`}
                              fill
                              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                              className="object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-[1.04] grayscale"
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                              className="px-3 py-1.5 rotate-[-8deg]"
                              style={{
                                backdropFilter: "blur(2px)",
                                backgroundColor: "rgba(10,9,8,0.45)",
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "rgba(168, 69, 62, 0.55)",
                              }}
                            >
                              <span
                                className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase"
                                style={{ color: "rgba(216, 158, 152, 0.85)" }}
                              >
                                SOLD OUT
                              </span>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-void/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        <div className="mt-3 flex items-start justify-between gap-2">
                          <div>
                            <p className="font-display text-bone text-[15px] md:text-[17px] leading-none tracking-tight">
                              {title}
                            </p>
                            <p className="font-mono text-[10px] text-iron/60 tracking-widest mt-1.5">
                              {drop.label}
                            </p>
                          </div>
                          <span className="font-mono text-[10px] text-iron/40 tracking-widest shrink-0 mt-0.5">
                            {year}
                          </span>
                        </div>
                      </Link>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {drops.length === 0 && (
          <section className="bg-void section-pad text-center">
            <p className="font-mono text-[11px] text-iron/60 tracking-widest uppercase">
              No drops yet — check back soon.
            </p>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
