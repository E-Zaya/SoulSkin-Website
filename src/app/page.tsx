import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Drop from "@/components/sections/Drop";
import Lookbook from "@/components/sections/Lookbook";
import Products from "@/components/sections/Products";
import CustomOrder from "@/components/sections/CustomOrder";
import About from "@/components/sections/About";
import { siteContent } from "@/data/siteContent";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* 1. Hero — 100dvh full-bleed */}
        <Hero />

        {/* 2. Marquee 1 — noise on top border */}
        <Marquee
          text={siteContent.marquees.top}
          noiseSide="top"
        />

        {/* 3. Drop — current collection, scarcity */}
        <Drop />

        {/* 4. Lookbook — image-first editorial grid */}
        <Lookbook />

        {/* 5. Products — 3 cards, no cart */}
        <Products />

        {/* 6. Marquee 2 — noise on bottom border */}
        <Marquee
          text={siteContent.marquees.bottom}
          noiseSide="bottom"
        />

        {/* 7. Custom Order — EMBER CTA */}
        <CustomOrder />

        {/* 8. About — 2 sentences */}
        <About />
      </main>

      <Footer />
    </>
  );
}
