import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Lookbook from "@/components/sections/Lookbook";
import { getPublicLookbook } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Lookbook — Soul Skin",
  description:
    "Shot in Ulaanbaatar. Each image is a document, not a pose. The Soul Skin lookbook.",
  openGraph: {
    title: "Lookbook — Soul Skin",
    description:
      "Shot in Ulaanbaatar. Each image is a document, not a pose. The Soul Skin lookbook.",
    type: "article",
  },
};

export default async function LookbookPage() {
  const items = await getPublicLookbook();

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "var(--nav-h)" }}>
        <Lookbook data={items} />
      </main>
      <Footer />
    </>
  );
}
