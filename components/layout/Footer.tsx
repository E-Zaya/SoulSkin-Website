import Link from "next/link";
import { Camera as InstagramIcon } from "lucide-react";
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
    <footer className="relative overflow-hidden border-t border-cinder bg-void">
      <NoiseAccent
        inset="0 0 auto 0"
        width="60%"
        height="80px"
        opacity={0.03}
        tileSize="180px"
      />

      <div className="container-base relative z-10 flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between md:py-12">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-fit text-brand-display text-[26px] leading-none transition-opacity hover:opacity-70 md:text-[30px]"
            aria-label={siteContent.brand.name}
          >
            {siteContent.brand.name}
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-widest text-iron">
            {siteContent.brand.location}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-iron/60">
            {siteContent.brand.taglineShort}
          </span>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5">
            {FOOTER_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="font-mono text-[12px] uppercase tracking-[0.18em] text-dust transition-colors hover:text-bone"
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
            className="inline-flex items-center gap-2 font-sans text-[13px] font-medium text-dust transition-colors duration-200 hover:text-bone"
          >
            <span>Instagram / {siteContent.brand.handle}</span>
            <InstagramIcon size={14} strokeWidth={1.5} aria-hidden="true" />
          </Link>
          {siteContent.brand.email && (
            <Link
              href={`mailto:${siteContent.brand.email}`}
              className="font-mono text-[11px] uppercase tracking-widest text-iron transition-colors hover:text-bone"
            >
              {siteContent.brand.email}
            </Link>
          )}
        </div>
      </div>

      <div className="container-base relative z-10 border-t border-cinder/50 py-3">
        <p className="font-mono text-[11px] tracking-wide text-iron/60">
          {siteContent.brand.copyright}
        </p>
      </div>
    </footer>
  );
}
