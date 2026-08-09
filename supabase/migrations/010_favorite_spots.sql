-- Add favorite fishing spots to profiles
alter table public.profiles add column if not exists favorite_spots text[] default '{}';
