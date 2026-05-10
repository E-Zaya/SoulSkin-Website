import Link from "next/link";
import NoiseAccent from "@/components/ui/NoiseAccent";
import { siteContent } from "@/data/siteContent";

const FOOTER_LINKS: ReadonlyArray<{ name: string; href: string }> = [
  { name: "Drops", href: "/drops" },
  { name: "Lookbook", href: "/lookbook" },
  { name: "Pieces", href: "/pieces" },
  { name: "Custom", href: "/custom" },
  { name: "About", href: "/about" },
];

export default function Footer() {
  return (
    <footer className="relative bg-void border-t border-cinder overflow-hidden">
      {/* Noise: very thin strip at the top border — barely visible */}
      <NoiseAccent
        inset="0 0 auto 0"
        width="60%"
        height="80px"
        opacity={0.03}
        tileSize="180px"
      />

      {/* Top row: brand / links / Instagram */}
      <div className="relative z-10 container-base py-10 md:py-12 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="text-brand-display text-[26px] md:text-[30px] leading-none hover:opacity-70 transition-opacity w-fit"
            aria-label={siteContent.brand.name}
          >
            {siteContent.brand.name}
          </Link>
          <span className="font-mono text-[11px] text-iron tracking-widest uppercase">
            {siteContent.brand.location}
          </span>
          <span className="font-mono text-[10px] text-iron/60 tracking-widest uppercase">
            {siteContent.brand.taglineShort}
          </span>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5">
            {FOOTER_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="font-mono text-[12px] text-dust hover:text-bone tracking-[0.18em] uppercase transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3 md:items-end">
          <Link
            href={siteContent.brand.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[13px] font-medium text-dust hover:text-bone transition-colors duration-200"
          >
            Instagram → {siteContent.brand.handle}
          </Link>
          {siteContent.brand.email && (
            <Link
              href={`mailto:${siteContent.brand.email}`}
              className="font-mono text-[11px] text-iron hover:text-bone tracking-widest uppercase transition-colors"
            >
              {siteContent.brand.email}
            </Link>
          )}
        </div>
      </div>

      {/* Bottom: copyright */}
      <div className="relative z-10 border-t border-cinder/50 container-base py-3">
        <p className="font-mono text-[11px] text-iron/60 tracking-wide">
          {siteContent.brand.copyright}
        </p>
      </div>
    </footer>
  );
}
