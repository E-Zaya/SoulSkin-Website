"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteContent } from "@/data/siteContent";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Drop", href: "#drop" },
  { name: "Lookbook", href: "#lookbook" },
  { name: "Pieces", href: "#archive" },
  { name: "About", href: "#about" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // Header state — adds blur only after the page starts scrolling.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 nav-shell flex items-center justify-between ${
        scrolled
          ? "bg-void/80 backdrop-blur-lg border-b border-white/[0.04]"
          : "bg-transparent"
      }`}
    >
      {/* Brand link */}
      <Link
        href="#home"
        className="font-mono text-[10px] md:text-[11px] text-bone uppercase tracking-[0.25em] select-none transition-opacity duration-300 hover:opacity-70"
        aria-label={siteContent.brand.name}
      >
        {siteContent.brand.name}
      </Link>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center gap-8 xl:gap-12 absolute left-1/2 -translate-x-1/2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="font-mono text-[10px] md:text-[11px] text-bone uppercase tracking-[var(--tracking-brand-nav)] transition-opacity duration-300 hover:opacity-50"
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Instagram CTA — kept visible on mobile instead of a non-functional menu */}
      <Link
        href={siteContent.brand.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[10px] md:text-[11px] text-bone uppercase tracking-[var(--tracking-brand-nav)] transition-opacity duration-300 hover:opacity-70"
      >
        Instagram
      </Link>
    </header>
  );
}
