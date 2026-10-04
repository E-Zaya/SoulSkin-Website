import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteContent } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "Custom Atelier",
  description: "One-of-one Soul Skin pieces, designed and hand-finished in Ulaanbaatar.",
  alternates: { canonical: "/custom" },
};

const steps = [
  { no: "01", title: "Brief", body: "Share references, fit notes and the details that matter. We confirm scope and timing." },
  { no: "02", title: "Build", body: "Pattern, cut and construction. Every decision is made with intention." },
  { no: "03", title: "Finish", body: "Hand-finished, inspected and signed in our Ulaanbaatar studio." },
];

export default function CustomPage() {
  return (
    <>
      <Navbar />
      <main className="ss-public pt-[var(--nav-h)] md:pt-[var(--nav-h-md)]">
        <section className="ss-custom-hero" aria-labelledby="custom-heading">
          <div className="ss-custom-copy">
            <div>
              <p className="ss-kicker mb-8">Custom / Atelier</p>
              <h1 id="custom-heading" className="ss-display-sm">Made<br />for one.</h1>
            </div>
            <div>
              <p className="ss-body">In Ulaanbaatar, we cut, shape and finish each custom piece by hand — in small runs for people who choose their own path.</p>
              <div className="mt-8 flex items-center gap-2 ss-kicker"><span className="ss-dot" /><span>Custom orders / Open</span></div>
            </div>
          </div>
          <div className="ss-custom-image">
            <Image src="/product-hoodie.png" alt="Soul Skin custom hoodie" fill priority sizes="(min-width: 900px) 65vw, 100vw" className="object-cover object-center scale-[1.08]" />
            <div className="absolute inset-0 bg-gradient-to-r from-void/25 via-transparent to-transparent" />
          </div>
        </section>

        <section className="ss-process-grid" aria-label="How a custom order works">
          {steps.map((step) => (
            <article key={step.no} className="ss-process-card">
              <span className="ss-process-no tabular-nums">{step.no}</span>
              <h2 className="mt-6 text-xs uppercase tracking-[0.18em] text-bone">{step.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-dust/70">{step.body}</p>
            </article>
          ))}
        </section>

        <section className="ss-material-grid" aria-labelledby="start-heading">
          <div>
            <p className="ss-kicker mb-8">From the studio</p>
            <div className="relative aspect-[16/10] overflow-hidden bg-ash">
              <Image src="/lookbook-03.png" alt="Soul Skin piece worn in Ulaanbaatar at night" fill sizes="(min-width: 900px) 55vw, 100vw" className="object-cover" />
            </div>
          </div>

          <div className="flex flex-col justify-between bg-ash">
            <p className="ss-kicker ss-blue">Ready to build?</p>
            <div>
              <h2 id="start-heading" className="ss-display-sm">Start a custom</h2>
              <p className="ss-body mt-6">Send the item, size, references and desired timing. We reply with the next step.</p>
              <Link href={siteContent.brand.url} target="_blank" rel="noopener noreferrer" className="ss-link mt-8 w-full"><span>DM on Instagram</span><span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
