export const siteContent = {
  brand: {
    name: "SOUL SKIN",
    handle: "@yoursoulskin",
    url: "https://www.instagram.com/yoursoulskin",
    location: "Ulaanbaatar, Mongolia",
    copyright: "© 2026 SOUL SKIN. ALL RIGHTS RESERVED.",
    taglineShort: "UB.MN / EST. 2021",
  },
  hero: {
    tag: "SS 25",
    titleLine1: "CHOOSE YOUR",
    titleLine2: "SKIN",
  },
  marquees: {
    top: "SOUL SKIN — UB.MN — SS 25 — LIMITED —",
    bottom: "MADE IN ULAANBAATAR — WEAR YOUR SOUL — CUSTOM ORDER —",
  },
  drop: {
    label: "Current Drop",
    titleLine1: "VOID SERIES",
    titleLine2: "001",
    description:
      "Constructed from 380gsm heavy cotton. Raw hem edges. Designed in Ulaanbaatar for those who need no explanation.",
    piecesLeft: "PIECES LEFT: 03",
    cta: "Order via Instagram",
  },
  lookbook: {
    label: "Lookbook",
    season: "S / S 2025",
    description: "Shot in Ulaanbaatar. Each image is a document, not a pose.",
    titleLine1: "WEAR",
    titleLine2: "THE",
    titleLine3: "QUIET",
    items: [{ id: "SS25 — 001" }, { id: "SS25 — 002" }, { id: "SS25 — 003" }],
  },
  products: {
    label: "Selected Pieces",
    items: [
      {
        id: "SK-001",
        name: "VOID JACKET",
        material: "HEAVY COTTON / 380GSM",
        desc: "Hand-distressed raw hems. Boxy fit.",
        price: "AVAILABLE BY DM",
        image: "/product-jacket.png",
        offset: "md:mt-0",
      },
      {
        id: "SK-002",
        name: "ASH HOODIE",
        material: "FRENCH TERRY / 320GSM",
        desc: "Overdyed finish with custom drop shoulders.",
        price: "AVAILABLE BY DM",
        image: "/product-hoodie.png",
        offset: "md:mt-10",
      },
      {
        id: "SK-003",
        name: "BONE LAYER",
        material: "RIPSTOP NYLON / OVERSIZED",
        desc: "Wind-resistant light outerwear piece.",
        price: "AVAILABLE BY DM",
        image: "/lookbook-02.png",
        offset: "md:-mt-4",
      },
    ] as const,
    cta: "View on Instagram",
  },
  customOrder: {
    titleLine1: "WANT SOMETHING",
    titleLine2: "UNIQUE?",
    description:
      "Every piece can be customized. Reach out on Instagram and we will build it with you.",
    cta: "Start on Instagram",
  },
  about: {
    label: "About",
    description:
      "Soul Skin is a streetwear label from Ulaanbaatar, Mongolia. Built for those who carry their identity on their back.",
  },
};
