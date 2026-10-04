import Link from "next/link";
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
    <footer className="border-t ss-rule bg-void">
      <div className="grid border-b ss-rule md:grid-cols-[1.1fr_1fr_1fr]">
        <div className="flex min-h-48 flex-col justify-between border-b ss-rule p-[var(--ss-gutter)] md:border-b-0 md:border-r">
          <Link href="/" className="w-fit font-display text-xl leading-none tracking-[0.08em] text-bone">
            {siteContent.brand.name}
          </Link>
          <div className="mt-10 space-y-2 text-xs uppercase tracking-[0.16em] text-dust/60">
            <p>{siteContent.brand.location}</p>
            <p>{siteContent.brand.taglineShort}</p>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-x-8 gap-y-3 border-b ss-rule p-[var(--ss-gutter)] md:border-b-0 md:border-r" aria-label="Footer">
          {FOOTER_LINKS.map((link, index) => (
            <Link key={link.name} href={link.href} className="group flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-dust transition-colors hover:text-bone">
              <span className="text-mist">{String(index + 2).padStart(2, "0")}</span>
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="flex min-h-48 flex-col justify-between p-[var(--ss-gutter)]">
          <div className="flex items-center gap-2 ss-kicker">
            <span className="ss-dot" />
            <span>Custom orders open</span>
          </div>
          <Link href={siteContent.brand.url} target="_blank" rel="noopener noreferrer" className="mt-10 flex items-end justify-between gap-4 text-xs uppercase tracking-[0.14em] text-bone hover:text-ember">
            <span>Instagram / {siteContent.brand.handle}</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-2 px-[var(--ss-gutter)] py-4 text-xs uppercase tracking-[0.14em] text-mist sm:flex-row">
        <p>{siteContent.brand.copyright}</p>
        <p>Independent · Made in Ulaanbaatar</p>
      </div>
    </footer>
  );
}
