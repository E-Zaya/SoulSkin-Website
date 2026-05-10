import { createServerClient } from "./supabase";
import { toSlug } from "./slug";

// ============================================================
// 型定義
// ============================================================

export type SiteSettings = {
  id: number;
  hero_image_url: string | null;
  about_image_url: string | null;
  about_description: string;
  updated_at: string;
};

export type Drop = {
  id: string;
  label: string;
  title_line1: string;
  title_line2: string;
  description: string;
  pieces_left: number;
  cta: string;
  image_url: string | null;
  active: boolean;
  order_index: number;
  created_at: string;
};

export type DropImage = {
  id: string;
  drop_id: string;
  image_url: string;
  order_index: number;
  created_at: string;
};

// Drop に images を付与した拡張型 (フロントエンド用)
export type DropWithImages = Drop & {
  images: DropImage[];
};

/** ホームのカルーセルに出す Active Drop の最大件数 */
export const MAX_ACTIVE_DROPS = 5;

export type Product = {
  id: string;
  sku: string;
  name: string;
  material: string;
  description: string;
  price: string;
  image_url: string | null;
  offset_class: string;
  order_index: number;
  active: boolean;
  created_at: string;
};

export type LookbookItem = {
  id: string;
  item_id: string;
  image_url: string | null;
  order_index: number;
  created_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  order_index: number;
  created_at: string;
};

// Product に images を付与した拡張型（フロントエンド用）
export type ProductWithImages = Product & {
  images: ProductImage[];
};

// ============================================================
// 読み取りクエリ（フロントエンド用）
// ============================================================

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) console.error("[db] getSiteSettings:", error.message);
  return data;
}

export async function upsertSiteSettings(
  settings: Partial<Omit<SiteSettings, "id" | "updated_at">>
) {
  const supabase = createServerClient();
  return supabase
    .from("site_settings")
    .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() })
    .select()
    .single();
}

/**
 * 後方互換用: 最新の Active Drop 1件を返す。新規コードは getActiveDrops を使うこと。
 */
export async function getActiveDrop(): Promise<Drop | null> {
  const drops = await getActiveDrops(1);
  return drops[0] ?? null;
}

/**
 * Active な Drops を order_index 昇順で複数件取得 (デフォルト最大 MAX_ACTIVE_DROPS = 5)。
 * ホーム / /drops のカルーセルで使用。
 */
export async function getActiveDrops(
  limit: number = MAX_ACTIVE_DROPS
): Promise<Drop[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .eq("active", true)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) console.error("[db] getActiveDrops:", error.message);
  return data ?? [];
}

/**
 * Active な Drops を images 付きで取得 (詳細ページのカルーセルが画像も使う場合用)。
 */
export async function getActiveDropsWithImages(
  limit: number = MAX_ACTIVE_DROPS
): Promise<DropWithImages[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("drops")
    .select("*, drop_images(id, drop_id, image_url, order_index, created_at)")
    .eq("active", true)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) console.error("[db] getActiveDropsWithImages:", error.message);
  if (!data) return [];
  return data.map((d) => ({
    ...d,
    images: ((d.drop_images as DropImage[]) ?? []).sort(
      (a, b) => a.order_index - b.order_index
    ),
  }));
}

export async function getPastDrops(): Promise<Drop[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .eq("active", false)
    .order("created_at", { ascending: false });
  if (error) console.error("[db] getPastDrops:", error.message);
  return data ?? [];
}

/**
 * 公開用に active / past 全件をまとめて取得（active を先頭に）。
 * /drops 一覧ページで使用。
 */
export async function getAllPublicDrops(): Promise<Drop[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .order("active", { ascending: false })
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) console.error("[db] getAllPublicDrops:", error.message);
  return data ?? [];
}

/**
 * Drop.label をスラグ化したものから個別 Drop を取得。
 * 一致する複数件があれば created_at の新しい方を返す（実装上は client 側でフィルタ）。
 */
export async function getDropBySlug(slug: string): Promise<Drop | null> {
  const drops = await getAllPublicDrops();
  return drops.find((d) => toSlug(d.label) === slug) ?? null;
}

/**
 * Drop.label をスラグ化したものから個別 Drop を images 付きで取得。
 */
export async function getDropBySlugWithImages(
  slug: string
): Promise<DropWithImages | null> {
  const drop = await getDropBySlug(slug);
  if (!drop) return null;
  const images = await getDropImagesById(drop.id);
  return { ...drop, images };
}

export async function getDropImagesById(dropId: string): Promise<DropImage[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("drop_images")
    .select("*")
    .eq("drop_id", dropId)
    .order("order_index", { ascending: true });
  if (error) console.error("[db] getDropImagesById:", error.message);
  return data ?? [];
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("order_index", { ascending: true });
  if (error) console.error("[db] getProducts:", error.message);
  return data ?? [];
}

