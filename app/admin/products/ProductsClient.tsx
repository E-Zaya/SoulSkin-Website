"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "../components/ImageUpload";
import {
  saveProductAction,
  deleteProductAction,
  reorderProductsAction,
  saveProductImageAction,
  deleteProductImageAction,
  deleteStorageImageAction,
} from "../actions";
import type { ProductWithImages, ProductImage } from "@/lib/db";

type Props = { initialProducts: ProductWithImages[] };

const OFFSET_OPTIONS = [
  { value: "md:mt-0",   label: "Normal" },
  { value: "md:mt-10",  label: "Down" },
  { value: "md:-mt-4",  label: "Up" },
  { value: "md:mt-20",  label: "Far Down" },
];

const BLANK_FORM = {
  sku: "", name: "", material: "", description: "",
  price: "AVAILABLE BY DM", image_url: null as string | null,
  offset_class: "md:mt-0", order_index: 0, active: true,
};

const MAX_IMAGES = 4;

// ─── 画像管理サブセクション ──────────────────────────────────

function ProductImagesEditor({
  productId,
  images,
  onImagesChange,
}: {
  productId: string;
  images: ProductImage[];
  onImagesChange: (imgs: ProductImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [pendingUrls, setPendingUrls] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  function handleAdd(url: string, uploadedUrl?: string) {
    if (!url || images.length >= MAX_IMAGES) return;
    const nextOrder = images.length;
    setUploading(true);
    startTransition(async () => {
      try {
        const result = await saveProductImageAction({
          product_id: productId,
          image_url: url,
          order_index: nextOrder,
        });
        if (result) onImagesChange([...images, result as ProductImage]);
        if (uploadedUrl) setPendingUrls((p) => { const n = { ...p }; delete n[uploadedUrl]; return n; });
      } finally {
        setUploading(false);
      }
    });
  }

  function handleRemove(img: ProductImage) {
    startTransition(async () => {
      await deleteProductImageAction(img.id, img.image_url);
      const next = images
        .filter((i) => i.id !== img.id)
        .map((i, idx) => ({ ...i, order_index: idx }));
      onImagesChange(next);
    });
  }

  function handleMoveUp(img: ProductImage) {
    const idx = images.findIndex((i) => i.id === img.id);
    if (idx <= 0) return;
    const next = [...images];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    const reordered = next.map((i, n) => ({ ...i, order_index: n }));
    onImagesChange(reordered);
    startTransition(async () => {
      await Promise.all(
        reordered.map((i) => saveProductImageAction({ id: i.id, product_id: productId, image_url: i.image_url, order_index: i.order_index }))
      );
    });
  }

  function handleMoveDown(img: ProductImage) {
    const idx = images.findIndex((i) => i.id === img.id);
    if (idx >= images.length - 1) return;
    const next = [...images];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    const reordered = next.map((i, n) => ({ ...i, order_index: n }));
    onImagesChange(reordered);
    startTransition(async () => {
      await Promise.all(
        reordered.map((i) => saveProductImageAction({ id: i.id, product_id: productId, image_url: i.image_url, order_index: i.order_index }))
      );
    });
  }

  // 新規追加用の一時的なURL state
  const [newUrl, setNewUrl] = useState("");
  const [pendingNew, setPendingNew] = useState<string | null>(null);

  const canAdd = images.length < MAX_IMAGES;

  return (
    <div>
      <p className="text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-3">
        Product Images
        <span className="text-[#555] ml-2 normal-case tracking-normal">
          ({images.length}/{MAX_IMAGES}) — 1枚目がメイン表示
        </span>
      </p>

      {/* 既存画像リスト */}
      <div className="space-y-2 mb-3">
        {images.map((img, i) => (
          <div key={img.id} className="flex items-center gap-2 border border-[#1e1e1e] px-3 py-2 bg-[#0a0a0a]">
            {/* サムネイル */}
            <div className="w-8 h-10 shrink-0 overflow-hidden bg-[#141414]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            </div>
            {/* 順番 */}
            <span className="font-mono text-[11px] text-[#555] w-4 shrink-0">{i + 1}</span>
            {/* URL（truncate） */}
            <span className="font-mono text-[11px] text-[#888] flex-1 truncate">{img.image_url.split("/").pop()}</span>
            {/* 上下ボタン */}
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => handleMoveUp(img)}
                disabled={i === 0}
                className="text-[#555] hover:text-[#ccc] disabled:text-[#2a2a2a] transition-colors text-[11px] px-1"
              >▲</button>
              <button
                onClick={() => handleMoveDown(img)}
                disabled={i === images.length - 1}
                className="text-[#555] hover:text-[#ccc] disabled:text-[#2a2a2a] transition-colors text-[11px] px-1"
              >▼</button>
            </div>
            {/* 削除 */}
            <button
              onClick={() => handleRemove(img)}
              className="font-mono text-[11px] text-[#555] hover:text-[#f07070] transition-colors shrink-0 ml-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* 新規追加 */}
      {canAdd && (
        <div className="border border-dashed border-[#282828] p-3 bg-[#090909]">
          <p className="font-mono text-[11px] text-[#555] mb-2">画像を追加 (残り {MAX_IMAGES - images.length} 枚)</p>
          <ImageUpload
            currentUrl={null}
            onUrlChange={setNewUrl}
            onUploadComplete={(url) => {
              if (pendingNew && pendingNew !== url) {
                deleteStorageImageAction(pendingNew).catch(console.error);
              }
              setPendingNew(url);
              handleAdd(url, url);
              setNewUrl("");
              setPendingNew(null);
            }}
            folder="products"
          />
          {newUrl && !pendingNew && (
            <button
              onClick={() => { handleAdd(newUrl); setNewUrl(""); }}
              disabled={uploading}
              className="mt-2 font-mono text-[11px] tracking-widest uppercase border border-[#333] px-3 py-1.5 text-[#aaa] hover:text-[#f0f0f0] hover:border-[#555] transition-colors disabled:opacity-40"
            >
              {uploading ? "追加中..." : "+ Add"}
            </button>
          )}
        </div>
      )}

      {!canAdd && (
        <p className="font-mono text-[10px] text-[#555] mt-1">最大 {MAX_IMAGES} 枚に達しました</p>
      )}
    </div>
  );
}

// ─── メインコンポーネント ──────────────────────────────────────

export default function ProductsClient({ initialProducts }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithImages[]>(initialProducts);

  const [expandedId,      setExpandedId]      = useState<string | null>(null);
  const [addingNew,       setAddingNew]       = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error,  setError]  = useState("");
  const [success,setSuccess]= useState("");
  const [isPending, startTransition] = useTransition();

  // 新規フォーム
  const [newForm,          setNewForm]          = useState({ ...BLANK_FORM });
  const [newImage,         setNewImage]         = useState("");
  const [newPendingUpload, setNewPendingUpload] = useState<string | null>(null);

  // 編集フォーム (productId → フォーム状態)
  type EditForm = typeof BLANK_FORM & { _image: string };
  const [editForms,          setEditForms]          = useState<Record<string, EditForm>>({});
  const [editPendingUploads, setEditPendingUploads] = useState<Record<string, string>>({});

  // 編集中の product_images (productId → ProductImage[])
  const [editImages, setEditImages] = useState<Record<string, ProductImage[]>>({});

  function flash(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  // ── 並び替え ────────────────────────────────────────────────

  function move(id: string, dir: -1 | 1) {
    const idx = products.findIndex((p) => p.id === id);
    const target = idx + dir;
    if (target < 0 || target >= products.length) return;
    const next = [...products];
    [next[idx], next[target]] = [next[target], next[idx]];
    const reordered = next.map((p, i) => ({ ...p, order_index: i }));
    setProducts(reordered);
    startTransition(async () => {
      try {
        await reorderProductsAction(reordered.map((p) => ({ id: p.id, order_index: p.order_index })));
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "並び替えに失敗しました");
      }
    });
  }

  // ── 新規追加 ────────────────────────────────────────────────

  function handleAddNew() {
    setAddingNew(true);
    setExpandedId(null);
    setNewForm({ ...BLANK_FORM, order_index: products.length });
    setNewImage("");
    setNewPendingUpload(null);
    setError("");
  }

  function handleCancelNew() {
    if (newPendingUpload) deleteStorageImageAction(newPendingUpload).catch(console.error);
    setAddingNew(false);
    setNewPendingUpload(null);
  }

  function handleSaveNew() {
    if (!newForm.name.trim() || !newForm.sku.trim()) {
      setError("Name と SKU は必須です");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        // 新規作成: image_url はフォールバック用として products に保存するだけ。
        // product_images への追加は Edit から行う（revalidate 競合を防ぐため）
        const result = await saveProductAction({ ...newForm, image_url: newImage || null });
        if (result) {
          setProducts((prev) => [...prev, { ...result, images: [] }]);
          setAddingNew(false);
          setNewPendingUpload(null);
          flash("追加しました。Edit から画像を追加してください。");
          router.refresh();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
      }
    });
  }

  // ── 編集 ────────────────────────────────────────────────────

  function handleExpand(product: ProductWithImages) {
    setExpandedId(product.id);
    setAddingNew(false);
    setEditForms((prev) => ({
      ...prev,
      [product.id]: { ...product, _image: product.image_url ?? "" },
    }));
    setEditImages((prev) => ({ ...prev, [product.id]: product.images ?? [] }));
    setError("");
  }

  function handleCancelEdit(id: string) {
    const pending  = editPendingUploads[id];
    const original = products.find((p) => p.id === id)?.image_url ?? "";
    if (pending && pending !== original) deleteStorageImageAction(pending).catch(console.error);
    setEditPendingUploads((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setExpandedId(null);
  }

  function handleEditField(id: string, key: string, value: unknown) {
    setEditForms((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
  }

  function handleSaveEdit(id: string) {
    const form = editForms[id];
    if (!form) return;
    if (!id) { setError("Product ID が見つかりません"); return; }
    setError("");
    startTransition(async () => {
      try {
        const imgs = editImages[id] ?? [];
        // 1枚目の product_images URL を image_url に同期（フォールバック用）
        const firstImg = (imgs[0]?.image_url ?? form._image) || null;

        // id を明示して UPDATE — 新規レコードを作らない
        const result = await saveProductAction({
          id,          // 必ず渡す → upsert が UPDATE になる
          sku: form.sku, name: form.name, material: form.material,
          description: form.description, price: form.price,
          image_url: firstImg,
          offset_class: form.offset_class,
          order_index: form.order_index,
          active: form.active,
        });
        if (result) {
          // state を先に更新してから refresh
          setProducts((prev) =>
            prev.map((p) => p.id === id ? { ...result, images: imgs } : p)
          );
          setEditPendingUploads((prev) => { const n = { ...prev }; delete n[id]; return n; });
          setExpandedId(null);
          flash("保存しました");
          router.refresh();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
      }
    });
  }

  // ── 削除 ────────────────────────────────────────────────────

  function handleDelete(id: string) {
    const product = products.find((p) => p.id === id);
    setError("");
    startTransition(async () => {
      try {
        // product_images は DB の cascade で自動削除
        await deleteProductAction(id);
        if (product?.image_url) deleteStorageImageAction(product.image_url).catch(console.error);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setConfirmDeleteId(null);
        setExpandedId(null);
        flash("削除しました");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "削除に失敗しました");
        setConfirmDeleteId(null);
      }
    });
  }

  // ── Active トグル ────────────────────────────────────────────

  function handleToggleActive(product: ProductWithImages) {
    startTransition(async () => {
      try {
        const result = await saveProductAction({ ...product, active: !product.active });
        if (result) {
          setProducts((prev) => prev.map((p) => p.id === product.id ? { ...result, images: p.images } : p));
          router.refresh();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
      }
    });
  }

  // ── Render ───────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[13px] tracking-[0.25em] text-[#aaa] uppercase font-mono">Products</h1>
        {!addingNew && (
          <button onClick={handleAddNew} disabled={isPending}
            className="text-[12px] tracking-widest uppercase font-mono border border-[#333] px-4 py-2 text-[#aaa] hover:text-[#f0f0f0] hover:border-[#555] transition-colors disabled:opacity-40">
            + Add Product
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 border border-[#4a1a1a] bg-[#1a0f0f] px-4 py-3 text-[13px] text-[#f07070] font-mono">{error}</div>
      )}
      {success && (
        <div className="mb-4 border border-[#1a3d2a] bg-[#0d1a14] px-4 py-3 text-[13px] text-[#5dd49a] font-mono">{success}</div>
      )}

      {/* ── 新規追加フォーム ── */}
      {addingNew && (
        <div className="mb-4 border border-[#333] bg-[#111] p-5 space-y-4">
          <p className="text-[12px] tracking-[0.2em] text-[#aaa] uppercase font-mono">New Product</p>
          <div className="grid grid-cols-2 gap-3">
            <F label="SKU *"  value={newForm.sku}  onChange={(v) => setNewForm((f) => ({ ...f, sku: v }))}  placeholder="SK-004" />
            <F label="Name *" value={newForm.name} onChange={(v) => setNewForm((f) => ({ ...f, name: v }))} placeholder="VOID JACKET" />
          </div>
          <F label="Material" value={newForm.material} onChange={(v) => setNewForm((f) => ({ ...f, material: v }))} placeholder="HEAVY COTTON / 380GSM" />
          <div>
            <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Description</label>
            <textarea value={newForm.description} onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))}
              rows={2} placeholder="詳細説明..."
              className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] resize-none font-mono placeholder:text-[#444]" />
          </div>
          <F label="Price" value={newForm.price} onChange={(v) => setNewForm((f) => ({ ...f, price: v }))} />
          <div>
            <p className="text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">
              1枚目の画像 <span className="text-[#555] normal-case tracking-normal font-mono">(保存後に追加画像を設定できます)</span>
            </p>
            <ImageUpload
              currentUrl={null}
              onUrlChange={setNewImage}
              onUploadComplete={(url) => {
                if (newPendingUpload && newPendingUpload !== url) deleteStorageImageAction(newPendingUpload).catch(console.error);
                setNewPendingUpload(url);
              }}
              folder="products"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={handleSaveNew} disabled={isPending}
              className="border border-[#444] text-[12px] font-mono tracking-widest uppercase px-5 py-2.5 text-[#ccc] hover:bg-[#1a1a1a] hover:text-[#f0f0f0] transition-colors disabled:opacity-40">
              {isPending ? "Creating..." : "Create Product"}
            </button>
            <button onClick={handleCancelNew} disabled={isPending}
              className="border border-[#222] text-[12px] font-mono tracking-widest uppercase px-5 py-2.5 text-[#777] hover:text-[#aaa] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── 商品リスト ── */}
      {products.length === 0 && !addingNew ? (
        <p className="text-[13px] text-[#666] font-mono py-10 text-center">
          商品がまだありません。「+ Add Product」から追加してください。
        </p>
      ) : (
        <div className="space-y-2">
          {products.map((product, idx) => {
            const isExpanded = expandedId === product.id;
            const isDeleting = confirmDeleteId === product.id;
            const editForm   = editForms[product.id];
            const imgs       = editImages[product.id] ?? product.images ?? [];
            const thumb      = imgs[0]?.image_url ?? product.image_url;

            return (
              <div key={product.id}
                className={`border transition-colors ${
                  isExpanded ? "border-[#333] bg-[#111]" : `border-[#222] ${!product.active ? "opacity-50" : ""}`
                }`}
              >
                {/* 行ヘッダー */}
                <div className="px-4 py-3 flex items-center gap-3">
                  {/* ↑↓ 並び替えボタン */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button onClick={() => move(product.id, -1)} disabled={isPending || idx === 0}
                      className="text-[#666] hover:text-[#ccc] disabled:text-[#333] disabled:cursor-not-allowed transition-colors leading-none text-[14px] px-1">▲</button>
                    <button onClick={() => move(product.id, 1)} disabled={isPending || idx === products.length - 1}
                      className="text-[#666] hover:text-[#ccc] disabled:text-[#333] disabled:cursor-not-allowed transition-colors leading-none text-[14px] px-1">▼</button>
                  </div>

                  {/* サムネイル（1枚目画像） */}
                  <div className="w-9 h-11 bg-[#141414] shrink-0 overflow-hidden border border-[#1e1e1e] relative">
                    {thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt={product.name} className="w-full h-full object-cover" />
                    )}
                    {imgs.length > 1 && (
                      <div className="absolute bottom-0.5 right-0.5 bg-void/80 px-0.5 rounded-sm">
                        <span className="font-mono text-[8px] text-bone/70">{imgs.length}</span>
                      </div>
                    )}
                  </div>

                  {/* 名前・SKU */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-[#f0f0f0] font-mono truncate">{product.name}</p>
                    <p className="text-[11px] text-[#777] font-mono">{product.sku}</p>
                  </div>

                  {/* アクション */}
                  {isDeleting ? (
                    <div className="flex items-center gap-3 shrink-0 flex-wrap">
                      <span className="text-[12px] text-[#f07070] font-mono">本当に削除しますか？</span>
                      <button onClick={() => handleDelete(product.id)} disabled={isPending}
                        className="text-[11px] font-mono tracking-widest uppercase text-[#f07070] border border-[#4a1a1a] px-3 py-1 hover:bg-[#4a1a1a] transition-colors disabled:opacity-40">
                        {isPending ? "..." : "削除する"}
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)}
                        className="text-[11px] font-mono text-[#888] hover:text-[#ccc] transition-colors">
                        キャンセル
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 shrink-0">
                      <button onClick={() => isExpanded ? handleCancelEdit(product.id) : handleExpand(product)}
                        className="text-[12px] font-mono tracking-widest uppercase text-[#aaa] hover:text-[#f0f0f0] transition-colors">
                        {isExpanded ? "Close" : "Edit"}
                      </button>
                      <button onClick={() => handleToggleActive(product)} disabled={isPending}
                        className="text-[12px] font-mono tracking-widest uppercase text-[#777] hover:text-[#ccc] transition-colors">
                        {product.active ? "Hide" : "Show"}
                      </button>
                      <button onClick={() => setConfirmDeleteId(product.id)}
                        className="text-[12px] font-mono tracking-widest uppercase text-[#555] hover:text-[#f07070] transition-colors">
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* ── 展開編集フォーム ── */}
                {isExpanded && editForm && (
                  <div className="border-t border-[#222] px-4 py-5 space-y-5">
                    {/* 基本情報 */}
                    <div className="grid grid-cols-2 gap-3">
                      <F label="SKU"  value={editForm.sku}  onChange={(v) => handleEditField(product.id, "sku", v)} />
                      <F label="Name" value={editForm.name} onChange={(v) => handleEditField(product.id, "name", v)} />
                    </div>
                    <F label="Material" value={editForm.material} onChange={(v) => handleEditField(product.id, "material", v)} />
                    <div>
                      <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Description</label>
                      <textarea value={editForm.description}
                        onChange={(e) => handleEditField(product.id, "description", e.target.value)}
                        rows={3}
                        className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] resize-none font-mono leading-relaxed" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <F label="Price" value={editForm.price} onChange={(v) => handleEditField(product.id, "price", v)} />
                      <div>
                        <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Grid Offset</label>
                        <select value={editForm.offset_class}
                          onChange={(e) => handleEditField(product.id, "offset_class", e.target.value)}
                          className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] font-mono">
                          {OFFSET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* ── 複数画像管理 ── */}
                    <div className="border-t border-[#1a1a1a] pt-5">
                      <ProductImagesEditor
                        productId={product.id}
                        images={editImages[product.id] ?? product.images ?? []}
                        onImagesChange={(imgs) =>
                          setEditImages((prev) => ({ ...prev, [product.id]: imgs }))
                        }
                      />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={editForm.active}
                        onChange={(e) => handleEditField(product.id, "active", e.target.checked)}
                        className="w-4 h-4 accent-white" />
                      <span className="text-[13px] font-mono text-[#aaa]">Active (visible on site)</span>
                    </label>

                    <div className="flex gap-3">
                      <button onClick={() => handleSaveEdit(product.id)} disabled={isPending}
                        className="border border-[#444] text-[12px] font-mono tracking-widest uppercase px-5 py-2.5 text-[#ccc] hover:bg-[#1a1a1a] hover:text-[#f0f0f0] transition-colors disabled:opacity-40">
                        {isPending ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => handleCancelEdit(product.id)} disabled={isPending}
                        className="border border-[#222] text-[12px] font-mono tracking-widest uppercase px-5 py-2.5 text-[#777] hover:text-[#aaa] transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function F({
  label, value, onChange, placeholder,
}: {
  label: string; value: string | number; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] font-mono placeholder:text-[#444]" />
    </div>
  );
}
