import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteContent } from "@/data/siteContent";

export default function Products() {
  return (
    <section id="archive" className="bg-void py-10 md:py-14">
      <div className="container-base">

        {/* Section label */}
        <ScrollReveal className="mb-10" variant="fade-left">
          <p className="text-brand-label">
            {siteContent.products.label}
          </p>
        </ScrollReveal>

        {/* 3-col grid — tighter gap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
          {siteContent.products.items.map((product, i) => (
            <ScrollReveal
              key={product.id}
              delay={i * 120}
              variant={i === 1 ? "fade-up" : "fade-only"}
            >
              <div className={`group ${product.offset}`}>

                {/* Image — no bg-ash card feel, just raw image */}
                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
                  />
                  {/* Hover: code overlay slides in from bottom */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-void/60 backdrop-blur-[4px] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <p className="font-mono text-[10px] text-dust tracking-widest">
                      {product.id}
                    </p>
                  </div>
                </div>

                {/* Name — tracks with hover (slight lift) */}
                <h3 className="text-brand-display text-[22px] mb-1 transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
                  {product.name}
                </h3>

                {/* Material tag */}
                <p className="font-mono text-[10px] text-iron uppercase tracking-widest mb-2 transition-colors duration-300 group-hover:text-dust">
                  {product.material}
                </p>

                {/* Short Description */}
                <p className="font-sans text-[12px] text-dust/70 leading-relaxed mb-3 max-w-[90%]">
                  {product.desc}
                </p>

                {/* Price */}
                <p className="font-mono text-[10px] text-bone/50 tracking-widest mb-4">
                  {product.price}
                </p>

                {/* CTA — underline grows on hover */}
                <Link
                  href={siteContent.brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline-grow font-sans text-[11px] font-medium text-dust tracking-[0.2em] uppercase group-hover:text-bone transition-colors duration-200"
                >
                  {siteContent.products.cta}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
