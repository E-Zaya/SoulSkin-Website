import {
  getActiveDrops,
  getAllPublicDrops,
  getDropBySlugWithImages,
  getLookbookItems,
  getProductBySlugWithImages,
  getProductsWithImages,
  getSiteSettings,
  type Drop,
  type DropWithImages,
  type LookbookItem,
  type ProductWithImages,
  type SiteSettings,
} from "./db";
import {
  localDrops,
  localLookbook,
  localProducts,
  localSiteSettings,
} from "@/data/localContent";
import { toSlug } from "./slug";

/**
 * Local content is the safe default while the project database is paused.
 * Set SITE_CONTENT_SOURCE=database to prefer Supabase; every public read still
 * falls back to the bundled content when the database is unavailable or empty.
 */
const prefersDatabase = process.env.SITE_CONTENT_SOURCE === "database";

async function fromDatabaseOr<T>(
  load: () => Promise<T>,
  isUsable: (value: T) => boolean,
  fallback: T
): Promise<T> {
  if (!prefersDatabase) return fallback;

  try {
    const value = await load();
    return isUsable(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export async function getPublicSiteSettings(): Promise<SiteSettings> {
  const settings = await fromDatabaseOr(
    getSiteSettings,
    (settings): settings is SiteSettings => settings !== null,
    localSiteSettings
  );
  return settings ?? localSiteSettings;
}

export async function getPublicActiveDrops(): Promise<Drop[]> {
  const fallback: Drop[] = localDrops.filter((drop) => drop.active);
  return fromDatabaseOr(getActiveDrops, (drops) => drops.length > 0, fallback);
}

export async function getPublicDrops(): Promise<Drop[]> {
  const fallback: Drop[] = localDrops;
  return fromDatabaseOr(
    getAllPublicDrops,
    (drops) => drops.length > 0,
    fallback
  );
}

export async function getPublicDropBySlug(
  slug: string
): Promise<DropWithImages | null> {
  const fallback =
    localDrops.find((drop) => toSlug(drop.label) === slug) ?? null;
  return fromDatabaseOr(
    () => getDropBySlugWithImages(slug),
    (drop) => drop !== null,
    fallback
  );
}

export async function getPublicProducts(): Promise<ProductWithImages[]> {
  return fromDatabaseOr(
    getProductsWithImages,
    (products) => products.length > 0,
    localProducts
  );
}

export async function getPublicProductBySlug(
  slug: string
): Promise<ProductWithImages | null> {
  const fallback =
    localProducts.find((product) => toSlug(product.sku) === slug) ?? null;
  return fromDatabaseOr(
    () => getProductBySlugWithImages(slug),
    (product) => product !== null,
    fallback
  );
}

export async function getPublicLookbook(): Promise<LookbookItem[]> {
  return fromDatabaseOr(
    getLookbookItems,
    (items) => items.length > 0,
    localLookbook
  );
}
