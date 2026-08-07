-- ============================================
-- Go Pesca - Initial Database Schema
-- ============================================

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Species catalog
create table public.species (
  id serial primary key,
  name_es text not null,
  name_en text not null,
  scientific_name text not null,
  habitat text not null check (habitat in ('freshwater', 'saltwater', 'brackish')),
  description_es text,
  description_en text,
  reference_photo_url text,
  created_at timestamptz default now()
);

-- Catches
create table public.catches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  species_id integer not null references public.species(id),
  photo_url text not null,
  latitude double precision not null,
  longitude double precision not null,
  location_name text,
  catch_date date not null default current_date,
  weight_kg double precision,
  length_cm double precision,
  bait_lure text,
  weather text,
  tide text,
  time_of_day time,
  notes text,
  created_at timestamptz default now()
);

-- Species suggestions
create table public.species_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  common_name text not null,
  photo_url text,
  latitude double precision,
  longitude double precision,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

-- Indexes
create index catches_user_id_idx on public.catches(user_id);
create index catches_species_id_idx on public.catches(species_id);
create index catches_catch_date_idx on public.catches(catch_date desc);
create index species_suggestions_user_id_idx on public.species_suggestions(user_id);
create index species_suggestions_status_idx on public.species_suggestions(status);

-- ============================================
-- Row Level Security
-- ============================================

-- Profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Species (read-only for all, write for admins)
alter table public.species enable row level security;

create policy "Anyone can view species"
  on public.species for select
  using (true);

create policy "Admins can insert species"
  on public.species for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can update species"
  on public.species for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Catches (users see only their own)
alter table public.catches enable row level security;

create policy "Users can view own catches"
  on public.catches for select
  using (auth.uid() = user_id);

create policy "Users can insert own catches"
  on public.catches for insert
  with check (auth.uid() = user_id);

create policy "Users can update own catches"
  on public.catches for update
  using (auth.uid() = user_id);

create policy "Users can delete own catches"
  on public.catches for delete
  using (auth.uid() = user_id);

-- Species suggestions (users see own, admins see all)
alter table public.species_suggestions enable row level security;

create policy "Users can view own suggestions"
  on public.species_suggestions for select
  using (auth.uid() = user_id);

create policy "Admins can view all suggestions"
  on public.species_suggestions for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Users can insert own suggestions"
  on public.species_suggestions for insert
  with check (auth.uid() = user_id);

create policy "Admins can update suggestions"
  on public.species_suggestions for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================
-- Trigger: auto-create profile on signup
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- Storage bucket for catch photos
-- ============================================

insert into storage.buckets (id, name, public)
values ('catches', 'catches', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload catch photos"
  on storage.objects for insert
  with check (bucket_id = 'catches' and auth.role() = 'authenticated');

create policy "Anyone can view catch photos"
  on storage.objects for select
  using (bucket_id = 'catches');

create policy "Users can delete own catch photos"
  on storage.objects for delete
  using (bucket_id = 'catches' and auth.uid()::text = (storage.foldername(name))[1]);
