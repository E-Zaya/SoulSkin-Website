"use client";

import { useRef, useState } from "react";
import { isManagedImageUrl } from "@/lib/images";

type Props = {
  currentUrl?: string | null;
  /** URL が変わるたびに発火（テキスト入力・アップロード両方） */
  onUrlChange: (url: string) => void;
  /** ファイルアップロード成功時のみ発火（テキスト入力では発火しない） */
  onUploadComplete?: (uploadedUrl: string) => void;
  folder?: string;
};

export default function ImageUpload({
  currentUrl,
  onUrlChange,
  onUploadComplete,
  folder = "misc",
}: Props) {
  const [url, setUrl] = useState(currentUrl ?? "");
  const [preview, setPreview] = useState(currentUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 親側で別レコードを選択した時、古い画像プレビューが残らないよう同期する
  // （effect ではなく render 中に prop の変化を検知して state を合わせる）
  const [syncedUrl, setSyncedUrl] = useState(currentUrl);
  if (currentUrl !== syncedUrl) {
    setSyncedUrl(currentUrl);
    setUrl(currentUrl ?? "");
    setPreview(currentUrl ?? "");
    setError("");
  }

  function handleUrlInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.trim();
    setUrl(val);
    setPreview(val);

    if (!isManagedImageUrl(val)) {
      setError("Use only a /public path or a Supabase Storage URL");
      return;
    }

    onUrlChange(val);
    setError("");
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setError("");
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Upload failed");
      }

      setUrl(data.url);
      setPreview(data.url);
      onUrlChange(data.url);
      onUploadComplete?.(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(currentUrl ?? "");
      setUrl(currentUrl ?? "");
    } finally {
      URL.revokeObjectURL(localUrl);
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-start">
        {/* Preview */}
        <div className="w-16 h-20 bg-void border border-cinder shrink-0 overflow-hidden relative">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-mist text-xs">No img</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-void/70 flex items-center justify-center">
              <span className="text-xs text-bone">...</span>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex-1 space-y-2 min-w-0">
          <input
            type="text"
            value={url}
            onChange={handleUrlInput}
            placeholder="/product.png or Supabase Storage URL"
            className="w-full bg-void border border-cinder text-bone text-sm px-3 py-2 focus:border-iron placeholder:text-mist"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-xs tracking-widest uppercase border border-cinder px-3 py-1.5 text-mist hover:text-bone hover:border-iron transition-colors disabled:opacity-40 whitespace-nowrap"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
            <span className="text-xs text-mist">JPG / PNG / WEBP · Max 5MB</span>
          </div>
          {error && <p className="text-xs text-error">{error}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
