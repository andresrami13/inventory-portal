-- =============================================
-- PORTAL DE INVENTARIO — Schema Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

-- PROFILES (extiende auth.users de Supabase)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- PRODUCTS
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null default 0,
  image_url text,
  stock integer not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
);

-- CART ITEMS
create table public.cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- AUDIT LOG (inmutable, sin update/delete via RLS)
create table public.audit_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  user_email text not null,
  action text not null,        -- 'create' | 'update' | 'delete' | 'export'
  entity text not null,        -- 'product' | 'cart'
  entity_id text,
  detail jsonb,
  created_at timestamptz default now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.cart_items enable row level security;
alter table public.audit_log enable row level security;

-- Profiles: cada usuario ve y edita solo el suyo
create policy "profiles: ver propio" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: editar propio" on public.profiles
  for update using (auth.uid() = id);

-- Products: cualquier usuario autenticado puede ver y modificar
create policy "products: ver todos" on public.products
  for select using (auth.role() = 'authenticated');

create policy "products: insertar" on public.products
  for insert with check (auth.role() = 'authenticated');

create policy "products: actualizar" on public.products
  for update using (auth.role() = 'authenticated');

create policy "products: eliminar" on public.products
  for delete using (auth.role() = 'authenticated');

-- Cart items: cada usuario maneja solo su carrito
create policy "cart: ver propio" on public.cart_items
  for select using (auth.uid() = user_id);

create policy "cart: insertar propio" on public.cart_items
  for insert with check (auth.uid() = user_id);

create policy "cart: actualizar propio" on public.cart_items
  for update using (auth.uid() = user_id);

create policy "cart: eliminar propio" on public.cart_items
  for delete using (auth.uid() = user_id);

-- Audit log: insertar siempre, nunca borrar ni editar
create policy "audit: insertar" on public.audit_log
  for insert with check (auth.role() = 'authenticated');

create policy "audit: ver propio" on public.audit_log
  for select using (auth.uid() = user_id);

-- =============================================
-- STORAGE: bucket para imágenes de productos
-- =============================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true);

create policy "images: ver público" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "images: subir autenticado" on storage.objects
  for insert with check (
    bucket_id = 'product-images' and auth.role() = 'authenticated'
  );

create policy "images: eliminar autenticado" on storage.objects
  for delete using (
    bucket_id = 'product-images' and auth.role() = 'authenticated'
  );

-- =============================================
-- TRIGGER: crear profile automático al registrarse
-- =============================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
