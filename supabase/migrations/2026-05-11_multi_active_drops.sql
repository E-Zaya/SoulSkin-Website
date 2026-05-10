-- ============================================================
-- 2026-05-11 — 複数 Active Drop 対応 + drop_images テーブル
--
-- Supabase の SQL Editor にこの「ファイルだけ」貼り付けて実行してください。
-- 既に走らせた後に再実行しても安全 (冪等) です。
-- ============================================================

-- 1) 「Active 1件のみ」制約を撤廃 (複数 Active を許可)
drop index if exists only_one_active_drop;

-- 2) drops に並び順カラム追加 (Admin で並び替え)
alter table drops
  add column if not exists order_index integer not null default 0;

-- 検索/並び替え高速化用インデックス
create index if not exists drops_active_order_idx
  on drops (active, order_index, created_at desc);

-- 3) 詳細ページ用サブ画像テーブル
create table if not exists drop_images (
  id           uuid primary key default gen_random_uuid(),
  drop_id      uuid not null references drops(id) on delete cascade,
  image_url    text not null,
  order_index  integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists drop_images_drop_id_order_index_idx
  on drop_images (drop_id, order_index);

-- 4) RLS — drop_images を公開読取可に
alter table drop_images enable row level security;

drop policy if exists "Public read drop_images" on drop_images;
create policy "Public read drop_images" on drop_images for select using (true);
