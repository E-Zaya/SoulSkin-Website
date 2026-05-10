"use client";

import { useEffect, useRef, useState } from "react";
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
  useEffect(() => {
    setUrl(currentUrl ?? "");
    setPreview(currentUrl ?? "");
    setError("");
  }, [currentUrl]);

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
        <div className="w-16 h-20 bg-[#0d0d0d] border border-[#282828] shrink-0 overflow-hidden relative">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[#555] text-[10px] font-mono">No img</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-[10px] text-white font-mono">...</span>
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
            className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2 focus:outline-none focus:border-[#505050] font-mono placeholder:text-[#444]"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-[11px] tracking-widest uppercase font-mono border border-[#282828] px-3 py-1.5 text-[#aaa] hover:text-[#f0f0f0] hover:border-[#505050] transition-colors disabled:opacity-40 whitespace-nowrap"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
            <span className="text-[10px] text-[#555] font-mono">JPG / PNG / WEBP · Max 5MB</span>
          </div>
          {error && <p className="text-[11px] text-[#e05252] font-mono">{error}</p>}
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
