"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "../components/ImageUpload";
import {
  saveProductAction,
  deleteProductAction,
  reorderProductsAction,
  deleteStorageImageAction,
} from "../actions";
import type { Product } from "@/lib/db";

type Props = { initialProducts: Product[] };

const OFFSET_OPTIONS = [
  { value: "md:mt-0",  label: "Normal" },
  { value: "md:mt-10", label: "Down" },
  { value: "md:-mt-4", label: "Up" },
  { value: "md:mt-16", label: "Far Down" },
];

const BLANK: Omit<Product, "id" | "created_at"> = {
  sku: "", name: "", material: "", description: "",
  price: "AVAILABLE BY DM", image_url: null,
  offset_class: "md:mt-0", order_index: 0, active: true,
};

export default function ProductsClient({ initialProducts }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // UI state
  const [expandedId,      setExpandedId]      = useState<string | null>(null);
  const [addingNew,       setAddingNew]       = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error,  setError]  = useState("");
  const [success,setSuccess]= useState("");
  const [isPending, startTransition] = useTransition();

  // 新規フォームの状態
  const [newForm,          setNewForm]          = useState({ ...BLANK });
  const [newImage,         setNewImage]         = useState("");
  const [newPendingUpload, setNewPendingUpload] = useState<string | null>(null);

  // 編集フォームの状態（product.id をキーに）
  const [editForms,          setEditForms]          = useState<Record<string, Product & { _image: string }>>({});
  const [editPendingUploads, setEditPendingUploads] = useState<Record<string, string>>({});

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
        await reorderProductsAction(
          reordered.map((p) => ({ id: p.id, order_index: p.order_index }))
        );
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
    setNewForm({ ...BLANK, order_index: products.length });
    setNewImage("");
    setNewPendingUpload(null);
    setError("");
  }

  function handleCancelNew() {
    // キャンセル時：アップロード済み画像を Storage から削除
    if (newPendingUpload) {
      deleteStorageImageAction(newPendingUpload).catch(console.error);
    }
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
        const result = await saveProductAction({ ...newForm, image_url: newImage || null });
        if (result) {
          setProducts((prev) => [...prev, result]);
          setAddingNew(false);
          setNewPendingUpload(null);
          flash("追加しました");
          router.refresh();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
      }
    });
  }

  // ── 編集 ────────────────────────────────────────────────────

  function handleExpand(product: Product) {
    setExpandedId(product.id);
    setAddingNew(false);
    setEditForms((prev) => ({
      ...prev,
      [product.id]: { ...product, _image: product.image_url ?? "" },
    }));
    setError("");
  }

  function handleCancelEdit(id: string) {
    // キャンセル時：新たにアップロードした画像を削除（元の画像は残す）
    const pending  = editPendingUploads[id];
    const original = products.find((p) => p.id === id)?.image_url ?? "";
    if (pending && pending !== original) {
      deleteStorageImageAction(pending).catch(console.error);
    }
    setEditPendingUploads((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setExpandedId(null);
  }

  function handleEditField(id: string, key: string, value: unknown) {
    setEditForms((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
  }

  function handleSaveEdit(id: string) {
    const form = editForms[id];
    if (!form) return;
    setError("");
    startTransition(async () => {
      try {
        const result = await saveProductAction({
          id,
          sku: form.sku, name: form.name, material: form.material,
          description: form.description, price: form.price,
          image_url: form._image || null,
          offset_class: form.offset_class,
          order_index: form.order_index,
          active: form.active,
        });
        if (result) {
          setProducts((prev) => prev.map((p) => (p.id === id ? result : p)));
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
        await deleteProductAction(id);
        // Storage 画像も削除
        if (product?.image_url) {
          deleteStorageImageAction(product.image_url).catch(console.error);
        }
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

  function handleToggleActive(product: Product) {
    startTransition(async () => {
      try {
        const result = await saveProductAction({ ...product, active: !product.active });
        if (result) {
          setProducts((prev) => prev.map((p) => (p.id === product.id ? result : p)));
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

      {/* Notifications */}
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
              rows={2} placeholder="..."
              className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] resize-none font-mono placeholder:text-[#444]" />
          </div>
          <F label="Price" value={newForm.price} onChange={(v) => setNewForm((f) => ({ ...f, price: v }))} />
          <div>
            <p className="text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Product Image</p>
            <ImageUpload
              currentUrl={null}
              onUrlChange={setNewImage}
              onUploadComplete={(url) => setNewPendingUpload(url)}
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

            return (
              <div key={product.id}
                className={`border transition-colors ${
                  isExpanded
                    ? "border-[#333] bg-[#111]"
                    : `border-[#222] ${!product.active ? "opacity-50" : ""}`
                }`}
              >
                {/* 行ヘッダー */}
                <div className="px-4 py-3 flex items-center gap-3">
                  {/* ↑↓ 並び替えボタン */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button onClick={() => move(product.id, -1)} disabled={isPending || idx === 0}
                      className="text-[#666] hover:text-[#ccc] disabled:text-[#333] disabled:cursor-not-allowed transition-colors leading-none text-[14px] px-1">
                      ▲
                    </button>
                    <button onClick={() => move(product.id, 1)} disabled={isPending || idx === products.length - 1}
                      className="text-[#666] hover:text-[#ccc] disabled:text-[#333] disabled:cursor-not-allowed transition-colors leading-none text-[14px] px-1">
                      ▼
                    </button>
                  </div>

                  {/* サムネイル */}
                  <div className="w-9 h-11 bg-[#141414] shrink-0 overflow-hidden border border-[#1e1e1e]">
                    {product.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
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
                      <button onClick={() => setConfirmDeleteId(null)} disabled={isPending}
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

                {/* 展開編集フォーム */}
                {isExpanded && editForm && (
                  <div className="border-t border-[#222] px-4 py-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <F label="SKU"  value={editForm.sku}  onChange={(v) => handleEditField(product.id, "sku", v)} />
                      <F label="Name" value={editForm.name} onChange={(v) => handleEditField(product.id, "name", v)} />
                    </div>
                    <F label="Material" value={editForm.material} onChange={(v) => handleEditField(product.id, "material", v)} />
                    <div>
                      <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Description</label>
                      <textarea value={editForm.description}
                        onChange={(e) => handleEditField(product.id, "description", e.target.value)}
                        rows={2}
                        className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] resize-none font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <F label="Price" value={editForm.price} onChange={(v) => handleEditField(product.id, "price", v)} />
                      <div>
                        <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Grid Offset</label>
                        <select value={editForm.offset_class}
                          onChange={(e) => handleEditField(product.id, "offset_class", e.target.value)}
                          className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] font-mono">
                          {OFFSET_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <p className="text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Product Image</p>
                      <ImageUpload
                        currentUrl={editForm._image || null}
                        onUrlChange={(url) => handleEditField(product.id, "_image", url)}
                        onUploadComplete={(url) =>
                          setEditPendingUploads((prev) => ({ ...prev, [product.id]: url }))
                        }
                        folder="products"
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
