import { siteContent } from "@/data/siteContent";

export default function ManifestoStrip() {
  return (
    <section className="section-gap-before relative overflow-hidden bg-void border-y border-cinder/45">
      <div className="container-base py-9 md:py-[4.5rem]">
        <div className="grid gap-8 md:grid-cols-[0.32fr_1fr] md:items-end">
          <p className="text-brand-label text-iron">{siteContent.manifesto.kicker}</p>
          <div>
            <p className="font-display text-[clamp(3rem,13vw,7.5rem)] leading-[0.86] tracking-tight text-bone">
              {siteContent.manifesto.line1}
            </p>
            <p className="mt-5 max-w-2xl font-mono text-[10px] uppercase tracking-[0.28em] text-dust/65 md:mt-6 md:text-[11px]">
              {siteContent.manifesto.line2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
