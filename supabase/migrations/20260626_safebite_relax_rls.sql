-- ============================================================
-- SafeBite – Relax RLS Policies for Hackathon MVP (No Auth)
-- ============================================================

-- RESTAURANTS
drop policy if exists "restaurants: service write" on public.restaurants;
create policy "restaurants: anon write"
  on public.restaurants for all
  to anon, authenticated
  using (true)
  with check (true);

-- INSPECTION REPORTS
drop policy if exists "inspection_reports: service write" on public.inspection_reports;
create policy "inspection_reports: anon write"
  on public.inspection_reports for all
  to anon, authenticated
  using (true)
  with check (true);

-- COMPLAINTS
drop policy if exists "complaints: service read and update" on public.complaints;
create policy "complaints: anon read and update"
  on public.complaints for all
  to anon, authenticated
  using (true)
  with check (true);
