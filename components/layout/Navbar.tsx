"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteContent } from "@/data/siteContent";

const navLinks: ReadonlyArray<{ name: string; href: string; note: string }> = [
  { name: "Home", href: "/", note: "Film / Manifesto" },
  { name: "Drops", href: "/drops", note: "Current release" },
  { name: "Lookbook", href: "/lookbook", note: "Field notes" },
  { name: "Pieces", href: "/pieces", note: "Made to order" },
  { name: "Custom", href: "/custom", note: "Orders open" },
  { name: "About", href: "/about", note: "Ulaanbaatar / 2021" },
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
        className={`fixed top-0 left-0 right-0 z-[70] nav-shell flex items-center justify-center transition-[transform,opacity,background-color,border-color] duration-700 ease-out ${
          hidden && !menuOpen
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        } ${
          scrolled || menuOpen
            ? "border-b ss-rule bg-void/90"
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
          className="absolute left-[var(--container-x)] inline-flex min-h-11 items-center gap-3 text-xs uppercase tracking-label text-bone transition-opacity duration-300 hover:opacity-65 md:left-[var(--container-x-md)]"
        >
          <span className="relative flex h-3.5 w-5 items-center" aria-hidden="true">
            <span
              className={`absolute left-0 h-px bg-bone transition-[top,width,transform] duration-300 ${
                menuOpen ? "top-1/2 w-5 rotate-45" : "top-1 w-5"
              }`}
            />
            <span
              className={`absolute left-0 h-px bg-bone transition-[top,width,transform] duration-300 ${
                menuOpen ? "top-1/2 w-5 -rotate-45" : "top-3 w-3.5"
              }`}
            />
          </span>
          <span>{menuOpen ? "Close" : "Choose"}</span>
        </button>

        <Link
          href="/"
          onClick={handleBrandClick}
          className="inline-flex min-h-11 select-none items-center font-display text-xl uppercase leading-none tracking-wide text-bone transition-opacity duration-300 hover:opacity-75"
          aria-label={siteContent.brand.name}
        >
          {siteContent.brand.name}
        </Link>

        <Link
          href={siteContent.brand.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-[var(--container-x)] inline-flex min-h-11 items-center text-xs uppercase tracking-label text-bone transition-opacity duration-300 hover:opacity-65 md:right-[var(--container-x-md)]"
          aria-label={`Instagram ${siteContent.brand.handle} (opens in a new tab)`}
        >
          Instagram
        </Link>
      </header>

      <div
        ref={navRef}
        id="brand-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-[60] bg-void/95 transition-opacity duration-500 ${
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
          <Link
            href="/"
            onClick={handleBrandClick}
            className="relative z-10 mb-6 inline-flex min-h-11 w-fit items-center font-display text-2xl uppercase leading-none tracking-wide text-bone transition-opacity hover:opacity-75 md:mb-10"
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

          <ul className="relative z-10 flex flex-col border-y ss-rule">
            {navLinks.map((link, i) => {
              const active = isActive(pathname, link.href);

              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`group flex min-h-11 items-center gap-5 border-t ss-rule py-2 first:border-t-0 md:gap-8 md:py-3 ${
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
                    <span
                      className={`block w-1.5 shrink-0 self-stretch ${active ? "bg-ember" : "bg-transparent"}`}
                      aria-hidden="true"
                    />
                    <span className="flex min-w-0 flex-1 items-end justify-between gap-4">
                      <span className="font-display uppercase leading-none transition-transform duration-300 group-hover:translate-x-3" style={{ fontSize: "var(--text-2xl)" }}>
                        {link.name}
                      </span>
                      <span className={`hidden pb-1 text-xs uppercase tracking-label md:block ${active ? "text-ember" : "text-mist"}`}>
                        {link.note}
                      </span>
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
              className="inline-flex min-h-11 w-fit items-center text-xs uppercase tracking-label text-bone transition-opacity hover:opacity-70"
            >
              Instagram / {siteContent.brand.handle}
            </Link>
            <span className="text-xs uppercase tracking-widest text-mist">
              {siteContent.brand.location}
            </span>
          </div>
        </nav>
      </div>
    </>
  );
}
