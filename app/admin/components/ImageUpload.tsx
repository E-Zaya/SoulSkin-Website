"use client";

import { useState, useRef } from "react";

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
  const [url,       setUrl]       = useState(currentUrl ?? "");
  const [preview,   setPreview]   = useState(currentUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleUrlInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setUrl(val);
    setPreview(val);
    onUrlChange(val);
    setError("");
    // テキスト手入力の場合は onUploadComplete を呼ばない
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

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Upload failed");
      }

      const { url: uploadedUrl } = await res.json();
      setUrl(uploadedUrl);
      setPreview(uploadedUrl);
      onUrlChange(uploadedUrl);
      onUploadComplete?.(uploadedUrl); // アップロード完了を親に通知
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      // 失敗したら元に戻す
      setPreview(currentUrl ?? "");
      setUrl(currentUrl ?? "");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-start">
        {/* プレビュー */}
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

        {/* 入力エリア */}
        <div className="flex-1 space-y-2 min-w-0">
          <input
            type="text"
            value={url}
            onChange={handleUrlInput}
            placeholder="/product.png  または  https://..."
            className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2 focus:outline-none focus:border-[#505050] font-mono placeholder:text-[#444]"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-[11px] tracking-widest uppercase font-mono border border-[#282828] px-3 py-1.5 text-[#aaa] hover:text-[#f0f0f0] hover:border-[#505050] transition-colors disabled:opacity-40 whitespace-nowrap"
            >
              {uploading ? "Uploading..." : "↑ Upload Image"}
            </button>
            <span className="text-[10px] text-[#555] font-mono">JPG / PNG / WEBP · Max 5MB</span>
          </div>
          {error && <p className="text-[11px] text-[#e05252] font-mono">{error}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
