-- ============================================================
-- SOUL SKIN — Supabase Database Schema
-- Supabase の SQL Editor にこのファイルを貼り付けて実行してください
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists site_settings (
  id                 integer primary key default 1,
  hero_image_url     text,
  about_image_url    text,
  about_description  text not null default '',
  updated_at         timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

create table if not exists drops (
  id           uuid primary key default gen_random_uuid(),
  label        text not null default '',
  title_line1  text not null default '',
  title_line2  text not null default '',
  description  text not null default '',
  pieces_left  integer not null default 0 check (pieces_left >= 0),
  cta          text not null default '',
  image_url    text,
  active       boolean not null default false,
  order_index  integer not null default 0,
  created_at   timestamptz not null default now()
);

-- 既存スキーマからのマイグレーション:
--   1. かつての「Active 1件のみ」unique index を撤廃 (Active を複数持てるよう)。
--   2. order_index 列を追加 (Admin で並び順を制御するため)。
drop index if exists only_one_active_drop;

alter table drops
  add column if not exists order_index integer not null default 0;

create index if not exists drops_active_order_idx
  on drops (active, order_index, created_at desc);

create table if not exists drop_images (
  id           uuid primary key default gen_random_uuid(),
  drop_id      uuid not null references drops(id) on delete cascade,
  image_url    text not null,
  order_index  integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists drop_images_drop_id_order_index_idx
  on drop_images (drop_id, order_index);

create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  sku          text not null,
  name         text not null,
  material     text not null default '',
  description  text not null default '',
  price        text not null default '',
  image_url    text,
  offset_class text not null default 'md:mt-0',
  order_index  integer not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

create unique index if not exists products_sku_unique on products (sku);

create table if not exists product_images (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references products(id) on delete cascade,
  image_url    text not null,
  order_index  integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists product_images_product_id_order_index_idx
  on product_images (product_id, order_index);

create table if not exists lookbook_items (
  id           uuid primary key default gen_random_uuid(),
  item_id      text not null,
  image_url    text,
  order_index  integer not null default 0,
  created_at   timestamptz not null default now()
);

create unique index if not exists lookbook_item_id_unique on lookbook_items (item_id);

alter table site_settings enable row level security;
alter table drops enable row level security;
alter table drop_images enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table lookbook_items enable row level security;

drop policy if exists "Public read site_settings" on site_settings;
create policy "Public read site_settings" on site_settings for select using (true);

drop policy if exists "Public read drops" on drops;
create policy "Public read drops" on drops for select using (true);

drop policy if exists "Public read drop_images" on drop_images;
create policy "Public read drop_images" on drop_images for select using (true);

drop policy if exists "Public read products" on products;
create policy "Public read products" on products for select using (true);

drop policy if exists "Public read product_images" on product_images;
create policy "Public read product_images" on product_images for select using (true);

drop policy if exists "Public read lookbook_items" on lookbook_items;
create policy "Public read lookbook_items" on lookbook_items for select using (true);

insert into storage.buckets (id, name, public)
values ('soul-skin-images', 'soul-skin-images', true)
on conflict do nothing;

drop policy if exists "Public read images" on storage.objects;
create policy "Public read images"
  on storage.objects for select
  using (bucket_id = 'soul-skin-images');

-- storage.objects の insert/update/delete policy は作らない。
-- 管理画面のアップロード・削除は API route から service_role key で実行する。
