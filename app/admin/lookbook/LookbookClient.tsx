"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "../components/ImageUpload";
import {
  saveLookbookItemAction,
  deleteLookbookItemAction,
  reorderLookbookAction,
  deleteStorageImageAction,
} from "../actions";
import type { LookbookItem } from "@/lib/db";

type Props = { initialItems: LookbookItem[] };
type EditState = { item_id: string; image_url: string; order_index: number };

export default function LookbookClient({ initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<LookbookItem[]>(initialItems);

  const [expandedId,      setExpandedId]      = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [addingNew,       setAddingNew]       = useState(false);
  const [error,  setError]  = useState("");
  const [success,setSuccess]= useState("");
  const [isPending, startTransition] = useTransition();

  // 編集フォーム状態
  const [editStates,         setEditStates]         = useState<Record<string, EditState>>({});
  const [editPendingUploads, setEditPendingUploads] = useState<Record<string, string>>({});

  // 新規フォーム状態
  const [newItem,          setNewItem]          = useState({ item_id: "", image_url: "", order_index: 0 });
  const [newPendingUpload, setNewPendingUpload] = useState<string | null>(null);

  function flash(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  // ── 並び替え ↑↓ ─────────────────────────────────────────────

  function move(id: string, dir: -1 | 1) {
    const idx    = items.findIndex((i) => i.id === id);
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;

    const next = [...items];
    [next[idx], next[target]] = [next[target], next[idx]];
    const reordered = next.map((item, i) => ({ ...item, order_index: i }));
    setItems(reordered);

    startTransition(async () => {
      try {
        await reorderLookbookAction(
          reordered.map((item) => ({ id: item.id, order_index: item.order_index }))
        );
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to reorder items");
      }
    });
  }

  // ── 新規追加 ─────────────────────────────────────────────────

  function handleAddNew() {
    setAddingNew(true);
    setExpandedId(null);
    setNewItem({ item_id: `SS25 — 00${items.length + 1}`, image_url: "", order_index: items.length });
    setNewPendingUpload(null);
    setError("");
  }

  function handleCancelNew() {
    if (newPendingUpload) {
      deleteStorageImageAction(newPendingUpload).catch(console.error);
    }
    setAddingNew(false);
    setNewPendingUpload(null);
  }

  function handleSaveNew() {
    setError("");
    startTransition(async () => {
      try {
        const result = await saveLookbookItemAction({
          item_id:     newItem.item_id || `SS25 — 00${items.length + 1}`,
          image_url:   newItem.image_url || null,
          order_index: newItem.order_index,
        });
        if (result) {
          setItems((prev) => [...prev, result]);
          setAddingNew(false);
          setNewPendingUpload(null);
          flash("Added");
          router.refresh();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
      }
    });
  }

  // ── 編集 ─────────────────────────────────────────────────────

  function handleExpand(item: LookbookItem) {
    setExpandedId(item.id);
    setAddingNew(false);
    setEditStates((prev) => ({
      ...prev,
      [item.id]: { item_id: item.item_id, image_url: item.image_url ?? "", order_index: item.order_index },
    }));
    setError("");
  }

  function handleCancelEdit(id: string) {
    const pending  = editPendingUploads[id];
    const original = items.find((i) => i.id === id)?.image_url ?? "";
    if (pending && pending !== original) {
      deleteStorageImageAction(pending).catch(console.error);
    }
    setEditPendingUploads((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setExpandedId(null);
  }

  function handleSaveEdit(id: string) {
    const state = editStates[id];
    if (!state) return;
    setError("");
    startTransition(async () => {
      try {
        const result = await saveLookbookItemAction({
          id,
          item_id:     state.item_id,
          image_url:   state.image_url || null,
          order_index: state.order_index,
        });
        if (result) {
          const original = items.find((i) => i.id === id)?.image_url ?? null;
          if (original && original !== result.image_url) {
            deleteStorageImageAction(original).catch(console.error);
          }
          setItems((prev) => prev.map((i) => (i.id === id ? result : i)));
          setEditPendingUploads((prev) => { const n = { ...prev }; delete n[id]; return n; });
          setExpandedId(null);
          flash("Saved");
          router.refresh();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
      }
    });
  }

  // ── 削除 ─────────────────────────────────────────────────────

  function handleDelete(id: string) {
    const item = items.find((i) => i.id === id);
    setError("");
    startTransition(async () => {
      try {
        await deleteLookbookItemAction(id);
        if (item?.image_url) {
          deleteStorageImageAction(item.image_url).catch(console.error);
        }
        setItems((prev) => prev.filter((i) => i.id !== id));
        setConfirmDeleteId(null);
        setExpandedId(null);
        flash("Deleted");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete");
        setConfirmDeleteId(null);
      }
    });
  }

  // ── Render ───────────────────────────────────────────────────

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-sm tracking-label text-mist uppercase">Lookbook</h1>
        {!addingNew && (
          <button onClick={handleAddNew} disabled={isPending}
            className="text-xs tracking-widest uppercase border border-iron px-4 py-2 text-mist hover:text-bone hover:border-iron transition-colors disabled:opacity-40">
            + Add Item
          </button>
        )}
      </div>

      <p className="text-xs text-mist mb-5">
        All registered items are shown on the site. Use the up and down controls to change the order.
      </p>

      {error && (
        <div className="mb-4 border border-error/50 bg-error/10 px-4 py-3 text-sm text-error">{error}</div>
      )}
      {success && (
        <div className="mb-4 border border-ok/40 bg-ok/10 px-4 py-3 text-sm text-ok">{success}</div>
      )}

      {/* ── 新規追加フォーム ── */}
      {addingNew && (
        <div className="mb-4 border border-iron bg-ash p-5 space-y-4">
          <p className="text-xs tracking-label text-mist uppercase">New Lookbook Item</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs tracking-label text-mist uppercase mb-2">Item ID</label>
              <input type="text" value={newItem.item_id}
                onChange={(e) => setNewItem((f) => ({ ...f, item_id: e.target.value }))}
                placeholder="SS25 — 001"
                className="w-full bg-void border border-cinder text-bone text-sm px-3 py-2.5 focus:border-iron placeholder:text-mist"
              />
            </div>
            <div>
              <label className="block text-xs tracking-label text-mist uppercase mb-2">Order</label>
              <input type="number" value={newItem.order_index} min={0}
                onChange={(e) => setNewItem((f) => ({ ...f, order_index: Number(e.target.value) }))}
                className="w-full bg-void border border-cinder text-bone text-sm px-3 py-2.5 focus:border-iron"
              />
            </div>
          </div>
          <div>
            <p className="text-xs tracking-label text-mist uppercase mb-2">Image</p>
            <ImageUpload
              currentUrl={null}
              onUrlChange={(url) => setNewItem((f) => ({ ...f, image_url: url }))}
              onUploadComplete={(url) => {
                if (newPendingUpload && newPendingUpload !== url) {
                  deleteStorageImageAction(newPendingUpload).catch(console.error);
                }
                setNewPendingUpload(url);
              }}
              folder="lookbook"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={handleSaveNew} disabled={isPending}
              className="border border-iron text-xs tracking-widest uppercase px-5 py-2.5 text-dust hover:bg-ash hover:text-bone transition-colors disabled:opacity-40">
              {isPending ? "Adding..." : "Add Item"}
            </button>
            <button onClick={handleCancelNew} disabled={isPending}
              className="border border-cinder text-xs tracking-widest uppercase px-5 py-2.5 text-mist hover:text-mist transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── アイテムリスト ── */}
      <div className="space-y-2">
        {items.map((item, idx) => {
          const isExpanded = expandedId === item.id;
          const isDeleting = confirmDeleteId === item.id;
          const state      = editStates[item.id];
          const isLive     = idx < 3;

          return (
            <div key={item.id}
              className={`border transition-colors ${isExpanded ? "border-iron bg-ash" : "border-cinder"}`}
            >
              {/* 行ヘッダー */}
              <div className="px-4 py-3 flex items-center gap-3">
                {/* ↑↓ 並び替え */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button onClick={() => move(item.id, -1)} disabled={isPending || idx === 0}
                    className="text-mist hover:text-dust disabled:text-mist disabled:cursor-not-allowed transition-colors text-sm px-1 leading-none">
                    ▲
                  </button>
                  <button onClick={() => move(item.id, 1)} disabled={isPending || idx === items.length - 1}
                    className="text-mist hover:text-dust disabled:text-mist disabled:cursor-not-allowed transition-colors text-sm px-1 leading-none">
                    ▼
                  </button>
                </div>

                {/* サムネイル */}
                <div className="w-9 h-11 bg-ash shrink-0 overflow-hidden border border-cinder">
                  {item.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.item_id} className="w-full h-full object-cover" />
                  )}
                </div>

                {/* ID + Live バッジ */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-bone truncate">{item.item_id}</p>
                  {isLive && (
                    <span className="text-xs tracking-widest text-ok">● LIVE</span>
                  )}
                </div>

                {/* アクション */}
                {isDeleting ? (
                  <div className="flex items-center gap-3 shrink-0 flex-wrap">
                    <span className="text-xs text-error">Delete this item?</span>
                    <button onClick={() => handleDelete(item.id)} disabled={isPending}
                      className="text-xs tracking-widest uppercase text-error border border-error/50 px-3 py-1 hover:bg-error/30 transition-colors disabled:opacity-40">
                      {isPending ? "..." : "Delete"}
                    </button>
                    <button onClick={() => setConfirmDeleteId(null)} disabled={isPending}
                      className="text-xs text-mist hover:text-dust transition-colors">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 shrink-0">
                    <button onClick={() => isExpanded ? handleCancelEdit(item.id) : handleExpand(item)}
                      className="text-xs tracking-widest uppercase text-mist hover:text-bone transition-colors">
                      {isExpanded ? "Close" : "Edit"}
                    </button>
                    <button onClick={() => setConfirmDeleteId(item.id)}
                      className="text-xs tracking-widest uppercase text-mist hover:text-error transition-colors">
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* 展開編集フォーム */}
              {isExpanded && state && (
                <div className="border-t border-cinder px-4 py-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs tracking-label text-mist uppercase mb-2">Item ID</label>
                      <input type="text" value={state.item_id}
                        onChange={(e) => setEditStates((prev) => ({ ...prev, [item.id]: { ...prev[item.id], item_id: e.target.value } }))}
                        className="w-full bg-void border border-cinder text-bone text-sm px-3 py-2.5 focus:border-iron"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-label text-mist uppercase mb-2">Order</label>
                      <input type="number" value={state.order_index} min={0}
                        onChange={(e) => setEditStates((prev) => ({ ...prev, [item.id]: { ...prev[item.id], order_index: Number(e.target.value) } }))}
                        className="w-full bg-void border border-cinder text-bone text-sm px-3 py-2.5 focus:border-iron"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs tracking-label text-mist uppercase mb-2">Image</p>
                    <ImageUpload
                      currentUrl={state.image_url || null}
                      onUrlChange={(url) => setEditStates((prev) => ({ ...prev, [item.id]: { ...prev[item.id], image_url: url } }))}
                      onUploadComplete={(url) => {
                        const pending = editPendingUploads[item.id];
                        if (pending && pending !== url) {
                          deleteStorageImageAction(pending).catch(console.error);
                        }
                        setEditPendingUploads((prev) => ({ ...prev, [item.id]: url }));
                      }}
                      folder="lookbook"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleSaveEdit(item.id)} disabled={isPending}
                      className="border border-iron text-xs tracking-widest uppercase px-5 py-2.5 text-dust hover:bg-ash hover:text-bone transition-colors disabled:opacity-40">
                      {isPending ? "Saving..." : "Save"}
                    </button>
                    <button onClick={() => handleCancelEdit(item.id)} disabled={isPending}
                      className="border border-cinder text-xs tracking-widest uppercase px-5 py-2.5 text-mist hover:text-mist transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
