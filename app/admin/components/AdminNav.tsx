"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/drop",      label: "Drop" },
  { href: "/admin/products",  label: "Products" },
  { href: "/admin/lookbook",  label: "Lookbook" },
  { href: "/admin/site",      label: "Site" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  if (pathname === "/admin") return null;

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <nav className="border-b border-[#1e1e1e] bg-[#0c0c0c]">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-12">
        <span className="text-[12px] tracking-[0.2em] text-[#666] uppercase font-mono">
          SOUL SKIN / ADMIN
        </span>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href}
              className={`text-[12px] tracking-widest uppercase font-mono transition-colors ${
                pathname.startsWith(link.href) ? "text-[#f0f0f0]" : "text-[#777] hover:text-[#ccc]"
              }`}>
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="text-[12px] tracking-widest uppercase font-mono text-[#555] hover:text-[#f07070] transition-colors ml-2">
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="sm:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className={`block w-5 h-px bg-[#888] transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-px bg-[#888] transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-[#888] transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-[#1e1e1e] bg-[#0e0e0e] px-4 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className={`text-[14px] tracking-widest uppercase font-mono transition-colors ${
                pathname.startsWith(link.href) ? "text-[#f0f0f0]" : "text-[#888]"
              }`}>
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="text-[14px] tracking-widest uppercase font-mono text-[#666] hover:text-[#f07070] transition-colors text-left">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
