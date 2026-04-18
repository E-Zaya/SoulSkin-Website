"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteContent } from "@/data/siteContent";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Drop", href: "#drop" },
    { name: "Lookbook", href: "#lookbook" },
    { name: "Archive", href: "#archive" },
    { name: "About", href: "#about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center justify-between px-6 md:px-12 xl:px-16 h-14 md:h-16 ${
        scrolled ? "bg-void/80 backdrop-blur-lg border-b border-white/[0.04]" : "bg-transparent"
      }`}
    >
      {/* Brand — Left */}
      <Link
        href="#home"
        className="font-mono text-[10px] md:text-[11px] text-bone uppercase tracking-[0.25em] select-none transition-opacity duration-300 hover:opacity-70"
        aria-label={siteContent.brand.name}
      >
        {siteContent.brand.name}
      </Link>

      {/* Main Nav — Center (Hidden on Mobile) */}
      <nav className="hidden md:flex items-center gap-8 xl:gap-12 absolute left-1/2 -translate-x-1/2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="font-mono text-[10px] md:text-[11px] text-bone uppercase tracking-[0.2em] transition-opacity duration-300 hover:opacity-50"
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* IG Link & Mobile Menu Toggle — Right */}
      <div className="flex items-center gap-6">
        <Link
          href={siteContent.brand.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:block font-mono text-[10px] md:text-[11px] text-bone uppercase tracking-[0.2em] transition-opacity duration-300 hover:opacity-70"
        >
          Instagram
        </Link>
        
        {/* Very minimal mobile menu toggle */}
        <button className="md:hidden font-mono text-[10px] text-bone uppercase tracking-widest hover:opacity-70">
          Menu
        </button>
      </div>
    </header>
  );
}
