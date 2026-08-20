-- Add profile fields for user identity
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists fishing_tags text[] default '{}';
alter table public.profiles add column if not exists home_region text;
alter table public.profiles add column if not exists social_links jsonb default '{}';

-- Create avatars storage bucket (same pattern as catches bucket in 001)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Upload: authenticated users, path = userId/filename
create policy "Users can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Read: anyone (public bucket)
create policy "Anyone can view avatars"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

-- Update: owner only
create policy "Users can update their own avatar"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Delete: owner only
create policy "Users can delete their own avatar"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
