import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Lookbook from "@/components/sections/Lookbook";
import { getLookbookItems } from "@/lib/db";

export const metadata: Metadata = {
  title: "Lookbook — Soul Skin",
  description:
    "Shot in Ulaanbaatar. Each image is a document, not a pose. The Soul Skin SS25 lookbook.",
  openGraph: {
    title: "Lookbook — Soul Skin",
    description:
      "Shot in Ulaanbaatar. Each image is a document, not a pose. The Soul Skin SS25 lookbook.",
    type: "article",
  },
};

async function safeGetLookbookItems() {
  try {
    return await getLookbookItems();
  } catch (error) {
    console.error("[lookbook] safeGetLookbookItems", error);
    return [];
  }
}

export default async function LookbookPage() {
  const items = await safeGetLookbookItems();

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
