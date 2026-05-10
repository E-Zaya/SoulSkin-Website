"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "../components/ImageUpload";
import {
  saveDropAction,
  createDropAction,
  setDropActiveAction,
  deleteDropAction,
  reorderDropsAction,
  saveDropImageAction,
  deleteDropImageAction,
  deleteStorageImageAction,
} from "../actions";
import { MAX_ACTIVE_DROPS, type DropWithImages, type DropImage } from "@/lib/db";

type Props = { initialDrops: DropWithImages[] };

const EMPTY: Omit<DropWithImages, "id" | "created_at" | "images"> = {
  label: "",
  title_line1: "",
  title_line2: "",
  description: "",
  pieces_left: 0,
  cta: "",
  image_url: null,
  active: false,
  order_index: 0,
};

// ─── サブ画像管理 ──────────────────────────────────────────────

function DropImagesEditor({
  dropId,
  images,
  onImagesChange,
}: {
  dropId: string;
  images: DropImage[];
  onImagesChange: (imgs: DropImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();
  const [pendingNew, setPendingNew] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState("");

  function handleAdd(url: string) {
    if (!url) return;
    const nextOrder = images.length;
    setUploading(true);
    startTransition(async () => {
      try {
        const result = await saveDropImageAction({
          drop_id: dropId,
          image_url: url,
          order_index: nextOrder,
        });
        if (result) onImagesChange([...images, result as DropImage]);
        setPendingNew(null);
      } finally {
        setUploading(false);
      }
    });
  }

  function handleRemove(img: DropImage) {
    startTransition(async () => {
      await deleteDropImageAction(img.id, img.image_url);
      const next = images
        .filter((i) => i.id !== img.id)
        .map((i, idx) => ({ ...i, order_index: idx }));
      onImagesChange(next);
      // 並び順も保存
      await Promise.all(
        next.map((i) =>
          saveDropImageAction({
            id: i.id,
            drop_id: dropId,
            image_url: i.image_url,
            order_index: i.order_index,
          })
        )
      );
    });
  }

  function handleMove(img: DropImage, dir: -1 | 1) {
    const idx = images.findIndex((i) => i.id === img.id);
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[idx], next[target]] = [next[target], next[idx]];
    const reordered = next.map((i, n) => ({ ...i, order_index: n }));
    onImagesChange(reordered);
    startTransition(async () => {
      await Promise.all(
        reordered.map((i) =>
          saveDropImageAction({
            id: i.id,
            drop_id: dropId,
            image_url: i.image_url,
            order_index: i.order_index,
          })
        )
      );
    });
  }

  return (
    <div>
      <p className="text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-3">
        Detail Images
        <span className="text-[#555] ml-2 normal-case tracking-normal">
          ({images.length}) — shown in the drop detail page gallery
        </span>
      </p>

      {/* 既存画像リスト */}
      {images.length > 0 && (
        <div className="space-y-2 mb-3">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="flex items-center gap-2 border border-[#1e1e1e] px-3 py-2 bg-[#0a0a0a]"
            >
              <div className="w-8 h-10 shrink-0 overflow-hidden bg-[#141414]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-mono text-[11px] text-[#555] w-4 shrink-0">
                {i + 1}
              </span>
              <span className="font-mono text-[11px] text-[#888] flex-1 truncate">
                {img.image_url.split("/").pop()}
              </span>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => handleMove(img, -1)}
                  disabled={i === 0}
                  className="text-[#555] hover:text-[#ccc] disabled:text-[#2a2a2a] transition-colors text-[11px] px-1"
                >
                  ▲
                </button>
                <button
                  onClick={() => handleMove(img, 1)}
                  disabled={i === images.length - 1}
                  className="text-[#555] hover:text-[#ccc] disabled:text-[#2a2a2a] transition-colors text-[11px] px-1"
                >
                  ▼
                </button>
              </div>
              <button
                onClick={() => handleRemove(img)}
                className="font-mono text-[11px] text-[#555] hover:text-[#f07070] transition-colors shrink-0 ml-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 新規追加 */}
      <div className="border border-dashed border-[#282828] p-3 bg-[#090909]">
        <p className="font-mono text-[11px] text-[#555] mb-2">Add image</p>
        <ImageUpload
          currentUrl={null}
          onUrlChange={setNewUrl}
          onUploadComplete={(url) => {
            if (pendingNew && pendingNew !== url) {
              deleteStorageImageAction(pendingNew).catch(console.error);
            }
            setPendingNew(url);
            handleAdd(url);
            setNewUrl("");
            setPendingNew(null);
          }}
          folder="drops"
        />
        {newUrl && !pendingNew && (
          <button
            onClick={() => {
              handleAdd(newUrl);
              setNewUrl("");
            }}
            disabled={uploading}
            className="mt-2 font-mono text-[11px] tracking-widest uppercase border border-[#333] px-3 py-1.5 text-[#aaa] hover:text-[#f0f0f0] hover:border-[#555] transition-colors disabled:opacity-40"
          >
            {uploading ? "Adding..." : "+ Add"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── メイン ────────────────────────────────────────────────────

export default function DropClient({ initialDrops }: Props) {
  const router = useRouter();
  const [drops, setDrops] = useState<DropWithImages[]>(initialDrops);
  const [selectedId, setSelectedId] = useState<string | null>(
    drops.find((d) => d.active)?.id ?? drops[0]?.id ?? null
  );

  const selected = drops.find((d) => d.id === selectedId) ?? null;

  // フォームフィールド (ガラス画像と分けて管理)
  const [form, setForm] = useState<typeof EMPTY>(selected ?? EMPTY);
  const [imageUrl, setImageUrl] = useState(selected?.image_url ?? "");

  // アップロード済み・未保存の画像URL（キャンセル時に削除する）
  const [pendingUpload, setPendingUpload] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const activeCount = drops.filter((d) => d.active).length;
  const atLimit = activeCount >= MAX_ACTIVE_DROPS;

  function flash(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  function selectDrop(drop: DropWithImages) {
    if (pendingUpload) {
      deleteStorageImageAction(pendingUpload).catch(console.error);
      setPendingUpload(null);
    }
    setSelectedId(drop.id);
    setForm({
      label: drop.label,
      title_line1: drop.title_line1,
      title_line2: drop.title_line2,
      description: drop.description,
      pieces_left: drop.pieces_left,
      cta: drop.cta,
      image_url: drop.image_url,
      active: drop.active,
      order_index: drop.order_index,
    });
    setImageUrl(drop.image_url ?? "");
    setError("");
    setSuccess("");
  }

  function field(key: string, value: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateDropImagesInState(dropId: string, imgs: DropImage[]) {
    setDrops((prev) =>
      prev.map((d) => (d.id === dropId ? { ...d, images: imgs } : d))
    );
  }

  function handleSave() {
    setError("");

    // クライアント側で先に上限チェック (UX 向上)
    if (form.active) {
      const currentlyActive =
        selected?.active ?? false;
      if (!currentlyActive && atLimit) {
        setError(
          `Maximum of ${MAX_ACTIVE_DROPS} active drops reached. Deactivate one first.`
        );
        return;
      }
    }

    startTransition(async () => {
      try {
        const result = await saveDropAction({
          ...(selectedId ? { id: selectedId } : {}),
          label: form.label,
          title_line1: form.title_line1,
          title_line2: form.title_line2,
          description: form.description,
          pieces_left: Number(form.pieces_left),
          cta: form.cta,
          image_url: imageUrl || null,
          active: form.active,
          order_index: Number(form.order_index),
        });
        if (result) {
          const original = selected?.image_url ?? null;
          if (original && original !== result.image_url) {
            deleteStorageImageAction(original).catch(console.error);
          }
          setDrops((prev) => {
            const existing = prev.find((d) => d.id === result.id);
            if (existing) {
              return prev.map((d) =>
                d.id === result.id
                  ? { ...result, images: existing.images }
                  : d
              );
            }
            return [...prev, { ...result, images: [] }];
          });
          setSelectedId(result.id);
          setForm({
            label: result.label,
            title_line1: result.title_line1,
            title_line2: result.title_line2,
            description: result.description,
            pieces_left: result.pieces_left,
            cta: result.cta,
            image_url: result.image_url,
            active: result.active,
            order_index: result.order_index,
          });
          setPendingUpload(null);
        }
        flash("Saved");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save");
      }
    });
  }

  function handleToggleActive(drop: DropWithImages) {
    setError("");
    // クライアント側上限チェック
    if (!drop.active && atLimit) {
      setError(
        `Maximum of ${MAX_ACTIVE_DROPS} active drops reached. Deactivate one first.`
      );
      return;
    }
    const nextActive = !drop.active;
    startTransition(async () => {
      try {
        await setDropActiveAction(drop.id, nextActive);
        setDrops((prev) =>
          prev.map((d) => (d.id === drop.id ? { ...d, active: nextActive } : d))
        );
        if (selectedId === drop.id) {
          setForm((f) => ({ ...f, active: nextActive }));
        }
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
      }
    });
  }

  function handleNew() {
    if (drops.length >= 50) {
      setError("Too many drops — clean up archive first.");
      return;
    }
    startTransition(async () => {
      try {
        const result = await createDropAction();
        if (result) {
          const fresh: DropWithImages = { ...result, images: [] };
          setDrops((prev) => [...prev, fresh]);
          selectDrop(fresh);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
      }
    });
  }

  function handleDelete(drop: DropWithImages) {
    if (
      !confirm(
        `Delete "${drop.title_line1} ${drop.title_line2}"?\nThis action cannot be undone.`
      )
    )
      return;
    startTransition(async () => {
      try {
        await deleteDropAction(drop.id, drop.image_url);
        const next = drops.filter((d) => d.id !== drop.id);
        setDrops(next);
        if (selectedId === drop.id) {
          const nextDrop = next[0] ?? null;
          if (nextDrop) {
            selectDrop(nextDrop);
          } else {
            setSelectedId(null);
            setForm({ ...EMPTY });
            setImageUrl("");
          }
        }
        flash("Deleted");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete");
      }
    });
  }

  function handleReorder(dropId: string, dir: -1 | 1) {
    const idx = drops.findIndex((d) => d.id === dropId);
    const target = idx + dir;
    if (target < 0 || target >= drops.length) return;
    const next = [...drops];
    [next[idx], next[target]] = [next[target], next[idx]];
    const reordered = next.map((d, i) => ({ ...d, order_index: i }));
    setDrops(reordered);
    startTransition(async () => {
      try {
        await reorderDropsAction(
          reordered.map((d) => ({ id: d.id, order_index: d.order_index }))
        );
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to reorder");
      }
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-[13px] tracking-[0.25em] text-[#aaa] uppercase font-mono">
            Drop Manager
          </h1>
          <span
            className={`text-[10px] tracking-widest font-mono px-2 py-1 border ${
              atLimit
                ? "text-[#f0a070] border-[#4a3018] bg-[#1a1208]"
                : "text-[#5dd49a] border-[#1a3d2a] bg-[#0d1a14]"
            }`}
          >
            {activeCount}/{MAX_ACTIVE_DROPS} LIVE
          </span>
        </div>
        <button
          onClick={handleNew}
          disabled={isPending}
          className="text-[12px] tracking-widest uppercase font-mono border border-[#333] px-4 py-2 text-[#aaa] hover:text-[#f0f0f0] hover:border-[#555] transition-colors disabled:opacity-40"
        >
          {isPending ? "..." : "+ New Drop"}
        </button>
      </div>

      {error && (
        <div className="mb-5 border border-[#4a1a1a] bg-[#1a0f0f] px-4 py-3 text-[13px] text-[#f07070] font-mono">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 border border-[#1a3d2a] bg-[#0d1a14] px-4 py-3 text-[13px] text-[#5dd49a] font-mono">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Drop リスト */}
        <div className="md:col-span-1 space-y-2">
          <p className="text-[12px] tracking-[0.2em] text-[#888] uppercase font-mono mb-3">
            All Drops
          </p>
          {drops.length === 0 && (
            <p className="text-[13px] text-[#666] font-mono py-4">
              No drops yet — add one to start.
            </p>
          )}
          {drops.map((drop, idx) => {
            const isSelected = selectedId === drop.id;
            return (
              <div
                key={drop.id}
                className={`border transition-colors ${
                  isSelected
                    ? "border-[#444] bg-[#151515]"
                    : "border-[#1e1e1e] hover:border-[#2e2e2e]"
                } ${!drop.active ? "opacity-90" : ""}`}
              >
                <div className="px-3 py-3">
                  {/* 行: 並び替え + サムネ + タイトル + LIVEバッジ */}
                  <div className="flex items-center gap-2.5 mb-2">
                    {/* ↑↓ */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        onClick={() => handleReorder(drop.id, -1)}
                        disabled={isPending || idx === 0}
                        className="text-[#666] hover:text-[#ccc] disabled:text-[#333] disabled:cursor-not-allowed transition-colors leading-none text-[12px] px-0.5"
                        title="Move up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleReorder(drop.id, 1)}
                        disabled={isPending || idx === drops.length - 1}
                        className="text-[#666] hover:text-[#ccc] disabled:text-[#333] disabled:cursor-not-allowed transition-colors leading-none text-[12px] px-0.5"
                        title="Move down"
                      >
                        ▼
                      </button>
                    </div>

                    {/* サムネ (1枚目: メイン or 詳細1) */}
                    <button
                      onClick={() => selectDrop(drop)}
                      className="w-9 h-11 bg-[#141414] shrink-0 overflow-hidden border border-[#1e1e1e] relative"
                    >
                      {(drop.image_url || drop.images?.[0]?.image_url) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={drop.image_url ?? drop.images[0].image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                      {drop.images && drop.images.length > 0 && (
                        <div className="absolute bottom-0.5 right-0.5 bg-void/80 px-0.5 rounded-sm">
                          <span className="font-mono text-[8px] text-bone/70">
                            +{drop.images.length}
                          </span>
                        </div>
                      )}
                    </button>

                    {/* タイトル */}
                    <button
                      onClick={() => selectDrop(drop)}
                      className="flex-1 text-left min-w-0"
                    >
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[13px] font-mono text-[#e8e8e8] truncate">
                          {drop.title_line1 || "(untitled)"}{" "}
                          {drop.title_line2}
                        </span>
                        {drop.active && (
                          <span className="text-[9px] tracking-widest text-[#5dd49a] border border-[#1a3d2a] px-1.5 py-0.5 font-mono shrink-0">
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#777] font-mono">
                        {drop.pieces_left} left
                      </p>
                    </button>
                  </div>

                  {/* アクション */}
                  <div className="flex items-center gap-3 pl-12">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(drop);
                      }}
                      disabled={isPending || (!drop.active && atLimit)}
                      title={
                        !drop.active && atLimit
                          ? `${MAX_ACTIVE_DROPS} drops are already live`
                          : undefined
                      }
                      className={`text-[11px] tracking-widest uppercase font-mono transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                        drop.active
                          ? "text-[#5dd49a] hover:text-[#7be4b1]"
                          : "text-[#666] hover:text-[#5dd49a]"
                      }`}
                    >
                      {drop.active ? "● Live" : "○ Set Live"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(drop);
                      }}
                      disabled={isPending}
                      className="text-[11px] tracking-widest uppercase font-mono text-[#666] hover:text-[#f07070] transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 編集フォーム */}
        <div className="md:col-span-2">
          {!selected ? (
            <p className="text-[13px] text-[#666] font-mono py-10 text-center">
              Select a drop on the left or create a new one.
            </p>
          ) : (
            <>
              <p className="text-[12px] tracking-[0.2em] text-[#888] uppercase font-mono mb-4">
                Edit
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <F
                    label="Title Line 1"
                    value={form.title_line1}
                    onChange={(v) => field("title_line1", v)}
                  />
                  <F
                    label="Title Line 2"
                    value={form.title_line2}
                    onChange={(v) => field("title_line2", v)}
                  />
                </div>

                <F
                  label="Label"
                  value={form.label}
                  onChange={(v) => field("label", v)}
                />

                <div>
                  <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => field("description", e.target.value)}
                    rows={3}
                    className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] resize-none font-mono leading-relaxed placeholder:text-[#444]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">
                      Pieces Left
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          field(
                            "pieces_left",
                            Math.max(0, Number(form.pieces_left) - 1)
                          )
                        }
                        className="w-9 h-9 border border-[#282828] text-[#aaa] hover:text-white hover:border-[#505050] transition-colors font-mono flex items-center justify-center text-lg"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={form.pieces_left}
                        onChange={(e) =>
                          field("pieces_left", Number(e.target.value))
                        }
                        min={0}
                        className="flex-1 bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[14px] px-3 py-2 focus:outline-none focus:border-[#505050] font-mono text-center"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          field("pieces_left", Number(form.pieces_left) + 1)
                        }
                        className="w-9 h-9 border border-[#282828] text-[#aaa] hover:text-white hover:border-[#505050] transition-colors font-mono flex items-center justify-center text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <F
                    label="CTA Text"
                    value={form.cta}
                    onChange={(v) => field("cta", v)}
                  />
                </div>

                <div>
                  <p className="text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">
                    Main Image
                    <span className="text-[#555] ml-2 normal-case tracking-normal">
                      (used as the cover & first gallery image)
                    </span>
                  </p>
                  <ImageUpload
                    currentUrl={imageUrl || null}
                    onUrlChange={setImageUrl}
                    onUploadComplete={(url) => {
                      if (pendingUpload && pendingUpload !== url) {
                        deleteStorageImageAction(pendingUpload).catch(
                          console.error
                        );
                      }
                      setPendingUpload(url);
                    }}
                    folder="drops"
                  />
                </div>

                {/* 詳細サブ画像 */}
                <div className="border-t border-[#1a1a1a] pt-5">
                  <DropImagesEditor
                    dropId={selected.id}
                    images={selected.images ?? []}
                    onImagesChange={(imgs) =>
                      updateDropImagesInState(selected.id, imgs)
                    }
                  />
                </div>

                <label
                  className={`flex items-center gap-3 ${
                    !form.active && atLimit && !selected.active
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.active}
                    disabled={!form.active && atLimit && !selected.active}
                    onChange={(e) => field("active", e.target.checked)}
                    className="w-4 h-4 accent-white"
                  />
                  <span className="text-[13px] font-mono text-[#aaa]">
                    Set as Active (Live) Drop
                    {!form.active && atLimit && !selected.active && (
                      <span className="text-[11px] text-[#f0a070] ml-2">
                        — limit reached ({MAX_ACTIVE_DROPS}/{MAX_ACTIVE_DROPS})
                      </span>
                    )}
                  </span>
                </label>

                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="w-full border border-[#444] text-[13px] font-mono tracking-widest uppercase py-3 text-[#ccc] hover:bg-[#1a1a1a] hover:text-[#f0f0f0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isPending ? "Saving..." : "Save Drop"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function F({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] font-mono"
      />
    </div>
  );
}
