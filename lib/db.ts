import { createServerClient } from "./supabase";

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
  created_at: string;
};

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

export async function getActiveDrop(): Promise<Drop | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) console.error("[db] getActiveDrop:", error.message);
  return data;
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
    .order("created_at", { ascending: false });
  return data ?? [];
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

export async function setActiveDrop(
  id: string
): Promise<{ data: Drop | null; error: { message: string } | null }> {
  const supabase = createServerClient();

  // uuid 列に空文字を比較しない。現在 active なものだけ落としてから指定IDを有効化する。
  const deactivate = await supabase
    .from("drops")
    .update({ active: false })
    .eq("active", true);

  if (deactivate.error) {
    return { data: null, error: { message: deactivate.error.message } };
  }

  const { data, error } = await supabase
    .from("drops")
    .update({ active: true })
    .eq("id", id)
    .select()
    .single();

  return { data, error: error ? { message: error.message } : null };
}
