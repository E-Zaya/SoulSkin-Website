import { siteContent } from "./siteContent";
import type {
  DropWithImages,
  LookbookItem,
  ProductWithImages,
  SiteSettings,
} from "@/lib/db";

const LOCAL_DATE = "2026-01-01T00:00:00.000Z";

/**
 * Public-site content that ships with the app.
 *
 * Keep image paths inside /public so the storefront remains fully usable when
 * Supabase or its storage bucket is paused.
 */
export const localSiteSettings: SiteSettings = {
  id: 1,
  hero_image_url: "/hero-film/soulskin-steppe-01.jpg",
  about_image_url: "/about.png",
  about_description: siteContent.about.descriptionFallback,
  updated_at: LOCAL_DATE,
};

export const localDrops: DropWithImages[] = [
  {
    id: "local-drop-soul-skin-01",
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
    created_at: "2026-05-01T00:00:00.000Z",
    images: [
      {
        id: "local-drop-soul-skin-01-look-01",
        drop_id: "local-drop-soul-skin-01",
        image_url: "/lookbook-01.png",
        order_index: 1,
        created_at: LOCAL_DATE,
      },
      {
        id: "local-drop-soul-skin-01-look-02",
        drop_id: "local-drop-soul-skin-01",
        image_url: "/lookbook-02.png",
        order_index: 2,
        created_at: LOCAL_DATE,
      },
      {
        id: "local-drop-soul-skin-01-look-03",
        drop_id: "local-drop-soul-skin-01",
        image_url: "/lookbook-03.png",
        order_index: 3,
        created_at: LOCAL_DATE,
      },
    ],
  },
  {
    id: "local-drop-ub-night-00",
    label: "UB Night 00",
    title_line1: "NIGHT",
    title_line2: "FILES",
    description:
      "A first field note from Ulaanbaatar after dark: hard concrete, blue light, and layers made for the cold.",
    pieces_left: 0,
    cta: siteContent.drop.cta,
    image_url: "/lookbook-03.png",
    active: false,
    order_index: 2,
    created_at: "2025-11-01T00:00:00.000Z",
    images: [
      {
        id: "local-drop-ub-night-00-look-01",
        drop_id: "local-drop-ub-night-00",
        image_url: "/lookbook-02.png",
        order_index: 1,
        created_at: LOCAL_DATE,
      },
      {
        id: "local-drop-ub-night-00-look-02",
        drop_id: "local-drop-ub-night-00",
        image_url: "/lookbook-01.png",
        order_index: 2,
        created_at: LOCAL_DATE,
      },
    ],
  },
];

export const localProducts: ProductWithImages[] = [
  {
    id: "local-product-hoodie",
    sku: "SS-HOOD-01",
    name: "Heavy Raw Hoodie",
    material: "Washed cotton fleece",
    description:
      "Oversized hood, raw hem, and a quiet front profile made for layering through Ulaanbaatar nights.",
    price: "DM FOR PRICE",
    image_url: "/product-hoodie.png",
    offset_class: "",
    order_index: 1,
    active: true,
    created_at: LOCAL_DATE,
    images: [
      {
        id: "local-product-hoodie-image-01",
        product_id: "local-product-hoodie",
        image_url: "/product-hoodie.png",
        order_index: 1,
        created_at: LOCAL_DATE,
      },
      {
        id: "local-product-hoodie-image-02",
        product_id: "local-product-hoodie",
        image_url: "/hero2.png",
        order_index: 2,
        created_at: LOCAL_DATE,
      },
    ],
  },
  {
    id: "local-product-jacket",
    sku: "SS-JACKET-01",
    name: "Storm Shell Jacket",
    material: "Layered cotton canvas",
    description:
      "A structured outer layer with distressed edges, contrast stitching, and a darker street profile.",
    price: "DM FOR PRICE",
    image_url: "/product-jacket.png",
    offset_class: "md:translate-y-10",
    order_index: 2,
    active: true,
    created_at: LOCAL_DATE,
    images: [
      {
        id: "local-product-jacket-image-01",
        product_id: "local-product-jacket",
        image_url: "/product-jacket.png",
        order_index: 1,
        created_at: LOCAL_DATE,
      },
    ],
  },
];

export const localLookbook: LookbookItem[] = [
  {
    id: "local-lookbook-01",
    item_id: "UB-01 / BLUE HOUR",
    image_url: "/lookbook-01.png",
    order_index: 1,
    created_at: LOCAL_DATE,
  },
  {
    id: "local-lookbook-02",
    item_id: "UB-02 / CONCRETE",
    image_url: "/lookbook-02.png",
    order_index: 2,
    created_at: LOCAL_DATE,
  },
  {
    id: "local-lookbook-03",
    item_id: "UB-03 / AFTER DARK",
    image_url: "/lookbook-03.png",
    order_index: 3,
    created_at: LOCAL_DATE,
  },
];
