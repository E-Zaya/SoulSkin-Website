-- ============================================================
-- SOUL SKIN — Supabase Database Schema
-- Supabase の SQL Editor にこのファイルを貼り付けて実行してください
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists drops (
  id           uuid primary key default gen_random_uuid(),
  label        text not null default 'Current Drop',
  title_line1  text not null default 'VOID SERIES',
  title_line2  text not null default '001',
  description  text not null default '',
  pieces_left  integer not null default 0 check (pieces_left >= 0),
  cta          text not null default 'Order via Instagram',
  image_url    text,
  active       boolean not null default false,
  created_at   timestamptz not null default now()
);

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
  price        text not null default 'AVAILABLE BY DM',
  image_url    text,
  offset_class text not null default 'md:mt-0',
  order_index  integer not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

create unique index if not exists products_sku_unique on products (sku);

create table if not exists lookbook_items (
  id           uuid primary key default gen_random_uuid(),
  item_id      text not null,
  image_url    text,
  order_index  integer not null default 0,
  created_at   timestamptz not null default now()
);

create unique index if not exists lookbook_item_id_unique on lookbook_items (item_id);

insert into drops (label, title_line1, title_line2, description, pieces_left, cta, active)
select
  'Current Drop',
  'VOID SERIES',
  '001',
  'Constructed from 380gsm heavy cotton. Raw hem edges. Designed in Ulaanbaatar for those who need no explanation.',
  3,
  'Order via Instagram',
  true
where not exists (
  select 1 from drops where title_line1 = 'VOID SERIES' and title_line2 = '001'
);

insert into products (sku, name, material, description, price, image_url, offset_class, order_index)
values
  ('SK-001', 'VOID JACKET',  'HEAVY COTTON / 380GSM',     'Hand-distressed raw hems. Boxy fit.',         'AVAILABLE BY DM', '/product-jacket.png', 'md:mt-0',  0),
  ('SK-002', 'ASH HOODIE',   'FRENCH TERRY / 320GSM',     'Overdyed finish with custom drop shoulders.', 'AVAILABLE BY DM', '/product-hoodie.png', 'md:mt-10', 1),
  ('SK-003', 'BONE LAYER',   'RIPSTOP NYLON / OVERSIZED', 'Wind-resistant light outerwear piece.',       'AVAILABLE BY DM', '/lookbook-02.png',    'md:-mt-4', 2)
on conflict (sku) do update set
  name = excluded.name,
  material = excluded.material,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  offset_class = excluded.offset_class,
  order_index = excluded.order_index;

insert into lookbook_items (item_id, image_url, order_index)
values
  ('SS25 — 001', '/lookbook-01.png', 0),
  ('SS25 — 002', '/lookbook-02.png', 1),
  ('SS25 — 003', '/lookbook-03.png', 2)
on conflict (item_id) do update set
  image_url = excluded.image_url,
  order_index = excluded.order_index;

alter table drops enable row level security;
alter table products enable row level security;
alter table lookbook_items enable row level security;

drop policy if exists "Public read drops" on drops;
create policy "Public read drops" on drops for select using (true);

drop policy if exists "Public read products" on products;
create policy "Public read products" on products for select using (true);

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
