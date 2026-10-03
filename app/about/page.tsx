import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteContent } from "@/data/siteContent";
import { getPublicSiteSettings } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "About",
  description: "Soul Skin is an independent streetwear label from Ulaanbaatar, Mongolia.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getPublicSiteSettings();

  return (
    <>
      <Navbar />
      <main className="ss-public pt-[var(--nav-h)] md:pt-[var(--nav-h-md)]">
        <section className="ss-about-story" aria-labelledby="about-heading">
          <div className="ss-about-photo">
            <Image src={settings.about_image_url || "/about.png"} alt="Soul Skin in Ulaanbaatar" fill priority sizes="(min-width: 900px) 55vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-void/55 via-transparent to-void/10" />
            <div className="absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between p-[var(--ss-gutter)]">
              <p className="ss-kicker text-bone/70">About / Field 01</p>
              <p className="ss-kicker text-bone/70">47.9180° N<br />106.9177° E</p>
            </div>
          </div>

          <div className="ss-about-copy">
            <div>
              <div className="flex items-center justify-between gap-4"><p className="ss-kicker">The story</p><p className="ss-kicker ss-signal">UB raw precision</p></div>
              <h1 id="about-heading" className="ss-display-sm mt-10">Choose<br />your skin.</h1>
              <p className="ss-body mt-10">{settings.about_description || siteContent.about.descriptionFallback}</p>
              <p className="ss-body mt-5">Built in Mongolia. Inspired by the steppe, the city and the people who move between them.</p>
            </div>

            <div className="ss-timeline">
              <p className="ss-kicker mb-5">Timeline</p>
              <ol>
                <li><strong className="ss-blue">2021 — Ulaanbaatar</strong><br />Soul Skin is founded. The first pieces are made in small runs.</li>
                <li><strong className="text-bone">Now — Process over hype</strong><br />Limited silhouettes, custom work and hand-finished production continue.</li>
                <li><strong className="text-bone">Next — New chapters</strong><br />The same soul, carried into the next release.</li>
              </ol>
            </div>
          </div>
        </section>

        <blockquote className="ss-quote">
          “We do not follow trends.<br />
          <span className="ss-blue">We build uniforms</span><br />
          for everyday survival.”
        </blockquote>

        <section className="ss-meta-grid">
          <div className="ss-meta-cell"><p className="ss-kicker">Founded</p><p className="ss-meta-value">2021 / Ulaanbaatar</p></div>
          <div className="ss-meta-cell"><p className="ss-kicker">Production</p><p className="ss-meta-value">Hand-finished</p></div>
          <div className="ss-meta-cell"><p className="ss-kicker">Method</p><p className="ss-meta-value">Limited runs</p></div>
          <div className="ss-meta-cell"><p className="ss-kicker">Custom</p><p className="ss-meta-value ss-signal">Open</p></div>
        </section>

        <section className="grid min-h-72 border-b ss-rule md:grid-cols-[1fr_auto]">
          <div className="flex flex-col justify-between border-b ss-rule p-[var(--ss-gutter)] md:border-b-0 md:border-r">
            <p className="ss-kicker ss-blue">Join the community</p>
            <h2 className="ss-display-sm mt-14">From UB,<br />for everywhere.</h2>
          </div>
          <Link href={siteContent.brand.url} target="_blank" rel="noopener noreferrer" className="group flex min-w-[36vw] items-end justify-between gap-8 bg-bone p-[var(--ss-gutter)] text-void">
            <span className="font-display text-[clamp(3rem,6vw,6rem)] leading-none uppercase">Instagram</span>
            <span className="text-3xl transition-transform group-hover:translate-x-2">↗</span>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
