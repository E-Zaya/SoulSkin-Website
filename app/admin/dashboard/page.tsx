import Link from "next/link";
import { getActiveDrop, getAllProducts, getLookbookItems } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [drop, products, lookbook] = await Promise.all([
    getActiveDrop(),
    getAllProducts(),
    getLookbookItems(),
  ]);

  const cards = [
    {
      href:  "/admin/drop",
      label: "Current Drop",
      value: drop ? `${drop.title_line1} ${drop.title_line2}` : "—",
      sub:   drop ? `残り ${drop.pieces_left} 枚` : "未設定",
      live:  !!drop,
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
  ];

  return (
    <div>
      <h1 className="text-[13px] tracking-[0.25em] text-[#aaa] uppercase font-mono mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}
            className="block border border-[#222] bg-[#0f0f0f] p-5 hover:border-[#3a3a3a] hover:bg-[#111] transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] tracking-[0.2em] text-[#888] uppercase font-mono">{card.label}</p>
              {card.live && (
                <span className="text-[9px] tracking-widest text-[#5dd49a] border border-[#1a3d2a] px-2 py-0.5 font-mono">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-[28px] font-mono text-[#f0f0f0] leading-none mb-2">{card.value}</p>
            <p className="text-[12px] text-[#777] font-mono">{card.sub}</p>
          </Link>
        ))}
      </div>

      <div className="border-t border-[#1a1a1a] pt-6">
        <p className="text-[11px] tracking-[0.2em] text-[#555] uppercase font-mono mb-4">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/admin/drop",     label: "Edit Drop" },
            { href: "/admin/products", label: "Add Product" },
            { href: "/admin/lookbook", label: "Edit Lookbook" },
            { href: "/",              label: "View Site ↗", target: "_blank" },
          ].map((a) => (
            <Link key={a.href} href={a.href} target={a.target}
              className="text-[12px] tracking-widest uppercase font-mono border border-[#2a2a2a] px-4 py-2 text-[#888] hover:text-[#f0f0f0] hover:border-[#444] transition-colors">
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
