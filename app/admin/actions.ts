"use server";

import { revalidatePath } from "next/cache";
import * as db from "@/lib/db";
import { createServerClient } from "@/lib/supabase";

const BUCKET = "soul-skin-images";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/drops");
  revalidatePath("/drops/[slug]", "page");
  revalidatePath("/admin/drop");
  revalidatePath("/admin/products");
  revalidatePath("/admin/lookbook");
  revalidatePath("/admin/site");
}

function assertNoError(error: { message: string } | null, fallback: string) {
  if (error) throw new Error(error.message || fallback);
}

// ── Drop ─────────────────────────────────────────────────────

/**
 * 「Active な Drops が MAX_ACTIVE_DROPS を超えていないか」をチェック。
 * 既に Active かどうかで判定が変わるので、対象 ID を除外してカウントする。
 */
async function ensureActiveLimit(targetId?: string) {
  const supabase = createServerClient();
  let query = supabase
    .from("drops")
    .select("id", { count: "exact", head: true })
    .eq("active", true);
  if (targetId) query = query.neq("id", targetId);
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  if ((count ?? 0) >= db.MAX_ACTIVE_DROPS) {
    throw new Error(
      `Maximum of ${db.MAX_ACTIVE_DROPS} active drops reached. Deactivate one first.`
    );
  }
}

export async function saveDropAction(data: {
  id?: string;
  label: string;
  title_line1: string;
  title_line2: string;
  description: string;
  pieces_left: number;
  cta: string;
  image_url: string | null;
  active: boolean;
  order_index?: number;
}) {
  // Active 化する場合は上限チェック
  if (data.active) {
    await ensureActiveLimit(data.id);
  }

  const { data: result, error } = await db.upsertDrop(data);
  assertNoError(error, "Failed to save drop");
  if (!result) throw new Error("Could not retrieve the saved drop");

  revalidate();
  return result;
}

export async function createDropAction() {
  // 並び順は最後尾に追加
  const all = await db.getAllDrops();
  const nextOrder = all.length > 0
    ? Math.max(...all.map((d) => d.order_index ?? 0)) + 1
    : 0;

  const { data: result, error } = await db.upsertDrop({
    label: "New Drop",
    title_line1: "",
    title_line2: "",
    description: "",
    pieces_left: 0,
    cta: "",
    active: false,
    order_index: nextOrder,
  });
  assertNoError(error, "Failed to create drop");
  return result;
}

/**
 * Drop の Active フラグをトグル。他の Drop は触らない。
 * Active 化時は上限チェックあり。
 */
export async function setDropActiveAction(id: string, active: boolean) {
  if (active) await ensureActiveLimit(id);
  const { error } = await db.setDropActive(id, active);
  assertNoError(error, "Failed to update drop active state");
  revalidate();
}

/** @deprecated setDropActiveAction(id, true) を使うこと */
export async function activateDropAction(id: string) {
  await setDropActiveAction(id, true);
}

export async function deleteDropAction(id: string, imageUrl: string | null) {
  // Storage 画像を先に削除（失敗してもDropは削除する）
  if (imageUrl) {
    await deleteStorageImageAction(imageUrl).catch(console.error);
  }
  // drop_images は DB の cascade で自動削除される
  const { error } = await db.deleteDrop(id);
  assertNoError(error, "Failed to delete drop");
  revalidate();
}

/** Drops の並び順を一括更新 */
export async function reorderDropsAction(
  items: { id: string; order_index: number }[]
) {
  const supabase = createServerClient();
  const results = await Promise.all(
    items.map(({ id, order_index }) =>
      supabase.from("drops").update({ order_index }).eq("id", id)
    )
  );
  const failed = results.find((r) => r.error);
  assertNoError(failed?.error ?? null, "Failed to reorder drops");
  revalidate();
}

// ── Drop Images ───────────────────────────────────────────────

export async function saveDropImageAction(data: {
  id?: string;
  drop_id: string;
  image_url: string;
  order_index: number;
}) {
  const { data: result, error } = await db.upsertDropImage(data);
  assertNoError(error, "Failed to save drop image");
  return result;
}

export async function deleteDropImageAction(id: string, imageUrl: string | null) {
  if (imageUrl) {
    await deleteStorageImageAction(imageUrl).catch(console.error);
  }
  const { error } = await db.deleteDropImage(id);
  assertNoError(error, "Failed to delete drop image");
}

