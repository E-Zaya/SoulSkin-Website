-- ============================================================
-- SOUL SKIN — Supabase Database Schema
-- Supabase の SQL Editor にこのファイルを貼り付けて実行してください
-- ============================================================

-- 1. Drops テーブル（限定リリース）
create table if not exists drops (
  id           uuid primary key default gen_random_uuid(),
  label        text not null default 'Current Drop',
  title_line1  text not null default 'VOID SERIES',
  title_line2  text not null default '001',
  description  text not null default '',
  pieces_left  integer not null default 0,
  cta          text not null default 'Order via Instagram',
  image_url    text,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- 2. Products テーブル（商品一覧）
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  sku          text not null,
  name         text not null,
  material     text not null default '',
  description  text not null default '',
  price        text not null default 'AVAILABLE BY DM',
  image_url    text,
  offset_class text not null default 'md:mt-0',
  order_index  integer not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- 3. Lookbook Items テーブル
create table if not exists lookbook_items (
  id           uuid primary key default gen_random_uuid(),
  item_id      text not null,
  image_url    text,
  order_index  integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- 初期データ（既存サイトの内容をそのまま挿入）
-- ============================================================

-- Drop 初期データ
insert into drops (label, title_line1, title_line2, description, pieces_left, cta, active)
values (
  'Current Drop',
  'VOID SERIES',
  '001',
  'Constructed from 380gsm heavy cotton. Raw hem edges. Designed in Ulaanbaatar for those who need no explanation.',
  3,
  'Order via Instagram',
  true
);

-- Products 初期データ
insert into products (sku, name, material, description, price, image_url, offset_class, order_index)
values
  ('SK-001', 'VOID JACKET',  'HEAVY COTTON / 380GSM',    'Hand-distressed raw hems. Boxy fit.',                    'AVAILABLE BY DM', '/product-jacket.png', 'md:mt-0',  0),
  ('SK-002', 'ASH HOODIE',   'FRENCH TERRY / 320GSM',    'Overdyed finish with custom drop shoulders.',            'AVAILABLE BY DM', '/product-hoodie.png', 'md:mt-10', 1),
  ('SK-003', 'BONE LAYER',   'RIPSTOP NYLON / OVERSIZED', 'Wind-resistant light outerwear piece.',                 'AVAILABLE BY DM', '/lookbook-02.png',    'md:-mt-4', 2);

-- Lookbook 初期データ
insert into lookbook_items (item_id, image_url, order_index)
values
  ('SS25 — 001', '/lookbook-01.png', 0),
  ('SS25 — 002', '/lookbook-02.png', 1),
  ('SS25 — 003', '/lookbook-03.png', 2);

-- ============================================================
-- RLS（Row Level Security）設定
-- フロントから anon キーで読み取り可能、書き込みは service_role のみ
-- ============================================================

alter table drops         enable row level security;
alter table products      enable row level security;
alter table lookbook_items enable row level security;

-- 読み取りポリシー（誰でも読める）
create policy "Public read drops"          on drops         for select using (true);
create policy "Public read products"       on products      for select using (true);
create policy "Public read lookbook_items" on lookbook_items for select using (true);

-- ============================================================
-- Storage バケット設定
-- Supabase Dashboard → Storage → New Bucket で手動作成してもOK
-- ============================================================

-- バケット作成（公開アクセス可）
insert into storage.buckets (id, name, public)
values ('soul-skin-images', 'soul-skin-images', true)
on conflict do nothing;

-- 公開読み取りポリシー
create policy "Public read images"
  on storage.objects for select
  using (bucket_id = 'soul-skin-images');

-- service_role のみ書き込み可（API ルートで service_role キーを使用）
create policy "Service role upload"
  on storage.objects for insert
  with check (bucket_id = 'soul-skin-images');
