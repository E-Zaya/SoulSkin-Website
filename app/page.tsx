import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Drop from "@/components/sections/Drop";
import DropArchive from "@/components/sections/DropArchive";
import Lookbook from "@/components/sections/Lookbook";
import Products from "@/components/sections/Products";
import CustomOrder from "@/components/sections/CustomOrder";
import About from "@/components/sections/About";
import { siteContent } from "@/data/siteContent";
import { getActiveDrop, getPastDrops, getProductsWithImages, getLookbookItems, getSiteSettings } from "@/lib/db";

// Supabase 未設定時も動くようにエラーを吸収
async function safeGetActiveDrop() {
  try { return await getActiveDrop(); }
  catch (error) { console.error("[page] safeGetActiveDrop", error); return null; }
}
async function safeGetPastDrops() {
  try { return await getPastDrops(); }
  catch (error) { console.error("[page] safeGetPastDrops", error); return []; }
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
  const [drop, pastDrops, products, lookbook, siteSettings] = await Promise.all([
    safeGetActiveDrop(),
    safeGetPastDrops(),
    safeGetProducts(),
    safeGetLookbookItems(),
    safeGetSiteSettings(),
  ]);

  return (
    <>
      <Navbar />

      <main>
        {/* 1. Hero — 100dvh full-bleed */}
        <Hero imageUrl={siteSettings?.hero_image_url} />

        {/* 2. Marquee 1 — noise on top border */}
        <Marquee text={siteContent.marquees.top} noiseSide="top" />

        {/* 3. Drop — current collection, scarcity */}
        <Drop data={drop} />

        {/* 3b. Drop Archive — past releases */}
        <DropArchive drops={pastDrops} />

        {/* 4. Lookbook — image-first editorial grid */}
        <Lookbook data={lookbook} />

        {/* 5. Products — 3 cards, no cart */}
        <Products data={products} />

        {/* 6. Marquee 2 — noise on bottom border */}
        <Marquee text={siteContent.marquees.bottom} noiseSide="bottom" />

        {/* 7. Custom Order — EMBER CTA */}
        <CustomOrder />

        {/* 8. About — 2 sentences */}
        <About
          imageUrl={siteSettings?.about_image_url}
          description={siteSettings?.about_description}
        />
      </main>

      <Footer />
    </>
  );
}
