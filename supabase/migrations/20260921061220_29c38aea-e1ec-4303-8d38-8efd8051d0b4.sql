-- roles
create type public.app_role as enum ('farmer','buyer','admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  avatar_url text,
  suspended boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant select on public.profiles to anon;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create table public.farmer_details (
  user_id uuid primary key references auth.users(id) on delete cascade,
  farm_name text not null default '',
  location text not null default '',
  crops text not null default '',
  bank_info text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.farmer_details to authenticated;
grant select on public.farmer_details to anon;
grant all on public.farmer_details to service_role;
alter table public.farmer_details enable row level security;

create table public.buyer_details (
  user_id uuid primary key references auth.users(id) on delete cascade,
  address text not null default '',
  buyer_type text not null default 'individual',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.buyer_details to authenticated;
grant all on public.buyer_details to service_role;
alter table public.buyer_details enable row level security;

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  price numeric(10,2) not null check (price >= 0),
  unit text not null default 'kg',
  quantity numeric(10,2) not null default 0,
  harvest_date date,
  description text,
  images text[] not null default '{}',
  status text not null default 'approved',
  flagged boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.listings to authenticated;
grant select on public.listings to anon;
grant all on public.listings to service_role;
alter table public.listings enable row level security;
create index listings_farmer_idx on public.listings(farmer_id);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  total numeric(12,2) not null default 0,
  delivery_address text,
  payment_method text,
  disputed boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete set null,
  farmer_id uuid not null,
  name_snapshot text not null default '',
  unit_snapshot text not null default 'kg',
  quantity numeric(10,2) not null default 1,
  price_at_purchase numeric(10,2) not null default 0
);
grant select, insert on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create index order_items_order_idx on public.order_items(order_id);
create index order_items_farmer_idx on public.order_items(farmer_id);

create table public.wishlists (
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);
grant select, insert, delete on public.wishlists to authenticated;
grant all on public.wishlists to service_role;
alter table public.wishlists enable row level security;

-- policies: profiles
create policy "profiles public read" on public.profiles for select to anon, authenticated using (true);
create policy "profiles self insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles self update" on public.profiles for update to authenticated using (auth.uid() = id or public.has_role(auth.uid(),'admin')) with check (auth.uid() = id or public.has_role(auth.uid(),'admin'));

-- policies: user_roles
create policy "roles self read" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- policies: farmer_details
create policy "farmer details public read" on public.farmer_details for select to anon, authenticated using (true);
create policy "farmer details self write" on public.farmer_details for insert to authenticated with check (auth.uid() = user_id);
create policy "farmer details self update" on public.farmer_details for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- policies: buyer_details
create policy "buyer details self read" on public.buyer_details for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "buyer details self insert" on public.buyer_details for insert to authenticated with check (auth.uid() = user_id);
create policy "buyer details self update" on public.buyer_details for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- policies: listings
create policy "listings public read approved" on public.listings for select to anon, authenticated using (status = 'approved');
create policy "listings owner read" on public.listings for select to authenticated using (farmer_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "listings owner insert" on public.listings for insert to authenticated with check (farmer_id = auth.uid() and public.has_role(auth.uid(),'farmer'));
create policy "listings owner update" on public.listings for update to authenticated using (farmer_id = auth.uid() or public.has_role(auth.uid(),'admin')) with check (farmer_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "listings owner delete" on public.listings for delete to authenticated using (farmer_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- policies: orders
create policy "orders buyer read" on public.orders for select to authenticated using (
  buyer_id = auth.uid()
  or public.has_role(auth.uid(),'admin')
  or exists (select 1 from public.order_items oi where oi.order_id = orders.id and oi.farmer_id = auth.uid())
);
create policy "orders buyer insert" on public.orders for insert to authenticated with check (buyer_id = auth.uid());
create policy "orders update" on public.orders for update to authenticated using (
  public.has_role(auth.uid(),'admin')
  or exists (select 1 from public.order_items oi where oi.order_id = orders.id and oi.farmer_id = auth.uid())
) with check (
  public.has_role(auth.uid(),'admin')
  or exists (select 1 from public.order_items oi where oi.order_id = orders.id and oi.farmer_id = auth.uid())
);

-- policies: order_items
create policy "order items read" on public.order_items for select to authenticated using (
  farmer_id = auth.uid()
  or public.has_role(auth.uid(),'admin')
  or exists (select 1 from public.orders o where o.id = order_items.order_id and o.buyer_id = auth.uid())
);
create policy "order items insert" on public.order_items for insert to authenticated with check (
  exists (select 1 from public.orders o where o.id = order_items.order_id and o.buyer_id = auth.uid())
);

-- policies: wishlists
create policy "wishlist self all" on public.wishlists for select to authenticated using (user_id = auth.uid());
create policy "wishlist self insert" on public.wishlists for insert to authenticated with check (user_id = auth.uid());
create policy "wishlist self delete" on public.wishlists for delete to authenticated using (user_id = auth.uid());

-- signup trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _role public.app_role;
begin
  _role := coalesce(nullif(new.raw_user_meta_data->>'role','')::public.app_role, 'buyer');

  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role) values (new.id, _role)
  on conflict (user_id, role) do nothing;

  if _role = 'farmer' then
    insert into public.farmer_details (user_id, farm_name, location, crops)
    values (new.id,
      coalesce(new.raw_user_meta_data->>'farm_name',''),
      coalesce(new.raw_user_meta_data->>'location',''),
      coalesce(new.raw_user_meta_data->>'crops',''))
    on conflict (user_id) do nothing;
  elsif _role = 'buyer' then
    insert into public.buyer_details (user_id, address, buyer_type)
    values (new.id,
      coalesce(new.raw_user_meta_data->>'address',''),
      coalesce(nullif(new.raw_user_meta_data->>'buyer_type',''),'individual'))
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();