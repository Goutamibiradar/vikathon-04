-- Create a public bucket for inspector evidence images
insert into storage.buckets (id, name, public) values ('inspection-images', 'inspection-images', true)
on conflict (id) do nothing;

-- Set up RLS for the bucket
-- Allow public access to view the images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'inspection-images' );

-- Allow any authenticated or anon user to upload to the bucket (since the portal uses anon role)
create policy "Authenticated or Anon Upload"
on storage.objects for insert
with check ( bucket_id = 'inspection-images' );
