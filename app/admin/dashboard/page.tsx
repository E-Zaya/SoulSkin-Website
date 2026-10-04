import Link from "next/link";
import { getActiveDrops, getAllProducts, getLookbookItems, getSiteSettings, MAX_ACTIVE_DROPS } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [drops, products, lookbook, siteSettings] = await Promise.all([
    getActiveDrops(MAX_ACTIVE_DROPS),
    getAllProducts(),
    getLookbookItems(),
    getSiteSettings(),
  ]);

  const drop = drops[0] ?? null;

  const cards = [
    {
      href:  "/admin/drop",
      label: "Active Drops",
      value: drops.length > 0 ? `${drops.length} / ${MAX_ACTIVE_DROPS}` : "—",
      sub:   drop ? `${drop.title_line1} ${drop.title_line2} (+${Math.max(drops.length - 1, 0)})` : "Not set",
      live:  drops.length > 0,
    },
    {
      href:  "/admin/products",
      label: "Products",
      value: products.length.toString(),
      sub:   `${products.filter((p) => p.active).length} active`,
      live:  false,
    },
    {
      href:  "/admin/lookbook",
      label: "Lookbook",
      value: lookbook.length.toString(),
      sub:   "items",
      live:  false,
    },
    {
      href:  "/admin/site",
      label: "Site",
      value: "Settings",
      sub:   siteSettings ? "Hero / About" : "Not set",
      live:  false,
    },
  ];

  return (
    <div>
      <h1 className="text-sm tracking-label text-mist uppercase mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}
            className="block border border-cinder bg-void p-5 hover:border-iron hover:bg-ash transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs tracking-label text-mist uppercase">{card.label}</p>
              {card.live && (
                <span className="text-xs tracking-widest text-ok border border-ok/40 px-2 py-0.5">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-xl text-bone leading-none mb-2">{card.value}</p>
            <p className="text-xs text-mist">{card.sub}</p>
          </Link>
        ))}
      </div>

      <div className="border-t border-cinder pt-6">
        <p className="text-xs tracking-label text-mist uppercase mb-4">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/admin/drop",     label: "Edit Drop" },
            { href: "/admin/products", label: "Add Product" },
            { href: "/admin/lookbook", label: "Edit Lookbook" },
            { href: "/admin/site",     label: "Edit Site" },
            { href: "/",              label: "View Site", target: "_blank" },
          ].map((a) => (
            <Link key={a.href} href={a.href} target={a.target}
              className="text-xs tracking-widest uppercase border border-cinder px-4 py-2 text-mist hover:text-bone hover:border-iron transition-colors">
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
