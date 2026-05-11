import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ManifestoStrip from "@/components/sections/ManifestoStrip";
import Marquee from "@/components/sections/Marquee";
import Drop from "@/components/sections/Drop";
import LookbookTeaser from "@/components/sections/LookbookTeaser";
import Products from "@/components/sections/Products";
import CustomOrder from "@/components/sections/CustomOrder";
import AboutTeaser from "@/components/sections/AboutTeaser";
import { siteContent } from "@/data/siteContent";
import {
  getActiveDrops,
  getProductsWithImages,
  getLookbookItems,
  getSiteSettings,
  type Drop as DropData,
  type LookbookItem,
  type ProductWithImages,
} from "@/lib/db";

const fallbackDrops: DropData[] = [
  {
    id: "fallback-drop-01",
    label: "Soul Skin 01",
    title_line1: "RAW",
    title_line2: "HOOD",
    description:
      "Heavy streetwear layers built for cold nights, concrete light, and a silhouette that reads from across the street.",
    pieces_left: 7,
    cta: siteContent.drop.cta,
    image_url: "/hero2.png",
    active: true,
    order_index: 1,
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

const fallbackProducts: ProductWithImages[] = [
  {
    id: "fallback-product-hoodie",
    sku: "SS-HOOD-01",
    name: "Heavy Raw Hoodie",
    material: "Washed cotton fleece",
    description:
      "Oversized hood, raw hem, and a quiet front profile made for layering.",
    price: "DM FOR PRICE",
    image_url: "/product-hoodie.png",
    offset_class: "",
    order_index: 1,
    active: true,
    created_at: "2026-01-01T00:00:00.000Z",
    images: [
      {
        id: "fallback-product-hoodie-image",
        product_id: "fallback-product-hoodie",
        image_url: "/product-hoodie.png",
        order_index: 1,
        created_at: "2026-01-01T00:00:00.000Z",
      },
    ],
  },
  {
    id: "fallback-product-jacket",
    sku: "SS-JACKET-01",
    name: "Storm Shell Jacket",
    material: "Layered cotton canvas",
    description:
      "A structured outer layer with distressed edges and a darker street profile.",
    price: "DM FOR PRICE",
    image_url: "/product-jacket.png",
    offset_class: "md:translate-y-10",
    order_index: 2,
    active: true,
    created_at: "2026-01-01T00:00:00.000Z",
    images: [
      {
        id: "fallback-product-jacket-image",
        product_id: "fallback-product-jacket",
        image_url: "/product-jacket.png",
        order_index: 1,
        created_at: "2026-01-01T00:00:00.000Z",
      },
    ],
  },
];

const fallbackLookbook: LookbookItem[] = [
  {
    id: "fallback-lookbook-01",
    item_id: "UB-01",
    image_url: "/lookbook-01.png",
    order_index: 1,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-lookbook-02",
    item_id: "UB-02",
    image_url: "/lookbook-02.png",
    order_index: 2,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-lookbook-03",
    item_id: "UB-03",
    image_url: "/lookbook-03.png",
    order_index: 3,
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

// Supabase 未設定時も動くようにエラーを吸収
async function safeGetActiveDrops() {
  try { return await getActiveDrops(); }
  catch (error) { console.error("[page] safeGetActiveDrops", error); return []; }
}
async function safeGetProducts() {
  try { return await getProductsWithImages(); }
  catch (error) { console.error("[page] safeGetProducts", error); return []; }
}
async function safeGetLookbookItems() {
  try { return await getLookbookItems(); }
  catch (error) { console.error("[page] safeGetLookbookItems", error); return []; }
}
async function safeGetSiteSettings() {
  try { return await getSiteSettings(); }
  catch (error) { console.error("[page] safeGetSiteSettings", error); return null; }
}

export default async function Home() {
  const [drops, products, lookbook, siteSettings] = await Promise.all([
    safeGetActiveDrops(),
    safeGetProducts(),
    safeGetLookbookItems(),
    safeGetSiteSettings(),
  ]);

  const homeDrops = drops.length > 0 ? drops : fallbackDrops;
  const homeProducts = products.length > 0 ? products : fallbackProducts;
  const homeLookbook = lookbook.length > 0 ? lookbook : fallbackLookbook;

  // トップでは最大 6 点（モバイル 2列×3行 / PC 3列×2行）。残りは /pieces で見せる。
  const featuredProducts = homeProducts.slice(0, 6);

  return (
    <>
      <Navbar />

      <main>
        {/* 1. Hero */}
        <Hero imageUrl={siteSettings?.hero_image_url} />

        {/* 2. Brand manifesto */}
        <ManifestoStrip />

        {/* 3. Drop — current releases (carousel up to 5). Past drops are at /drops. */}
        <Drop drops={homeDrops} />

        {/* 3b. Drop link strip — replaces the inline archive on the landing page */}
        <section className="section-gap-before bg-void section-link-strip">
          <div className="container-base flex items-center justify-between gap-4">
            <span className="text-brand-label !text-iron">Releases</span>
            <Link
              href="/drops"
              className="cta-link cta-link-sm text-dust hover:text-bone transition-colors"
            >
              <span className="link-underline-grow">See all drops</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* 4. Lookbook teaser — full lookbook is at /lookbook */}
        <LookbookTeaser data={homeLookbook} limit={4} />

        {/* 5. Pieces preview — first 3 only. Rest at /pieces. */}
        <Products data={featuredProducts} />
        <section className="section-gap-before bg-void section-link-strip">
          <div className="container-base flex items-center justify-between gap-4">
            <span className="text-brand-label !text-iron">Pieces</span>
            <Link
              href="/pieces"
              className="cta-link cta-link-sm text-dust hover:text-bone transition-colors"
            >
              <span className="link-underline-grow">All pieces</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* 6. Marquee — single bottom strip (was previously a top + bottom pair) */}
        <Marquee text={siteContent.marquees.bottom} noiseSide="bottom" />

        {/* 7. Custom Order CTA — links to /custom */}
        <CustomOrder />

        {/* 8. About teaser — full story is at /about */}
        <AboutTeaser
          imageUrl={siteSettings?.about_image_url}
          description={siteSettings?.about_description}
        />
      </main>

      <Footer />
    </>
  );
}
