export const siteContent = {
  brand: {
    name: "SOUL SKIN",
    handle: "@yoursoulskin",
    url: "https://www.instagram.com/yoursoulskin",
    // Custom order などで mailto: 用に使う。null にすると UI からメールCTAが消える。
    email: null as string | null,
    location: "Ulaanbaatar, Mongolia",
    copyright: "© 2026 SOUL SKIN. ALL RIGHTS RESERVED.",
    taglineShort: "UB — EST. 2021",
  },
  hero: {
    tag: "Streetwear from Ulaanbaatar",
    titleLine1: "CHOOSE YOUR",
    titleLine2: "SKIN",
    ctaPrimary: "Shop drops",
    ctaSecondary: "View lookbook",
  },
  drop: {
    label: "NEW DROP",
    cta: "Order via Instagram",
  },
  manifesto: {
    kicker: "Manifesto",
    line1: "Not made to fit in.",
    line2:
      "Built in Ulaanbaatar for people who want their clothes to carry weight, texture, and identity.",
    notes: [
      {
        number: "01",
        title: "Limited drops",
        copy: "Small runs keep each release focused and easy to recognize.",
      },
      {
        number: "02",
        title: "Custom work",
        copy: "Made-to-order details for people who want one piece, not a uniform.",
      },
      {
        number: "03",
        title: "UB texture",
        copy: "Concrete, night light, weather, and movement shape the visual language.",
      },
    ],
  },
  marquees: {
    top: "SOUL SKIN — UB.MN — LIMITED —",
    bottom: "MADE IN ULAANBAATAR — WEAR YOUR SOUL — CUSTOM ORDER —",
  },
  lookbook: {
    label: "Lookbook",
    season: "Field notes",
    description: "Shot in Ulaanbaatar. Each image is a document, not a pose.",
    titleLine1: "UB",
    titleLine2: "NIGHT",
    titleLine3: "FILES",
  },
  products: {
    label: "Selected Pieces",
    cta: "Order via Instagram",
  },
  customOrder: {
    titleLine1: "WANT SOMETHING",
    titleLine2: "UNIQUE?",
    description:
      "Every piece can be customized. Reach out on Instagram and we'll build it together.",
    cta: "Start on Instagram",
    dropVariant: {
      titleLine1: "MAKE IT",
      titleLine2: "YOURS.",
      description:
        "Like this drop? Add your own colors, logo, or details. Reach out on Instagram and we'll customize it for you.",
      cta: "Start on Instagram",
    },
  },
  about: {
    label: "The Label",
    cta: "Read more",
    descriptionFallback:
      "Soul Skin is a Ulaanbaatar streetwear label focused on limited silhouettes, rough texture, and custom details that make each piece feel owned from day one.",
  },
};
