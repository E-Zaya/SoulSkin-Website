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
          <Link href="/" className="inline-flex min-h-11 w-fit items-center font-display text-xl leading-none tracking-wide text-bone">
            {siteContent.brand.name}
          </Link>
          <div className="mt-10 space-y-2 text-xs uppercase tracking-label text-dust/60">
            <p>{siteContent.brand.location}</p>
            <p>{siteContent.brand.taglineShort}</p>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-x-8 gap-y-3 border-b ss-rule p-[var(--ss-gutter)] md:border-b-0 md:border-r" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.name} href={link.href} className="flex min-h-11 items-center text-xs uppercase tracking-label text-dust transition-colors hover:text-bone">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex min-h-48 flex-col justify-between p-[var(--ss-gutter)]">
          <div className="flex items-center gap-2 ss-kicker">
            <span className="ss-dot" />
            <span>Custom orders open</span>
          </div>
          <Link href={siteContent.brand.url} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex min-h-11 w-fit items-center text-xs uppercase tracking-label text-bone hover:text-ember">
            Instagram / {siteContent.brand.handle}
          </Link>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-2 px-[var(--ss-gutter)] py-4 text-xs uppercase tracking-label text-mist sm:flex-row">
        <p>{siteContent.brand.copyright}</p>
        <p>Independent label, made in Ulaanbaatar</p>
      </div>
    </footer>
  );
}
