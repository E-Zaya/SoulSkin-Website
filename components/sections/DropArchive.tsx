import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { Drop } from "@/lib/db";

type Props = {
  drops: Drop[];
};

export default function DropArchive({ drops }: Props) {
  if (drops.length === 0) return null;

  return (
    <section className="relative bg-void section-pad overflow-hidden">
      <div className="container-base">
        {/* Section header */}
        <ScrollReveal delay={0} variant="fade-up">
          <div className="flex items-center gap-5 mb-10 md:mb-14">
            <span className="text-brand-label !text-iron">PREVIOUS RELEASES</span>
            <span className="h-px bg-iron/30 flex-1" />
            <span className="font-mono text-[11px] text-iron/50 tracking-widest">
              {drops.length} DROP{drops.length !== 1 ? "S" : ""}
            </span>
          </div>
        </ScrollReveal>

        {/* Grid of past drops */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {drops.map((drop, i) => {
            const imageSrc = drop.image_url ?? "/lookbook-01.png";
            const title = `${drop.title_line1} ${drop.title_line2}`;
            const year = new Date(drop.created_at).getFullYear();

            return (
              <ScrollReveal key={drop.id} delay={i * 60} variant="fade-up">
                <div className="group relative">
                  {/* Image container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-ash">
                    <Image
                      src={imageSrc}
                      alt={`${title} — Soul Skin`}
                      fill
                      className="object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-[1.04] grayscale"
                    />

                    {/* SOLD OUT stamp */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="border border-iron/60 px-3 py-1.5 rotate-[-8deg]"
                        style={{
                          backdropFilter: "blur(2px)",
                          backgroundColor: "rgba(10,9,8,0.45)",
                        }}
                      >
                        <span className="font-mono text-[10px] md:text-[11px] text-iron/80 tracking-[0.3em] uppercase">
                          SOLD OUT
                        </span>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-void/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Caption */}
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
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
