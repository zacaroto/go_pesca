-- Allow authenticated users to view any user's achievements
-- (previously restricted to own achievements only, which broke profile views)

drop policy if exists "Users can view own achievements" on public.user_achievements;

create policy "Authenticated users can view achievements"
  on public.user_achievements for select
  using (auth.uid() is not null);
