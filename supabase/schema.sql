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
  created_at   timestamptz not null default now()
);

-- 既存データに active=true が複数ある場合、最新1件だけ残してから unique index を作る。
update drops
set active = false
where active = true
  and id not in (
    select id from drops where active = true order by created_at desc limit 1
  );

create unique index if not exists only_one_active_drop
  on drops (active)
  where active = true;

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
alter table products enable row level security;
alter table product_images enable row level security;
alter table lookbook_items enable row level security;

drop policy if exists "Public read site_settings" on site_settings;
create policy "Public read site_settings" on site_settings for select using (true);

drop policy if exists "Public read drops" on drops;
create policy "Public read drops" on drops for select using (true);

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