export async function getProductsWithImages(): Promise<ProductWithImages[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(id, product_id, image_url, order_index, created_at)")
    .eq("active", true)
    .order("order_index", { ascending: true });
  if (error) console.error("[db] getProductsWithImages:", error.message);
  if (!data) return [];
  return data.map((p) => ({
    ...p,
    images: (p.product_images as ProductImage[] ?? []).sort(
      (a, b) => a.order_index - b.order_index
    ),
  }));
}

/**
 * Product.sku をスラグ化したものから個別 Product を画像付きで取得。
 */
export async function getProductBySlugWithImages(
  slug: string
): Promise<ProductWithImages | null> {
  const products = await getProductsWithImages();
  return products.find((p) => toSlug(p.sku) === slug) ?? null;
}

export async function getProductImagesById(productId: string): Promise<ProductImage[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("order_index", { ascending: true });
  if (error) console.error("[db] getProductImagesById:", error.message);
  return data ?? [];
}

export async function getLookbookItems(): Promise<LookbookItem[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("lookbook_items")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) console.error("[db] getLookbookItems:", error.message);
  return data ?? [];
}

// ============================================================
// Admin 用クエリ（全件 + 非アクティブ含む）
// ============================================================

export async function getAllDrops(): Promise<Drop[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("drops")
    .select("*")
    .order("active", { ascending: false })
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllDropsWithImages(): Promise<DropWithImages[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("drops")
    .select("*, drop_images(id, drop_id, image_url, order_index, created_at)")
    .order("active", { ascending: false })
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });
  if (!data) return [];
  return data.map((d) => ({
    ...d,
    images: ((d.drop_images as DropImage[]) ?? []).sort(
      (a, b) => a.order_index - b.order_index
    ),
  }));
}

export async function countActiveDrops(): Promise<number> {
  const supabase = createServerClient();
  const { count, error } = await supabase
    .from("drops")
    .select("id", { count: "exact", head: true })
    .eq("active", true);
  if (error) console.error("[db] countActiveDrops:", error.message);
  return count ?? 0;
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("order_index", { ascending: true });
  return data ?? [];
}

export async function getAllProductsWithImages(): Promise<ProductWithImages[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_images(id, product_id, image_url, order_index, created_at)")
    .order("order_index", { ascending: true });
  if (!data) return [];
  return data.map((p) => ({
    ...p,
    images: (p.product_images as ProductImage[] ?? []).sort(
      (a, b) => a.order_index - b.order_index
    ),
  }));
}

export async function getDropById(id: string): Promise<Drop | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("drops")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

// ============================================================
// Admin 書き込みクエリ
// ============================================================

export async function upsertDrop(drop: Partial<Drop> & { id?: string }) {
  const supabase = createServerClient();
  return supabase.from("drops").upsert(drop).select().single();
}

export async function upsertProduct(product: Partial<Product> & { id?: string }) {
  const supabase = createServerClient();
  return supabase
    .from("products")
    .upsert(product, { onConflict: "id" })
    .select()
    .single();
}

export async function deleteProduct(id: string) {
  const supabase = createServerClient();
  return supabase.from("products").delete().eq("id", id);
}

export async function deleteDrop(id: string) {
  const supabase = createServerClient();
  return supabase.from("drops").delete().eq("id", id);
}

export async function upsertProductImage(
  item: Partial<ProductImage> & { product_id: string; image_url: string }
) {
  const supabase = createServerClient();
  return supabase.from("product_images").upsert(item).select().single();
}

export async function deleteProductImage(id: string) {
  const supabase = createServerClient();
  return supabase.from("product_images").delete().eq("id", id);
}

export async function upsertLookbookItem(item: Partial<LookbookItem> & { id?: string }) {
  const supabase = createServerClient();
  return supabase.from("lookbook_items").upsert(item).select().single();
}

export async function deleteLookbookItem(id: string) {
  const supabase = createServerClient();
  return supabase.from("lookbook_items").delete().eq("id", id);
}

/**
 * 指定 Drop の active フラグだけをトグルする (他は触らない)。
 * 複数 Active 許可後の標準動作。
 *
 * 上限チェック (MAX_ACTIVE_DROPS) は呼び出し元 (actions.ts) で行うこと。
 */
export async function setDropActive(
  id: string,
  active: boolean
): Promise<{ data: Drop | null; error: { message: string } | null }> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("drops")
    .update({ active })
    .eq("id", id)
    .select()
    .single();
  return { data, error: error ? { message: error.message } : null };
}

/** 後方互換用: setDropActive(id, true) のラッパー */
export async function setActiveDrop(id: string) {
  return setDropActive(id, true);
}

export async function upsertDropImage(
  item: Partial<DropImage> & { drop_id: string; image_url: string }
) {
  const supabase = createServerClient();
  return supabase.from("drop_images").upsert(item).select().single();
}

export async function deleteDropImage(id: string) {
  const supabase = createServerClient();
  return supabase.from("drop_images").delete().eq("id", id);
}
