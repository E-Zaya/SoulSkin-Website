# Soul Skin — Wear Your Soul

> A brand experience website for **Soul Skin**, an independent streetwear label from Ulaanbaatar, Mongolia.

![Soul Skin Brand Lookbook](https://soul-skin-website.vercel.app/_next/image?url=https%3A%2F%2Fwtxgqkotckxcqzjhnfle.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fsoul-skin-images%2Fsite%2F1778424909734-bcc9355c-f124-452d-a831-e22d99d1fd0c.png&w=3840&q=75)

**[Live Site](https://soul-skin-website.vercel.app/)** | **[Instagram @yoursoulskin](https://www.instagram.com/yoursoulskin)**

---

## Overview

Soul Skin は Instagram DM だけで展開してきたストリートウェアレーベルです。このサイトは商品を「売る」ためではなく、**ウランバートルの街と草原の空気を写真と余白で見せ、訪問者をブランドの世界に入らせる**ために作りました。

- Instagram だけでは伝わらないブランドの全体像を 1 か所に
- 限定ドロップ、Lookbook、ピース、カスタムオーダーの窓口を一元管理
- スマートフォンでも写真の迫力を落とさない

---

## Design: UB RAW PRECISION

草原の静けさとウランバートルの夜の緊張感を、1px の罫線で組んだエディトリアル・グリッドにのせています。装飾ではなく、写真・余白・実際の情報だけで高級感を作る方針です。

### 色

- **Void** `#0a0908` — 背景
- **Bone** `#ede8e1` — 文字、反転面
- **Mist** `#9b9892` — 補助文字（本文コントラスト 7.5:1）
- **Ember** `#174cff` — 唯一のアクセント。現在地・リンク・選択状態だけ
- **Rust** `#c54b37` — 状態表示だけ（LIVE / REC / Open）

### 文字

- 書体は 2 つだけ。**Bebas Neue**（見出し）と **Inter**（本文・ラベル）
- サイズは 7 段に固定（12 / 14 / 16 / 20 / 28 / 36–56 / 48–96 px）。12px 未満は使わない
- トークンはすべて `app/globals.css` の `@theme` に集約。コンポーネント側に任意値（`text-[13px]` や生の hex）は書かない

### 動き

- Hero は 5 コマの写真を 2 秒ごとに切り替える「フィルム」。Pause / Play ボタンと `prefers-reduced-motion` で止められる
- スクロール連動の表示は Home の Manifesto 1 か所だけ
- 自動で動く装飾（ノイズ、マーキー、グリッチ）は置かない

### アクセシビリティ

- 共通の `:focus-visible` リング、Skip to content リンク、全ページに `<main id="main">`
- タップ領域は 44px 以上。横スクロールなし
- 画像は WebP（`public/` 合計 2.1MB）。OG 画像は 1200×630

デザインの判断記録と計測結果は [`design/`](design/) にあります（`SOULSKIN_REDESIGN_PROPOSAL.md` が方針、`SCAN_2026-10-03.md` が監査と各フェーズの結果）。

---

## Pages

| Path | Role |
|---|---|
| `/` | Hero フィルム、Manifesto、現在のドロップ、ピース、Lookbook、Atelier |
| `/drops` と `/drops/[slug]` | リリースの記録。現在のドロップとアーカイブ、残数、Instagram への注文導線 |
| `/pieces` と `/pieces/[slug]` | 受注生産のピース。素材・価格・ギャラリー |
| `/lookbook` | 写真アーカイブ。キーボード・スワイプ・サムネイルで移動 |
| `/custom` | カスタムオーダーの流れ（Brief / Build / Finish）と DM の窓口 |
| `/about` | ブランドの来歴 |
| `/admin` | パスワード式の管理画面。ドロップ・ピース・Lookbook・サイト設定の編集と画像アップロード |

---

## Content

公開ページの内容は **Supabase から読む** か、**同梱のローカル内容を使う** かを環境変数で切り替えます。

- 既定はローカル内容（`data/localContent.ts` と `public/` の画像）。Supabase を止めていてもサイト全体が表示できます
- `SITE_CONTENT_SOURCE=database` で Supabase を優先。取得できないテーブルや空のテーブルは自動でローカル内容に戻ります

管理画面からの書き込みは常に Supabase（`supabase/schema.sql` のテーブルと `soul-skin-images` バケット）へ行きます。

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4（`@theme` トークン）+ `app/editorial.css` |
| Database / Storage | Supabase (PostgreSQL, Storage) |
| Hosting | Vercel |

---

## Project Structure

```
soul-skin/
├── app/
│   ├── page.tsx                 # Home
│   ├── drops/                   # /drops, /drops/[slug]
│   ├── pieces/                  # /pieces, /pieces/[slug]
│   ├── lookbook/
│   ├── custom/
│   ├── about/
│   ├── admin/                   # 管理画面と server actions
│   ├── api/admin/               # login / logout / upload
│   ├── globals.css              # トークン（@theme）と共通スタイル
│   └── editorial.css            # ss-* レイアウト
├── components/
│   ├── layout/                  # Navbar, Footer, PageTransition
│   ├── sections/                # Hero, Lookbook, PieceGallery
│   └── ui/                      # ScrollReveal
├── data/
│   ├── siteContent.ts           # 文言
│   └── localContent.ts          # Supabase 停止時の内容
├── lib/
│   ├── db.ts                    # 型とクエリ
│   ├── public-content.ts        # DB / ローカルの切り替え
│   └── supabase.ts              # クライアント
├── design/                      # 設計書と監査
├── supabase/                    # schema.sql, migrations
├── proxy.ts                     # /admin の保護
└── public/
```

---

## How to Run Locally

```bash
git clone https://github.com/E-Zaya/SoulSkin-Website.git
cd SoulSkin-Website
npm install
# .env.local を作り、下記の環境変数を入れる
npm run dev                  # http://localhost:3000
```

その他のスクリプト: `npm run build`、`npm run start`、`npm run lint`

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # 公開キー（読み取り）
SUPABASE_SERVICE_ROLE_KEY=      # サーバー専用。管理画面の書き込みに使う
ADMIN_PASSWORD=                 # /admin のログインパスワード
ADMIN_TOKEN=                    # ログイン後に Cookie へ入れる固定トークン
SITE_CONTENT_SOURCE=            # "database" で Supabase を優先。未設定ならローカル内容
```

`SUPABASE_SERVICE_ROLE_KEY` と `ADMIN_TOKEN` はクライアントに出しません。トークンが漏れた場合は値を変えれば全セッションが無効になります。

---

## License

© 2026 Soul Skin. All rights reserved.
