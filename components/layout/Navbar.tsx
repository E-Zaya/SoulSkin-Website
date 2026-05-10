"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteContent } from "@/data/siteContent";

const navLinks: ReadonlyArray<{ name: string; href: string }> = [
  { name: "Home", href: "/" },
  { name: "Drops", href: "/drops" },
  { name: "Lookbook", href: "/lookbook" },
  { name: "Pieces", href: "/pieces" },
  { name: "Custom", href: "/custom" },
  { name: "About", href: "/about" },
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

  // Scroll-aware blur — only on first scroll past the threshold
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

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Esc to close + body scroll lock while open
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out nav-shell flex items-center justify-between ${
          hidden && !menuOpen ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        } ${
          scrolled || menuOpen
            ? "bg-void/85 backdrop-blur-lg border-b border-white/[0.04]"
            : "bg-transparent"
        }`}
      >
        {/* Brand link */}
        <Link
          href="/"
          className="font-mono text-[11px] md:text-[var(--text-nav)] text-bone uppercase tracking-[0.22em] select-none transition-opacity duration-300 hover:opacity-70"
          aria-label={siteContent.brand.name}
        >
          {siteContent.brand.name}
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-7 xl:gap-10 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`font-mono text-[11px] md:text-[var(--text-nav)] uppercase tracking-[0.18em] transition-opacity duration-300 hover:opacity-50 ${
                  active ? "text-bone" : "text-bone/65"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Instagram (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-3">
          <Link
            href={siteContent.brand.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-block font-mono text-[var(--text-nav)] text-bone uppercase tracking-[0.18em] transition-opacity duration-300 hover:opacity-70"
          >
            Instagram
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden relative w-8 h-8 flex flex-col items-end justify-center gap-[5px]"
          >
            <span
              className={`block h-px bg-bone transition-all duration-300 ${
                menuOpen ? "w-5 translate-y-[3px] rotate-45" : "w-5"
              }`}
            />
            <span
              className={`block h-px bg-bone transition-all duration-300 ${
                menuOpen ? "w-5 -translate-y-[3px] -rotate-45" : "w-3.5"
              }`}
            />
          </button>
        </div>
      </header>

      {/* Fullscreen mobile overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-void transition-opacity duration-400 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav
          className="relative h-full w-full flex flex-col justify-center px-8"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-5">
            {navLinks.map((link, i) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="block font-display leading-none tracking-tight transition-all duration-300"
                    style={{
                      fontSize: "clamp(2.75rem, 12vw, 4.25rem)",
                      color: active
                        ? "var(--color-bone)"
                        : "rgba(237, 232, 225, 0.55)",
                      transform: menuOpen
                        ? "translateY(0)"
                        : "translateY(16px)",
                      opacity: menuOpen ? 1 : 0,
                      transitionDelay: menuOpen ? `${100 + i * 60}ms` : "0ms",
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-12 pt-8 border-t border-cinder/60 flex flex-col gap-3">
            <Link
              href={siteContent.brand.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="font-mono text-[12px] text-bone uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
            >
              Instagram → {siteContent.brand.handle}
            </Link>
            <span className="font-mono text-[10px] text-iron/60 tracking-widest uppercase">
              {siteContent.brand.location}
            </span>
          </div>
        </nav>
      </div>
    </>
  );
}
