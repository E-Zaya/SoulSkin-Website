import { siteContent } from "@/data/siteContent";

const brandNotes = [
  ["01", "Limited drops", "Small runs keep each release focused and easy to recognize."],
  ["02", "Custom work", "Made-to-order details for people who want one piece, not a uniform."],
  ["03", "UB texture", "Concrete, night light, weather, and movement shape the visual language."],
];

export default function ManifestoStrip() {
  return (
    <section className="relative overflow-hidden bg-void border-y border-cinder/45">
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

        <div className="mt-9 grid border-t border-cinder/60 md:mt-14 md:grid-cols-3">
          {brandNotes.map(([number, title, copy]) => (
            <div
              key={number}
              className="border-b border-cinder/60 py-5 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-[0.24em] text-ember">
                  {number}
                </span>
                <span className="h-px flex-1 bg-cinder/80" aria-hidden="true" />
              </div>
              <h3 className="font-display text-[2rem] leading-none text-bone">
                {title}
              </h3>
              <p className="mt-3 max-w-[18rem] font-sans text-[13px] leading-relaxed text-dust/68">
                {copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
