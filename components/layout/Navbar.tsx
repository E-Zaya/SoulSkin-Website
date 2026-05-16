"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const navRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname() || "/";
  const activeLink = navLinks.find((link) => isActive(pathname, link.href)) ?? navLinks[0];

  const handleBrandClick = () => {
    setMenuOpen(false);
    setHidden(false);

    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.setTimeout(() => {
        window.dispatchEvent(new Event("soulskin:brand-home"));
      }, 180);
    }
  };

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

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    // メニューを閉じたらトリガーボタンにフォーカスを戻す
    requestAnimationFrame(() => {
      menuButtonRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }
      // フォーカストラップ: Tab / Shift+Tab でメニュー内に閉じ込める
      if (e.key === "Tab" && navRef.current) {
        const focusable = Array.from(
          navRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        ).filter((el) => !el.closest("[aria-hidden='true']"));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    const prev = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, closeMenu]);

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
          ref={menuButtonRef}
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
          onClick={handleBrandClick}
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
        ref={navRef}
        id="brand-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-[60] bg-void/95 backdrop-blur-xl transition-opacity duration-500 ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      >
        <nav
          className="relative h-full w-full overflow-y-auto px-[var(--container-x)] pb-6 pt-[calc(var(--nav-h)+1.5rem)] md:px-[var(--container-x-md)] md:pb-10 md:pt-[calc(var(--nav-h-md)+2.5rem)]"
          aria-label="Primary navigation"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="pointer-events-none absolute right-[-0.08em] top-[calc(var(--nav-h)+1rem)] z-0 text-right font-display uppercase leading-[0.78] tracking-[-0.03em] text-bone/[0.035] md:top-[calc(var(--nav-h-md)+1rem)]"
            style={{
              fontSize: "clamp(5rem, 18svh, 16rem)",
              transform: menuOpen ? "translateX(0)" : "translateX(24px)",
              opacity: menuOpen ? 1 : 0,
              transition:
                "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 700ms ease",
              transitionDelay: menuOpen ? "120ms" : "0ms",
            }}
            aria-hidden="true"
          >
            {activeLink.index}
            <br />
            {activeLink.name}
          </div>

          <Link
            href="/"
            onClick={handleBrandClick}
            className="relative z-10 mb-6 block w-fit font-display text-[3.5rem] uppercase leading-none tracking-[0.08em] text-bone transition-opacity hover:opacity-75 md:mb-10 md:text-[5.5rem]"
            style={{
              transform: menuOpen ? "translateY(0)" : "translateY(14px)",
              opacity: menuOpen ? 1 : 0,
              transition:
                "transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease",
              transitionDelay: menuOpen ? "80ms" : "0ms",
            }}
            aria-label={siteContent.brand.name}
          >
            {siteContent.brand.name}
          </Link>

          <ul className="relative z-10 flex flex-col border-y border-bone/12">
            {navLinks.map((link, i) => {
              const active = isActive(pathname, link.href);

              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-5 border-t border-bone/12 py-2 first:border-t-0 md:gap-8 md:py-3 ${
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
                    <span className="font-display uppercase leading-none tracking-[0.02em] transition-transform duration-300 group-hover:translate-x-3" style={{ fontSize: "clamp(2.25rem, 7svh, 5.75rem)" }}>
                      {link.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="relative z-10 mt-8 flex flex-col gap-3 md:mt-10">
            <Link
              href={siteContent.brand.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
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
