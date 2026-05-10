"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera as InstagramIcon } from "lucide-react";
import { siteContent } from "@/data/siteContent";

const navLinks: ReadonlyArray<{ name: string; href: string; index: string }> = [
  { name: "Home", href: "/", index: "01" },
  { name: "Drops", href: "/drops", index: "02" },
  { name: "Lookbook", href: "/lookbook", index: "03" },
  { name: "Pieces", href: "/pieces", index: "04" },
  { name: "Custom", href: "/custom", index: "05" },
  { name: "About", href: "/about", index: "06" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname() || "/";

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      setScrolled(currentY > 20);
      if (Math.abs(diff) > 8) {
        setHidden(currentY > 96 && diff > 0);
        lastScrollY.current = currentY;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const prev = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[70] nav-shell flex items-center justify-center transition-all duration-700 ease-out ${
          hidden && !menuOpen
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        } ${
          scrolled || menuOpen
            ? "border-b border-white/[0.06] bg-void/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="brand-navigation"
          onClick={() => setMenuOpen((v) => !v)}
          className="absolute left-[var(--container-x)] inline-flex h-10 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bone transition-opacity duration-300 hover:opacity-65 md:left-[var(--container-x-md)]"
        >
          <span className="relative flex h-3.5 w-5 items-center" aria-hidden="true">
            <span
              className={`absolute left-0 h-px bg-bone transition-all duration-300 ${
                menuOpen ? "top-1/2 w-5 rotate-45" : "top-1 w-5"
              }`}
            />
            <span
              className={`absolute left-0 h-px bg-bone transition-all duration-300 ${
                menuOpen ? "top-1/2 w-5 -rotate-45" : "top-3 w-3.5"
              }`}
            />
          </span>
          <span>{menuOpen ? "Close" : "Choose"}</span>
        </button>

        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="select-none font-display text-[1.75rem] uppercase leading-none tracking-[0.08em] text-bone transition-opacity duration-300 hover:opacity-75 md:text-[2.25rem]"
          aria-label={siteContent.brand.name}
        >
          {siteContent.brand.name}
        </Link>

        <Link
          href={siteContent.brand.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-[var(--container-x)] inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-bone transition-opacity duration-300 hover:opacity-65 md:right-[var(--container-x-md)]"
          aria-label={`Instagram ${siteContent.brand.handle}`}
        >
          <span>IG</span>
          <InstagramIcon size={13} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </header>

      <div
        id="brand-navigation"
        className={`fixed inset-0 z-[60] bg-void/95 backdrop-blur-xl transition-opacity duration-500 ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      >
        <nav
          className="relative h-full w-full overflow-y-auto px-[var(--container-x)] pb-10 pt-[calc(var(--nav-h)+2.5rem)] md:px-[var(--container-x-md)] md:pb-14 md:pt-[calc(var(--nav-h-md)+4rem)]"
          aria-label="Primary navigation"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="mb-10 font-display text-[3.5rem] uppercase leading-none tracking-[0.08em] text-bone md:mb-14 md:text-[5.5rem]"
            style={{
              transform: menuOpen ? "translateY(0)" : "translateY(14px)",
              opacity: menuOpen ? 1 : 0,
              transition:
                "transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease",
              transitionDelay: menuOpen ? "80ms" : "0ms",
            }}
          >
            {siteContent.brand.name}
          </div>

          <ul className="flex flex-col border-y border-bone/12">
            {navLinks.map((link, i) => {
              const active = isActive(pathname, link.href);

              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-5 border-t border-bone/12 py-3 first:border-t-0 md:gap-8 md:py-4 ${
                      active ? "text-bone" : "text-bone/64"
                    }`}
                    style={{
                      transform: menuOpen
                        ? "translateY(0)"
                        : "translateY(18px)",
                      opacity: menuOpen ? 1 : 0,
                      transitionDelay: menuOpen ? `${100 + i * 60}ms` : "0ms",
                      transitionProperty: "transform, opacity, color",
                      transitionDuration: "520ms",
                      transitionTimingFunction:
                        "cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <span className="w-10 shrink-0 font-mono text-[0.75rem] tracking-[0.18em] text-bone/45 md:w-14 md:text-[0.875rem]">
                      {link.index}
                    </span>
                    <span className="font-display text-[3.25rem] uppercase leading-none tracking-[0.02em] transition-transform duration-300 group-hover:translate-x-3 md:text-[5.75rem] lg:text-[6.75rem]">
                      {link.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-3 md:mt-10">
            <Link
              href={siteContent.brand.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="inline-flex w-fit items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-bone transition-opacity hover:opacity-70"
            >
              <span>Instagram / {siteContent.brand.handle}</span>
              <InstagramIcon size={14} strokeWidth={1.5} aria-hidden="true" />
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-widest text-iron/60">
              {siteContent.brand.location}
            </span>
          </div>
        </nav>
      </div>
    </>
  );
}
