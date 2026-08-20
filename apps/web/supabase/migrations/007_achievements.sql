-- Achievement definitions (static catalog)
create table achievement_definitions (
  id text primary key,
  icon text not null,
  sort_order integer not null default 0
);

-- Seed the 9 achievements
insert into achievement_definitions (id, icon, sort_order) values
  ('first_blood',  '🩸', 1),
  ('species_5',    '🗺️', 2),
  ('species_10',   '🔬', 3),
  ('species_20',   '🏆', 4),
  ('big_catch',    '💪', 5),
  ('night_owl',    '🦉', 6),
  ('early_bird',   '🌅', 7),
  ('catch_10',     '🎯', 8),
  ('catch_50',     '👑', 9);

-- User achievements (earned instances)
create table user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null references achievement_definitions(id) on delete cascade,
  catch_id uuid references catches(id) on delete set null,
  awarded_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

-- RLS
alter table achievement_definitions enable row level security;
alter table user_achievements enable row level security;

-- Anyone can read achievement definitions
create policy "Achievement definitions are publicly readable"
  on achievement_definitions for select
  using (true);

-- Users can only see their own achievements
create policy "Users can view own achievements"
  on user_achievements for select
  using (auth.uid() = user_id);

-- Users can insert their own achievements
create policy "Users can insert own achievements"
  on user_achievements for insert
  with check (auth.uid() = user_id);
