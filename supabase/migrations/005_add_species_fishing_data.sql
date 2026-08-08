-- Add fishing data columns to species table
alter table public.species
  add column max_weight_kg double precision,
  add column max_length_cm double precision,
  add column fishing_regions_es text,
  add column fishing_regions_en text,
  add column best_bait_es text,
  add column best_bait_en text;
