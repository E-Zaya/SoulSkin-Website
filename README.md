# Soul Skin — Wear Your Soul

> A brand experience website for **Soul Skin**, an independent streetwear label from Ulaanbaatar, Mongolia.

![Soul Skin Brand Lookbook](https://soul-skin-website.vercel.app/_next/image?url=https%3A%2F%2Fwtxgqkotckxcqzjhnfle.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fsoul-skin-images%2Fsite%2F1778424909734-bcc9355c-f124-452d-a831-e22d99d1fd0c.png&w=3840&q=75)

**[Live Site](https://soul-skin-website.vercel.app/)** | **[Case Study](https://ezaya.dev/blog)** | **[Instagram @yoursoulskin](https://www.instagram.com/yoursoulskin)**

---

## Overview

Soul Skin は Instagram DM のみで展開してきたストリートウェアレーベルが、**ブランドの世界観を適切に表現するために** 構築したデジタル体験です。

このサイトは「商品を売る」のではなく、**ウランバートルという街のテクスチャそのものを色と映像で表現し、訪問者をブランドの世界に没入させる** ことを目的としています。

### Why This Project

- Instagram だけではブランドの全体像が伝わらない
- 限定ドロップ、Lookbook、過去の作品を一元管理したい
- スマートフォンでも映像的な体験を損なわない設計が必要

---

## Design Philosophy

### ウランバートルの街を色に

カラーパレットは決して派手ではなく、街そのものから拾った色たちです。

- **灰（Gray）** — 冬の空、コンクリート、雪に埋もれた街
- **骨（Bone）** — 風化した建材、砂漠の光
- **錆（Rust）** — 古い鉄製品、時間の経過

### 静けさの中の緊張感

完璧に整理された、洗練されたデザインは Soul Skin らしくありません。そこで意識的に **「ノイズ」を仕込みました**。

- **商品の配置ずらし** — Pieces セクションで上下に微妙にずらす
- **揺れるテキスト** — Hero の「Choose Your Skin」がロード時に微かに揺れる
- **流れるテープ** — Custom Order セクションに「MADE IN ULAANBAATAR - WEAR YOUR SOUL」が流れ続ける
- **映画的な Lookbook** — フィルムのような表現で没入感を最大化

### Information is Visual

テキストは最小限。ロゴ、写真、配置そのものでブランドを語ります。

---

## Technical Highlights

### Dynamic Content Management

すべてのドロップ、ピース、テキストは **Supabase から動的に管理**。

```
管理画面から以下を更新可能：
✓ Hero セクションの画像・テキスト
✓ About セクションの内容
✓ 新しいドロップ / ピースの追加
✓ 最大 5 枚までの商品画像
```

### React Page Rendering

サイト全体のテキストを Data フォルダから一元管理し、重複コードを最小化。後からの修正・拡張が容易です。

### Mobile-First Experience

スマートフォンでの体験を最優先設計：

- **Pieces Display** — 2 列 3 行で整然と表示
- **Detail Popup** — タップで詳細表示（別ページ遷移なし）
- **Smart Navigation** — 一般的な 3 本線ではなく 2 本線。開くと「X」に
- **Smooth Interactions** — すべての操作が指一本で直感的に

### Image Optimization

複数画像対応、Next.js Image Optimization により、高速で美しい表示を実現。

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14+ |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Hosting** | Vercel |
| **Image Storage** | Supabase Storage |

---

## Project Structure

```
soul-skin-website/
├── app/
│   ├── page.tsx                 # Home / Hero
│   ├── drops/
│   │   └── page.tsx             # Drops listing
│   ├── lookbook/
│   │   └── page.tsx             # Film-like lookbook
│   ├── pieces/
│   │   └── page.tsx             # Product gallery
│   ├── custom/
│   │   └── page.tsx             # Custom order info
│   └── about/
│       └── page.tsx             # Brand story
├── components/
│   ├── Hero.tsx
│   ├── Lookbook.tsx
│   ├── ProductCard.tsx
│   ├── Navigation.tsx
│   └── ...
├── data/
│   ├── navigation.ts            # Menu items
│   ├── copywriting.ts           # All text content
│   └── ...
├── lib/
│   └── supabase.ts              # Database client
└── public/
    └── images/
```

---

## Key Features

### 1. Drops Management
新しいドロップをリアルタイムで告知。各ドロップは Supabase から自動で反映されます。

### 2. Dynamic Lookbook
映画のようなビジュアル体験。スクロールすることでブランドの世界観に没入します。

### 3. Product Gallery
Pieces を 2 列表示。各商品は最大 5 枚の画像に対応し、スマホでもストレスなくスライド操作できます。

### 4. Custom Order Flow
Instagram への導線が自然に。「カスタムオーダーしたい」というユーザーの動きをサポート。

### 5. Responsive Design
スマートフォン中心の設計。すべてのインタラクションが快適に動作します。

---

## Performance

- **Lighthouse Score**: 90+
- **Core Web Vitals**: All Green
- **Image Optimization**: Next.js Image + Supabase CDN
- **Dynamic Rendering**: React Page Rendering で効率化

---

## What I Learned

このプロジェクトを通じて：

✓ **DB 設計と Supabase 操作** を実践的に習得  
✓ **デザイン × 開発の統合** — ビジュアルと機能が相互補完する関係を体感  
✓ **スマートフォン UX の深さ** — 指一本でいかに楽しい体験を作るか  
✓ **ブランドの「空気感」を Web で表現する難しさと面白さ**

---

## Future Enhancements

- [ ] E-commerce integration (checkout flow)
- [ ] Newsletter signup
- [ ] Internationalization (MN / EN / JP)
- [ ] Animation refinements
- [ ] Analytics dashboard

---

## How to Run Locally

```bash
# Clone repository
git clone https://github.com/yourusername/soul-skin-website.git
cd soul-skin-website

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and API key

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## License

© 2026 Soul Skin. All rights reserved.

---

## Contact

- **Website**: [soul-skin-website.vercel.app](https://soul-skin-website.vercel.app/)
- **Instagram**: [@yoursoulskin](https://www.instagram.com/yoursoulskin)
- **Email**: Get in touch via Instagram DM