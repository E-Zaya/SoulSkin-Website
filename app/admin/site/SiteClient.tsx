"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "../components/ImageUpload";
import { saveSiteSettingsAction, deleteStorageImageAction } from "../actions";
import type { SiteSettings } from "@/lib/db";

type Props = {
  initialSettings: SiteSettings | null;
};

const DEFAULTS = {
  hero_image_url: "/hero.png",
  about_image_url: "/about.png",
  about_description:
    "Soul Skin is a streetwear label from Ulaanbaatar, Mongolia. Built for those who carry their identity on their back.",
};

export default function SiteClient({ initialSettings }: Props) {
  const router = useRouter();

  const [heroUrl, setHeroUrl] = useState(
    initialSettings?.hero_image_url ?? DEFAULTS.hero_image_url
  );
  const [aboutUrl, setAboutUrl] = useState(
    initialSettings?.about_image_url ?? DEFAULTS.about_image_url
  );
  const [aboutDesc, setAboutDesc] = useState(
    initialSettings?.about_description ?? DEFAULTS.about_description
  );

  // アップロード済み・未保存の画像URL（キャンセル時に削除するため）
  const [pendingHero, setPendingHero] = useState<string | null>(null);
  const [pendingAbout, setPendingAbout] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  function flash(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  function handleSave() {
    setError("");
    startTransition(async () => {
      try {
        await saveSiteSettingsAction({
          hero_image_url: heroUrl || null,
          about_image_url: aboutUrl || null,
          about_description: aboutDesc,
        });

        // 古い画像が差し替えられていたら Storage から削除
        const prevHero = initialSettings?.hero_image_url ?? null;
        if (pendingHero && prevHero && prevHero !== heroUrl) {
          deleteStorageImageAction(prevHero).catch(console.error);
        }
        const prevAbout = initialSettings?.about_image_url ?? null;
        if (pendingAbout && prevAbout && prevAbout !== aboutUrl) {
          deleteStorageImageAction(prevAbout).catch(console.error);
        }

        setPendingHero(null);
        setPendingAbout(null);
        flash("保存しました");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "保存に失敗しました");
      }
    });
  }

  return (
    <div>
      {/* Header */}
      <h1 className="text-[13px] tracking-[0.25em] text-[#aaa] uppercase font-mono mb-8">
        Site 設定
      </h1>

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

      <div className="space-y-8 max-w-2xl">

        {/* Hero 画像 */}
        <section>
          <p className="text-[12px] tracking-[0.2em] text-[#888] uppercase font-mono mb-1">
            Hero
          </p>
          <p className="text-[12px] text-[#555] font-mono mb-4">
            トップページの全画面背景画像
          </p>
          <ImageUpload
            currentUrl={heroUrl || null}
            onUrlChange={setHeroUrl}
            onUploadComplete={(url) => {
              if (pendingHero && pendingHero !== url) {
                deleteStorageImageAction(pendingHero).catch(console.error);
              }
              setPendingHero(url);
            }}
            folder="site"
          />
        </section>

        <div className="border-t border-[#1a1a1a]" />

        {/* About 画像 */}
        <section>
          <p className="text-[12px] tracking-[0.2em] text-[#888] uppercase font-mono mb-1">
            About — 画像
          </p>
          <p className="text-[12px] text-[#555] font-mono mb-4">
            About セクションの右カラムに表示される画像
          </p>
          <ImageUpload
            currentUrl={aboutUrl || null}
            onUrlChange={setAboutUrl}
            onUploadComplete={(url) => {
              if (pendingAbout && pendingAbout !== url) {
                deleteStorageImageAction(pendingAbout).catch(console.error);
              }
              setPendingAbout(url);
            }}
            folder="site"
          />
        </section>

        <div className="border-t border-[#1a1a1a]" />

        {/* About テキスト */}
        <section>
          <p className="text-[12px] tracking-[0.2em] text-[#888] uppercase font-mono mb-1">
            About — テキスト
          </p>
          <p className="text-[12px] text-[#555] font-mono mb-4">
            About セクションに表示される紹介文
          </p>
          <textarea
            value={aboutDesc}
            onChange={(e) => setAboutDesc(e.target.value)}
            rows={4}
            className="w-full bg-[#0d0d0d] border border-[#282828] text-[#f0f0f0] text-[13px] px-3 py-2.5 focus:outline-none focus:border-[#505050] resize-none font-mono leading-relaxed placeholder:text-[#444]"
            placeholder="About テキストを入力..."
          />
        </section>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isPending}
          className="w-full border border-[#444] text-[13px] font-mono tracking-widest uppercase py-3 text-[#ccc] hover:bg-[#1a1a1a] hover:text-[#f0f0f0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
