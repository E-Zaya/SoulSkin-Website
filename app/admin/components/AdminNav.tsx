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
    <nav className="border-b border-cinder bg-void">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-12">
        <span className="text-xs tracking-label text-mist uppercase">
          SOUL SKIN / ADMIN
        </span>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href}
              className={`text-xs tracking-widest uppercase transition-colors ${
                pathname.startsWith(link.href) ? "text-bone" : "text-mist hover:text-dust"
              }`}>
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="text-xs tracking-widest uppercase text-mist hover:text-error transition-colors ml-2">
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="sm:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className={`block w-5 h-px bg-mist transition-colors ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-px bg-mist transition-colors ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-mist transition-colors ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-cinder bg-void px-4 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className={`text-sm tracking-widest uppercase transition-colors ${
                pathname.startsWith(link.href) ? "text-bone" : "text-mist"
              }`}>
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="text-sm tracking-widest uppercase text-mist hover:text-error transition-colors text-left">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
