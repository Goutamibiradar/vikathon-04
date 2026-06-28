-- ============================================================
-- SafeBite – Database Schema Migration
-- Tables: restaurants, inspection_reports, complaints
-- ============================================================

-- ─────────────────────────────────────────
-- 1. RESTAURANTS
-- ─────────────────────────────────────────
create table if not exists public.restaurants (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  address              text not null,
  cuisine              text not null,
  hygiene_score        integer not null default 100 check (hygiene_score between 0 and 100),
  grade                text not null default 'A' check (grade in ('A','B','C','F')),
  last_inspection_date date,
  owner_name           text not null,
  owner_email          text not null,
  status               text not null default 'Pending Inspection'
                         check (status in ('Active','Pending Inspection','Suspended')),
  inspections_count    integer not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger restaurants_updated_at
  before update on public.restaurants
  for each row execute procedure public.set_updated_at();

-- RLS
alter table public.restaurants enable row level security;

-- Public can read all restaurants (hygiene registry is public)
create policy "restaurants: public read"
  on public.restaurants for select
  to anon, authenticated
  using (true);

-- Only service_role can insert/update/delete (admin operations go via API routes)
create policy "restaurants: service write"
  on public.restaurants for all
  to service_role
  using (true)
  with check (true);


-- ─────────────────────────────────────────
-- 2. INSPECTION REPORTS
-- ─────────────────────────────────────────
create table if not exists public.inspection_reports (
  id               uuid primary key default gen_random_uuid(),
  restaurant_id    uuid not null references public.restaurants(id) on delete cascade,
  restaurant_name  text not null,
  inspector_name   text not null,
  inspection_date  date not null default current_date,
  score            integer not null check (score between 0 and 100),
  grade            text not null check (grade in ('A','B','C','F')),
  remarks          text not null,
  image_url        text,
  -- Criteria breakdown (0-10 each)
  crit_cleanliness         integer not null default 0 check (crit_cleanliness between 0 and 10),
  crit_food_handling       integer not null default 0 check (crit_food_handling between 0 and 10),
  crit_pest_control        integer not null default 0 check (crit_pest_control between 0 and 10),
  crit_staff_hygiene       integer not null default 0 check (crit_staff_hygiene between 0 and 10),
  crit_temperature_control integer not null default 0 check (crit_temperature_control between 0 and 10),
  created_at       timestamptz not null default now()
);

create index idx_inspection_reports_restaurant_id on public.inspection_reports(restaurant_id);
create index idx_inspection_reports_date on public.inspection_reports(inspection_date desc);

-- RLS
alter table public.inspection_reports enable row level security;

-- Public read (transparency)
create policy "inspection_reports: public read"
  on public.inspection_reports for select
  to anon, authenticated
  using (true);

-- Service role full access
create policy "inspection_reports: service write"
  on public.inspection_reports for all
  to service_role
  using (true)
  with check (true);


-- ─────────────────────────────────────────
-- 3. COMPLAINTS
-- ─────────────────────────────────────────
create table if not exists public.complaints (
  id               uuid primary key default gen_random_uuid(),
  restaurant_id    uuid not null references public.restaurants(id) on delete cascade,
  restaurant_name  text not null,
  customer_name    text not null,
  customer_email   text not null,
  incident_date    date not null,
  description      text not null,
  category         text not null check (category in (
                     'Hygiene', 'Spoiled Food', 'Pest Infestation', 'Staff Behavior', 'Other'
                   )),
  status           text not null default 'Pending'
                     check (status in ('Pending', 'Investigating', 'Resolved')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_complaints_restaurant_id on public.complaints(restaurant_id);
create index idx_complaints_status on public.complaints(status);

create trigger complaints_updated_at
  before update on public.complaints
  for each row execute procedure public.set_updated_at();

-- RLS
alter table public.complaints enable row level security;

-- Anyone can INSERT a complaint (public complaint form)
create policy "complaints: public insert"
  on public.complaints for insert
  to anon, authenticated
  with check (true);

-- Only service_role reads/updates complaints (admin only)
create policy "complaints: service read and update"
  on public.complaints for all
  to service_role
  using (true)
  with check (true);


-- ─────────────────────────────────────────
-- 4. SEED DATA (optional demo rows)
-- ─────────────────────────────────────────
insert into public.restaurants (name, address, cuisine, hygiene_score, grade, last_inspection_date, owner_name, owner_email, status, inspections_count) values
  ('Green Garden Bistro',  '124 Eco Friendly Way, Green Hills', 'Vegetarian & Organic', 96, 'A', '2026-05-15', 'Sarah Jenkins',   'sarah@greengarden.com',   'Active',             4),
  ('Golden Dragon Buffet', '888 Wok Street, Chinatown',         'Chinese Asian',        72, 'C', '2026-06-10', 'David Lee',        'david@goldendragon.com',  'Active',             3),
  ('Quick Bites Diner',    '42 Main Street, Metro Center',      'Fast Food / American', 84, 'B', '2026-04-20', 'Robert Vance',     'robert@quickbites.com',   'Active',             5),
  ('Seafood Shack',        '7 Harbor Marina Drive',             'Seafood Grill',        45, 'F', '2026-06-01', 'Captain Haddock',  'haddock@seafoodshack.com','Suspended',          2),
  ('Bella Italia',         '10 Tuscany Court, Little Italy',    'Italian',              94, 'A', '2026-05-28', 'Marco Rossi',      'marco@bellaitalia.com',   'Active',             6),
  ('The Burger Joint',     '505 Grill Avenue, Downtown',        'Burgers & Shakes',     80, 'B', '2026-03-12', 'Jane Dough',       'jane@burgerjoint.com',    'Pending Inspection', 1);
