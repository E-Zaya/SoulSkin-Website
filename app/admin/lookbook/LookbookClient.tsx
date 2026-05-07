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
        setError(e instanceof Error ? e.message : "並び替えに失敗しました");
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
          flash("追加しました");
          router.refresh();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
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
          flash("保存しました");
          router.refresh();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
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
        flash("削除しました");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "削除に失敗しました");
        setConfirmDeleteId(null);
      }
    });
  }

  // ── Render ───────────────────────────────────────────────────

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[13px] tracking-[0.25em] text-[#aaa] uppercase font-mono">Lookbook</h1>
        {!addingNew && (
          <button onClick={handleAddNew} disabled={isPending}
            className="text-[12px] tracking-widest uppercase font-mono border border-[#333] px-4 py-2 text-[#aaa] hover:text-[#f0f0f0] hover:border-[#555] transition-colors disabled:opacity-40">
            + Add Item
          </button>
        )}
      </div>

      <p className="text-[12px] text-[#777] font-mono mb-5">
        登録した全件がサイトに表示されます。▲▼ で順番を変更できます。
      </p>

      {error && (
        <div className="mb-4 border border-[#4a1a1a] bg-[#1a0f0f] px-4 py-3 text-[13px] text-[#f07070] font-mono">{error}</div>
      )}
      {success && (
        <div className="mb-4 border border-[#1a3d2a] bg-[#0d1a14] px-4 py-3 text-[13px] text-[#5dd49a] font-mono">{success}</div>
      )}

      {/* ── 新規追加フォーム ── */}
      {addingNew && (
        <div className="mb-4 border border-[#333] bg-[#111] p-5 space-y-4">
          <p className="text-[12px] tracking-[0.2em] text-[#aaa] uppercase font-mono">New Lookbook Item</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Item ID</label>
              <input type="text" value={newItem.item_id}
                onChange={(e) => setNewItem((f) => ({ ...f, item_id: e.target.value }))}
                placeholder="SS25 — 001"
                className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] font-mono placeholder:text-[#444]"
              />
            </div>
            <div>
              <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Order</label>
              <input type="number" value={newItem.order_index} min={0}
                onChange={(e) => setNewItem((f) => ({ ...f, order_index: Number(e.target.value) }))}
                className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] font-mono"
              />
            </div>
          </div>
          <div>
            <p className="text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Image</p>
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
              className="border border-[#444] text-[12px] font-mono tracking-widest uppercase px-5 py-2.5 text-[#ccc] hover:bg-[#1a1a1a] hover:text-[#f0f0f0] transition-colors disabled:opacity-40">
              {isPending ? "Adding..." : "Add Item"}
            </button>
            <button onClick={handleCancelNew} disabled={isPending}
              className="border border-[#222] text-[12px] font-mono tracking-widest uppercase px-5 py-2.5 text-[#777] hover:text-[#aaa] transition-colors">
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
              className={`border transition-colors ${isExpanded ? "border-[#333] bg-[#111]" : "border-[#222]"}`}
            >
              {/* 行ヘッダー */}
              <div className="px-4 py-3 flex items-center gap-3">
                {/* ↑↓ 並び替え */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button onClick={() => move(item.id, -1)} disabled={isPending || idx === 0}
                    className="text-[#666] hover:text-[#ccc] disabled:text-[#333] disabled:cursor-not-allowed transition-colors text-[14px] px-1 leading-none">
                    ▲
                  </button>
                  <button onClick={() => move(item.id, 1)} disabled={isPending || idx === items.length - 1}
                    className="text-[#666] hover:text-[#ccc] disabled:text-[#333] disabled:cursor-not-allowed transition-colors text-[14px] px-1 leading-none">
                    ▼
                  </button>
                </div>

                {/* サムネイル */}
                <div className="w-9 h-11 bg-[#141414] shrink-0 overflow-hidden border border-[#1e1e1e]">
                  {item.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.item_id} className="w-full h-full object-cover" />
                  )}
                </div>

                {/* ID + Live バッジ */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-[#f0f0f0] font-mono truncate">{item.item_id}</p>
                  {isLive && (
                    <span className="text-[10px] tracking-widest text-[#5dd49a] font-mono">● LIVE</span>
                  )}
                </div>

                {/* アクション */}
                {isDeleting ? (
                  <div className="flex items-center gap-3 shrink-0 flex-wrap">
                    <span className="text-[12px] text-[#f07070] font-mono">本当に削除しますか？</span>
                    <button onClick={() => handleDelete(item.id)} disabled={isPending}
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
                    <button onClick={() => isExpanded ? handleCancelEdit(item.id) : handleExpand(item)}
                      className="text-[12px] font-mono tracking-widest uppercase text-[#aaa] hover:text-[#f0f0f0] transition-colors">
                      {isExpanded ? "Close" : "Edit"}
                    </button>
                    <button onClick={() => setConfirmDeleteId(item.id)}
                      className="text-[12px] font-mono tracking-widest uppercase text-[#555] hover:text-[#f07070] transition-colors">
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* 展開編集フォーム */}
              {isExpanded && state && (
                <div className="border-t border-[#222] px-4 py-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Item ID</label>
                      <input type="text" value={state.item_id}
                        onChange={(e) => setEditStates((prev) => ({ ...prev, [item.id]: { ...prev[item.id], item_id: e.target.value } }))}
                        className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Order</label>
                      <input type="number" value={state.order_index} min={0}
                        onChange={(e) => setEditStates((prev) => ({ ...prev, [item.id]: { ...prev[item.id], order_index: Number(e.target.value) } }))}
                        className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Image</p>
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
                      className="border border-[#444] text-[12px] font-mono tracking-widest uppercase px-5 py-2.5 text-[#ccc] hover:bg-[#1a1a1a] hover:text-[#f0f0f0] transition-colors disabled:opacity-40">
                      {isPending ? "Saving..." : "Save"}
                    </button>
                    <button onClick={() => handleCancelEdit(item.id)} disabled={isPending}
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
    </div>
  );
}
