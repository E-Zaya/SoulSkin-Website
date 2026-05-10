"use server";

import { revalidatePath } from "next/cache";
import * as db from "@/lib/db";
import { createServerClient } from "@/lib/supabase";

const BUCKET = "soul-skin-images";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/drop");
  revalidatePath("/admin/products");
  revalidatePath("/admin/lookbook");
  revalidatePath("/admin/site");
}

function assertNoError(error: { message: string } | null, fallback: string) {
  if (error) throw new Error(error.message || fallback);
}

// ── Drop ─────────────────────────────────────────────────────

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
}) {
  const shouldActivate = data.active;
  const { data: result, error } = await db.upsertDrop(
    shouldActivate ? { ...data, active: false } : data
  );

  assertNoError(error, "Drop の保存に失敗しました");
  if (!result) throw new Error("Drop の保存結果が取得できませんでした");

  if (shouldActivate) {
    const { data: activatedDrop, error: activationError } = await db.setActiveDrop(result.id);
    assertNoError(activationError, "Active Drop の切り替えに失敗しました");
    revalidate();
    return activatedDrop ?? { ...result, active: true };
  }

  revalidate();
  return result;
}

export async function createDropAction() {
  const { data: result, error } = await db.upsertDrop({
    label: "New Drop",
    title_line1: "",
    title_line2: "",
    description: "",
    pieces_left: 0,
    cta: "",
    active: false,
  });
  assertNoError(error, "Drop の作成に失敗しました");
  return result;
}

export async function activateDropAction(id: string) {
  const { error } = await db.setActiveDrop(id);
  assertNoError(error, "Active Drop の切り替えに失敗しました");
  revalidate();
}

export async function deleteDropAction(id: string, imageUrl: string | null) {
  // Storage 画像を先に削除（失敗してもDropは削除する）
  if (imageUrl) {
    await deleteStorageImageAction(imageUrl).catch(console.error);
  }
  const { error } = await db.deleteDrop(id);
  assertNoError(error, "Drop の削除に失敗しました");
  revalidate();
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
  assertNoError(error, "Product の保存に失敗しました");
  revalidate();
  return result;
}

export async function deleteProductAction(id: string) {
  const { error } = await db.deleteProduct(id);
  assertNoError(error, "Product の削除に失敗しました");
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
  assertNoError(failed?.error ?? null, "Products の並び替えに失敗しました");
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
  assertNoError(error, "Lookbook item の保存に失敗しました");
  revalidate();
  return result;
}

export async function deleteLookbookItemAction(id: string) {
  const { error } = await db.deleteLookbookItem(id);
  assertNoError(error, "Lookbook item の削除に失敗しました");
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
  assertNoError(failed?.error ?? null, "Lookbook の並び替えに失敗しました");
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
  assertNoError(error, "Product image の保存に失敗しました");
  return result;
}

export async function deleteProductImageAction(id: string, imageUrl: string | null) {
  if (imageUrl) {
    await deleteStorageImageAction(imageUrl).catch(console.error);
  }
  const { error } = await db.deleteProductImage(id);
  assertNoError(error, "Product image の削除に失敗しました");
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
  assertNoError(failed?.error ?? null, "Product images の並び替えに失敗しました");
  // revalidate しない — 呼び出し元でまとめて行う
}

// ── Site Settings ─────────────────────────────────────────────

export async function saveSiteSettingsAction(data: {
  hero_image_url: string | null;
  about_image_url: string | null;
  about_description: string;
}) {
  const { data: result, error } = await db.upsertSiteSettings(data);
  assertNoError(error, "Site 設定の保存に失敗しました");
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
  assertNoError(error, "Storage 画像の削除に失敗しました");
}
