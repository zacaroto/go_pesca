-- "Aprender" section: short guides, step-by-step knots, species fishing seasons and each
-- angler's progress. Content is public (readable signed out); only admins write it.

create table public.learn_guides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  chapter text not null check (chapter in ('technique', 'where_when')),
  sort_order int not null default 0,
  read_minutes int not null default 4,
  title_es text not null,
  title_en text not null,
  summary_es text not null,
  summary_en text not null,
  body_es text not null,
  body_en text not null,
  sources text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz default now()
);

create table public.knots (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order int not null default 0,
  name_es text not null,
  name_en text not null,
  summary_es text not null,
  summary_en text not null,
  best_for_es text not null,
  best_for_en text not null,
  difficulty smallint not null default 1 check (difficulty between 1 and 3),
  -- [{ "text_es": "...", "text_en": "..." }, ...]
  steps jsonb not null default '[]',
  image_url text,
  image_credit text,
  image_source_url text,
  sources text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz default now()
);

create table public.species_seasons (
  id uuid primary key default gen_random_uuid(),
  species_id int not null references public.species(id) on delete cascade,
  region text not null check (region in ('pacific', 'caribbean', 'freshwater')),
  -- Jan..Dec: 0 not fished/closed, 1 can be caught, 2 good, 3 peak
  months smallint[] not null check (array_length(months, 1) = 12),
  where_es text,
  where_en text,
  note_es text,
  note_en text,
  source_url text,
  unique (species_id, region)
);

create table public.learn_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('guide', 'knot')),
  slug text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, item_type, slug)
);

alter table public.learn_guides enable row level security;
alter table public.knots enable row level security;
alter table public.species_seasons enable row level security;
alter table public.learn_progress enable row level security;

-- Public read of published content.
create policy "Anyone can view published guides" on public.learn_guides for select using (is_published = true);
create policy "Anyone can view published knots" on public.knots for select using (is_published = true);
create policy "Anyone can view species seasons" on public.species_seasons for select using (true);

-- Admins manage content.
create policy "Admins manage guides" on public.learn_guides for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "Admins manage knots" on public.knots for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "Admins manage seasons" on public.species_seasons for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Each angler sees and writes only their own progress.
create policy "Users view own learn progress" on public.learn_progress for select using (auth.uid() = user_id);
create policy "Users add own learn progress" on public.learn_progress for insert with check (auth.uid() = user_id);
create policy "Users remove own learn progress" on public.learn_progress for delete using (auth.uid() = user_id);

-- Public bucket for knot diagrams.
insert into storage.buckets (id, name, public) values ('learn', 'learn', true) on conflict (id) do nothing;
create policy "Anyone can view learn images" on storage.objects for select using (bucket_id = 'learn');