export async function reorderDropImagesAction(
  items: { id: string; order_index: number }[]
) {
  const supabase = createServerClient();
  const results = await Promise.all(
    items.map(({ id, order_index }) =>
      supabase.from("drop_images").update({ order_index }).eq("id", id)
    )
  );
  const failed = results.find((r) => r.error);
  assertNoError(failed?.error ?? null, "Failed to reorder drop images");
}

// ── Products ─────────────────────────────────────────────────

export async function saveProductAction(data: {
  id?: string;
  sku: string;
  name: string;
  material: string;
  description: string;
  price: string;
  image_url: string | null;
  offset_class: string;
  order_index: number;
  active: boolean;
}) {
  const { data: result, error } = await db.upsertProduct(data);
  assertNoError(error, "Failed to save product");
  revalidate();
  return result;
}

export async function deleteProductAction(id: string) {
  const { error } = await db.deleteProduct(id);
  assertNoError(error, "Failed to delete product");
  revalidate();
}

/** Products の並び順を一括更新 */
export async function reorderProductsAction(
  items: { id: string; order_index: number }[]
) {
  const supabase = createServerClient();
  const results = await Promise.all(
    items.map(({ id, order_index }) =>
      supabase.from("products").update({ order_index }).eq("id", id)
    )
  );
  const failed = results.find((result) => result.error);
  assertNoError(failed?.error ?? null, "Failed to reorder products");
  revalidate();
}

// ── Lookbook ─────────────────────────────────────────────────

export async function saveLookbookItemAction(data: {
  id?: string;
  item_id: string;
  image_url: string | null;
  order_index: number;
}) {
  const { data: result, error } = await db.upsertLookbookItem(data);
  assertNoError(error, "Failed to save lookbook item");
  revalidate();
  return result;
}

export async function deleteLookbookItemAction(id: string) {
  const { error } = await db.deleteLookbookItem(id);
  assertNoError(error, "Failed to delete lookbook item");
  revalidate();
}

/** Lookbook の並び順を一括更新 */
export async function reorderLookbookAction(
  items: { id: string; order_index: number }[]
) {
  const supabase = createServerClient();
  const results = await Promise.all(
    items.map(({ id, order_index }) =>
      supabase.from("lookbook_items").update({ order_index }).eq("id", id)
    )
  );
  const failed = results.find((result) => result.error);
  assertNoError(failed?.error ?? null, "Failed to reorder lookbook items");
  revalidate();
}

// ── Product Images ───────────────────────────────────────────

export async function saveProductImageAction(data: {
  id?: string;
  product_id: string;
  image_url: string;
  order_index: number;
}) {
  // revalidate しない — 呼び出し元の saveProductAction でまとめて行う
  const { data: result, error } = await db.upsertProductImage(data);
  assertNoError(error, "Failed to save product image");
  return result;
}

export async function deleteProductImageAction(id: string, imageUrl: string | null) {
  if (imageUrl) {
    await deleteStorageImageAction(imageUrl).catch(console.error);
  }
  const { error } = await db.deleteProductImage(id);
  assertNoError(error, "Failed to delete product image");
  // revalidate しない — 呼び出し元の saveProductAction でまとめて行う
}

export async function reorderProductImagesAction(
  items: { id: string; order_index: number }[]
) {
  const supabase = createServerClient();
  const results = await Promise.all(
    items.map(({ id, order_index }) =>
      supabase.from("product_images").update({ order_index }).eq("id", id)
    )
  );
  const failed = results.find((r) => r.error);
  assertNoError(failed?.error ?? null, "Failed to reorder product images");
  // revalidate しない — 呼び出し元でまとめて行う
}

// ── Site Settings ─────────────────────────────────────────────

export async function saveSiteSettingsAction(data: {
  hero_image_url: string | null;
  about_image_url: string | null;
  about_description: string;
}) {
  const { data: result, error } = await db.upsertSiteSettings(data);
  assertNoError(error, "Failed to save site settings");
  revalidate();
  return result;
}

// ── Storage 画像削除 ──────────────────────────────────────────

/**
 * Supabase Storage の画像を削除する。
 * URL が Storage 以外（例: /public/...）の場合は何もしない。
 */
export async function deleteStorageImageAction(url: string | null | undefined) {
  if (!url) return;

  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;

  const path = decodeURIComponent(url.slice(idx + marker.length));
  const supabase = createServerClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  assertNoError(error, "Failed to delete storage image");
}
