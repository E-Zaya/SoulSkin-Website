import { createServerClient } from "./supabase";

// ============================================================
// 型定義
// ============================================================

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

// ============================================================
// 読み取りクエリ（フロントエンド用）
// ============================================================

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
  return supabase.from("products").upsert(product).select().single();
}

export async function deleteProduct(id: string) {
  const supabase = createServerClient();
  return supabase.from("products").delete().eq("id", id);
}

export async function upsertLookbookItem(item: Partial<LookbookItem> & { id?: string }) {
  const supabase = createServerClient();
  return supabase.from("lookbook_items").upsert(item).select().single();
}

export async function deleteLookbookItem(id: string) {
  const supabase = createServerClient();
  return supabase.from("lookbook_items").delete().eq("id", id);
}

export async function setActiveDrop(id: string) {
  const supabase = createServerClient();
  // まず全件を非アクティブに
  await supabase.from("drops").update({ active: false }).neq("id", "");
  // 指定 ID だけアクティブに
  return supabase.from("drops").update({ active: true }).eq("id", id);
}
