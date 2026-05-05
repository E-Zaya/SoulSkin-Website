"use server";

import { revalidatePath } from "next/cache";
import * as db from "@/lib/db";
import { createServerClient } from "@/lib/supabase";

const BUCKET = "soul-skin-images";

function revalidate() {
  revalidatePath("/");
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
  const { data: result, error } = await db.upsertDrop(data);
  if (error) throw new Error(error.message);
  revalidate();
  return result;
}

export async function createDropAction() {
  const { data: result, error } = await db.upsertDrop({
    label: "New Drop",
    title_line1: "NEW SERIES",
    title_line2: "001",
    description: "",
    pieces_left: 0,
    cta: "Order via Instagram",
    active: false,
  });
  if (error) throw new Error(error.message);
  return result;
}

export async function activateDropAction(id: string) {
  await db.setActiveDrop(id);
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
  if (error) throw new Error(error.message);
  revalidate();
  return result;
}

export async function deleteProductAction(id: string) {
  const { error } = await db.deleteProduct(id);
  if (error) throw new Error(error.message);
  revalidate();
}

/** Products の並び順を一括更新 */
export async function reorderProductsAction(
  items: { id: string; order_index: number }[]
) {
  const supabase = createServerClient();
  await Promise.all(
    items.map(({ id, order_index }) =>
      supabase.from("products").update({ order_index }).eq("id", id)
    )
  );
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
  if (error) throw new Error(error.message);
  revalidate();
  return result;
}

export async function deleteLookbookItemAction(id: string) {
  const { error } = await db.deleteLookbookItem(id);
  if (error) throw new Error(error.message);
  revalidate();
}

/** Lookbook の並び順を一括更新 */
export async function reorderLookbookAction(
  items: { id: string; order_index: number }[]
) {
  const supabase = createServerClient();
  await Promise.all(
    items.map(({ id, order_index }) =>
      supabase.from("lookbook_items").update({ order_index }).eq("id", id)
    )
  );
  revalidate();
}

// ── Storage 画像削除 ──────────────────────────────────────────

/**
 * Supabase Storage の画像を削除する。
 * URL が Storage 以外（例: /public/...）の場合は何もしない。
 */
export async function deleteStorageImageAction(url: string) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return; // Storage URL でなければスキップ

  const path = url.slice(idx + marker.length);
  const supabase = createServerClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
