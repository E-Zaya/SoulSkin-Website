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
  getActiveDrop,
  getProductsWithImages,
  getLookbookItems,
  getSiteSettings,
} from "@/lib/db";

// Supabase 未設定時も動くようにエラーを吸収
async function safeGetActiveDrop() {
  try { return await getActiveDrop(); }
  catch (error) { console.error("[page] safeGetActiveDrop", error); return null; }
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
  const [drop, products, lookbook, siteSettings] = await Promise.all([
    safeGetActiveDrop(),
    safeGetProducts(),
    safeGetLookbookItems(),
    safeGetSiteSettings(),
  ]);

  // トップでは最大 3 点だけ。残りは /pieces で見せる。
  const featuredProducts = products.slice(0, 3);

  return (
    <>
      <Navbar />

      <main>
        {/* 1. Hero */}
        <Hero imageUrl={siteSettings?.hero_image_url} />

        {/* 2. Brand manifesto */}
        <ManifestoStrip />

        {/* 3. Drop — current release. Past drops are at /drops. */}
        <Drop data={drop} />

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
        <LookbookTeaser data={lookbook} limit={4} />

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
