"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "../components/ImageUpload";
import {
  saveDropAction,
  createDropAction,
  activateDropAction,
  deleteDropAction,
  deleteStorageImageAction,
} from "../actions";
import type { Drop } from "@/lib/db";

type Props = { initialDrops: Drop[] };

const EMPTY: Omit<Drop, "id" | "created_at"> = {
  label: "", title_line1: "", title_line2: "",
  description: "", pieces_left: 0, cta: "",
  image_url: null, active: false,
};

export default function DropClient({ initialDrops }: Props) {
  const router = useRouter();
  const [drops, setDrops]     = useState<Drop[]>(initialDrops);
  const [selectedId, setSelectedId] = useState<string | null>(
    drops.find((d) => d.active)?.id ?? drops[0]?.id ?? null
  );

  const selected = drops.find((d) => d.id === selectedId) ?? null;

  // フォームフィールド
  const [form,     setForm]     = useState<typeof EMPTY>(selected ?? EMPTY);
  const [imageUrl, setImageUrl] = useState(selected?.image_url ?? "");

  // アップロード済み・未保存の画像URL（キャンセル時に削除する）
  const [pendingUpload, setPendingUpload] = useState<string | null>(null);

  const [error,  setError]  = useState("");
  const [success,setSuccess]= useState("");
  const [isPending, startTransition] = useTransition();

  function flash(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  function selectDrop(drop: Drop) {
    // 選択を切り替える前に未保存のアップロード画像を削除
    if (pendingUpload) {
      deleteStorageImageAction(pendingUpload).catch(console.error);
      setPendingUpload(null);
    }
    setSelectedId(drop.id);
    setForm({ ...drop });
    setImageUrl(drop.image_url ?? "");
    setError("");
    setSuccess("");
  }

  function field(key: string, value: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    setError("");
    startTransition(async () => {
      try {
        const result = await saveDropAction({
          ...(selectedId ? { id: selectedId } : {}),
          label:       form.label,
          title_line1: form.title_line1,
          title_line2: form.title_line2,
          description: form.description,
          pieces_left: Number(form.pieces_left),
          cta:         form.cta,
          image_url:   imageUrl || null,
          active:      form.active,
        });
        if (result) {
          const original = selected?.image_url ?? null;
          if (original && original !== result.image_url) {
            deleteStorageImageAction(original).catch(console.error);
          }
          setDrops((prev) => {
            const next = prev.some((d) => d.id === result.id)
              ? prev.map((d) => (d.id === result.id ? result : d))
              : [...prev, result];

            return result.active
              ? next.map((d) => ({ ...d, active: d.id === result.id }))
              : next;
          });
          setSelectedId(result.id);
          setForm({ ...result });
          setPendingUpload(null); // 保存完了 → ゴミ扱い解除
        }
        flash("Saved");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save");
      }
    });
  }

  function handleActivate(id: string) {
    startTransition(async () => {
      try {
        await activateDropAction(id);
        setDrops((prev) => prev.map((d) => ({ ...d, active: d.id === id })));
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
      }
    });
  }

  function handleNew() {
    startTransition(async () => {
      try {
        const result = await createDropAction();
        if (result) {
          setDrops((prev) => [...prev, result]);
          selectDrop(result);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
      }
    });
  }

  function handleDelete(drop: Drop) {
    if (!confirm(`Delete "${drop.title_line1} ${drop.title_line2}"?\nThis action cannot be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteDropAction(drop.id, drop.image_url);
        const next = drops.filter((d) => d.id !== drop.id);
        setDrops(next);
        // 削除したDropが選択中だった場合、次のDropを選択
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[13px] tracking-[0.25em] text-[#aaa] uppercase font-mono">Drop Manager</h1>
        <button onClick={handleNew} disabled={isPending}
          className="text-[12px] tracking-widest uppercase font-mono border border-[#333] px-4 py-2 text-[#aaa] hover:text-[#f0f0f0] hover:border-[#555] transition-colors disabled:opacity-40">
          {isPending ? "..." : "+ New Drop"}
        </button>
      </div>

      {error && (
        <div className="mb-5 border border-[#4a1a1a] bg-[#1a0f0f] px-4 py-3 text-[13px] text-[#f07070] font-mono">{error}</div>
      )}
      {success && (
        <div className="mb-5 border border-[#1a3d2a] bg-[#0d1a14] px-4 py-3 text-[13px] text-[#5dd49a] font-mono">{success}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Drop リスト */}
        <div className="md:col-span-1 space-y-2">
          <p className="text-[12px] tracking-[0.2em] text-[#888] uppercase font-mono mb-3">All Drops</p>
          {drops.map((drop) => (
            <button key={drop.id} onClick={() => selectDrop(drop)}
              className={`w-full text-left border px-4 py-3 transition-colors ${
                selectedId === drop.id
                  ? "border-[#444] bg-[#151515]"
                  : "border-[#1e1e1e] hover:border-[#2e2e2e]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-mono text-[#e8e8e8]">
                  {drop.title_line1} {drop.title_line2}
                </span>
                {drop.active && (
                  <span className="text-[9px] tracking-widest text-[#5dd49a] border border-[#1a3d2a] px-2 py-0.5 font-mono">
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[#777] font-mono">{drop.pieces_left} left</p>
              {!drop.active && (
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleActivate(drop.id); }}
                    disabled={isPending}
                    className="text-[11px] tracking-widest uppercase font-mono text-[#666] hover:text-[#5dd49a] transition-colors"
                  >
                    Set Live
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(drop); }}
                    disabled={isPending}
                    className="text-[11px] tracking-widest uppercase font-mono text-[#666] hover:text-[#f07070] transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* 編集フォーム */}
        <div className="md:col-span-2">
          <p className="text-[12px] tracking-[0.2em] text-[#888] uppercase font-mono mb-4">Edit</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <F label="Title Line 1" value={form.title_line1} onChange={(v) => field("title_line1", v)} />
              <F label="Title Line 2" value={form.title_line2} onChange={(v) => field("title_line2", v)} />
            </div>

            <F label="Label" value={form.label} onChange={(v) => field("label", v)} />

            <div>
              <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Description</label>
              <textarea value={form.description} onChange={(e) => field("description", e.target.value)}
                rows={3}
                className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] resize-none font-mono leading-relaxed placeholder:text-[#444]"
              />
            </div>

            {/* Pieces Left ±ボタン付き */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">
                  Pieces Left
                </label>
                <div className="flex items-center gap-2">
                  <button type="button"
                    onClick={() => field("pieces_left", Math.max(0, Number(form.pieces_left) - 1))}
                    className="w-9 h-9 border border-[#282828] text-[#aaa] hover:text-white hover:border-[#505050] transition-colors font-mono flex items-center justify-center text-lg">
                    −
                  </button>
                  <input type="number" value={form.pieces_left}
                    onChange={(e) => field("pieces_left", Number(e.target.value))} min={0}
                    className="flex-1 bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[14px] px-3 py-2 focus:outline-none focus:border-[#505050] font-mono text-center"
                  />
                  <button type="button"
                    onClick={() => field("pieces_left", Number(form.pieces_left) + 1)}
                    className="w-9 h-9 border border-[#282828] text-[#aaa] hover:text-white hover:border-[#505050] transition-colors font-mono flex items-center justify-center text-lg">
                    +
                  </button>
                </div>
              </div>
              <F label="CTA Text" value={form.cta} onChange={(v) => field("cta", v)} />
            </div>

            <div>
              <p className="text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">Drop Image</p>
              <ImageUpload
                currentUrl={imageUrl || null}
                onUrlChange={setImageUrl}
                onUploadComplete={(url) => {
                  if (pendingUpload && pendingUpload !== url) {
                    deleteStorageImageAction(pendingUpload).catch(console.error);
                  }
                  setPendingUpload(url);
                }}
                folder="drops"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.active}
                onChange={(e) => field("active", e.target.checked)}
                className="w-4 h-4 accent-white" />
              <span className="text-[13px] font-mono text-[#aaa]">Set as Active (Live) Drop</span>
            </label>

            <button onClick={handleSave} disabled={isPending}
              className="w-full border border-[#444] text-[13px] font-mono tracking-widest uppercase py-3 text-[#ccc] hover:bg-[#1a1a1a] hover:text-[#f0f0f0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {isPending ? "Saving..." : "Save Drop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function F({ label, value, onChange }: { label: string; value: string | number; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[12px] tracking-[0.15em] text-[#999] uppercase font-mono mb-2">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] font-mono" />
    </div>
  );
}
