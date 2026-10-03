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

const process = [
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
              <div className="mt-8 flex items-center gap-2 ss-kicker"><span className="ss-dot" /><span>Atelier runs / Open</span></div>
            </div>
          </div>
          <div className="ss-custom-image">
            <Image src="/product-hoodie.png" alt="Soul Skin custom hoodie construction" fill priority sizes="(min-width: 900px) 65vw, 100vw" className="object-cover object-center scale-[1.08]" />
            <div className="absolute inset-0 bg-gradient-to-r from-void/25 via-transparent to-transparent" />
            <p className="absolute bottom-5 right-5 ss-kicker text-bone/70">Pattern / Fabric / Finish</p>
          </div>
        </section>

        <section className="ss-process-grid" aria-label="Custom process">
          {process.map((step) => (
            <article key={step.no} className="ss-process-card">
              <span className="ss-process-no">{step.no}</span>
              <h2 className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-bone">{step.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-dust/70">{step.body}</p>
            </article>
          ))}
          <article className="ss-process-card bg-bone !text-void">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-void/55">Lead time</p>
            <p className="mt-6 font-display text-5xl leading-none">3–4 weeks</p>
            <p className="mt-5 text-sm leading-relaxed text-void/65">Rush availability depends on current studio capacity.</p>
          </article>
        </section>

        <section className="ss-material-grid" aria-labelledby="materials-heading">
          <div>
            <p id="materials-heading" className="ss-kicker mb-8">Materials / Selected by project</p>
            <div className="grid grid-cols-3 gap-3">
              <figure><div className="aspect-[3/4] border ss-rule bg-[#121212]" /><figcaption className="ss-kicker mt-3">Heavy cotton</figcaption></figure>
              <figure><div className="aspect-[3/4] border ss-rule bg-[#242424] [background-image:radial-gradient(#454545_1px,transparent_1px)] [background-size:5px_5px]" /><figcaption className="ss-kicker mt-3">Canvas</figcaption></figure>
              <figure><div className="aspect-[3/4] border ss-rule bg-[#0d1014] [background-image:linear-gradient(90deg,transparent_48%,#30343b_50%,transparent_52%)] [background-size:8px_8px]" /><figcaption className="ss-kicker mt-3">Rib knit</figcaption></figure>
            </div>
          </div>

          <div>
            <p className="ss-kicker mb-8">Project spotlight / SS-24</p>
            <div className="relative aspect-[16/10] overflow-hidden bg-ash">
              <Image src="/lookbook-03.png" alt="Soul Skin custom project" fill sizes="(min-width: 900px) 40vw, 100vw" className="object-cover" />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-dust/70">
              <dt>Fabric</dt><dd>Heavy cotton</dd><dt>Finish</dt><dd>Screen / Discharge</dd><dt>Run</dt><dd>1 of 1</dd>
            </dl>
          </div>

          <div className="flex flex-col justify-between bg-ash">
            <p className="ss-kicker ss-blue">Ready to build?</p>
            <div>
              <h2 className="ss-display-sm !text-[clamp(3rem,5vw,5rem)]">Start a custom</h2>
              <p className="ss-body mt-6">Send the item, size, references and desired timing. We reply with the next step.</p>
              <Link href={siteContent.brand.url} target="_blank" rel="noopener noreferrer" className="ss-link mt-8 w-full"><span>DM on Instagram</span><span>↗</span></Link>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between gap-4 border-b ss-rule px-[var(--ss-gutter)] py-5">
          <p className="ss-kicker">Lead time &nbsp; <span className="text-bone">3–4 weeks</span></p>
          <p className="ss-kicker"><span className="ss-signal">●</span> Reply within 48h</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
