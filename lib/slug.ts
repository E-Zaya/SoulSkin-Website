/**
 * URL スラグ用ユーティリティ。
 *
 * Drop の `label` (例: "SS 25") や Product の `sku` (例: "HALO-TEE") を
 * URL セグメントに使える形（小文字・ハイフン区切り・英数のみ）に整える。
 *
 * 注意: 同じスラグになる Drop / Product が複数あった場合は、最初の 1 件が
 * 優先される（getDropBySlug / getProductBySlugWithImages の実装側）。
 * 衝突を避けるためには、admin 側で label / sku を一意に運用する必要がある。
 */
export function toSlug(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .toString()
    .normalize("NFKD")
    // 連続するスペース・記号をハイフンに
    .replace(/[\s_]+/g, "-")
    // 英数とハイフン以外を除去
    .replace(/[^a-zA-Z0-9-]/g, "")
    // ハイフンの連続を 1 つに
    .replace(/-+/g, "-")
    // 先頭・末尾のハイフンを除去
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}
