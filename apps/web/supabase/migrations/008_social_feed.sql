-- ============================================
-- Social Feed: is_public on catches + catch_reactions table
-- ============================================

-- Add is_public column to catches (default true = visible in community feed)
alter table public.catches add column is_public boolean not null default true;

-- Index for feed queries: public catches ordered by creation date
create index catches_is_public_created_at_idx on public.catches(is_public, created_at desc);

-- ============================================
-- Catch Reactions
-- ============================================

create table public.catch_reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  catch_id uuid not null references public.catches(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('fish', 'fire', 'trophy', 'wow', 'respect')),
  created_at timestamptz default now(),
  unique (user_id, catch_id)
);

create index catch_reactions_catch_id_idx on public.catch_reactions(catch_id);

-- ============================================
-- RLS: Public catch visibility
-- ============================================

-- Any authenticated user can read public catches (coexists with "Users can view own catches")
create policy "Authenticated users can view public catches"
  on public.catches for select
  using (is_public = true and auth.uid() is not null);

-- ============================================
-- RLS: Profiles - allow reading display names
-- ============================================

-- Any authenticated user can read any profile (needed for feed display names)
create policy "Authenticated users can read profiles"
  on public.profiles for select
  using (auth.uid() is not null);

-- ============================================
-- RLS: Catch Reactions
-- ============================================

alter table public.catch_reactions enable row level security;

-- Anyone authenticated can read reactions on public catches
create policy "Authenticated users can view reactions"
  on public.catch_reactions for select
  using (auth.uid() is not null);

-- Users can insert their own reactions
create policy "Users can insert own reactions"
  on public.catch_reactions for insert
  with check (auth.uid() = user_id);

-- Users can update their own reactions
create policy "Users can update own reactions"
  on public.catch_reactions for update
  using (auth.uid() = user_id);

-- Users can delete their own reactions
create policy "Users can delete own reactions"
  on public.catch_reactions for delete
  using (auth.uid() = user_id);
