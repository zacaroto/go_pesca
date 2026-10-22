-- Four achievements tied to newer features: trophy thresholds, catch-and-release rules and Aprender.
-- icon is legacy (the app draws its own line icons); kept non-empty for the not-null column.
insert into achievement_definitions (id, icon, sort_order) values
  ('trophy_catch',  'trophy',  10),
  ('release_catch', 'release', 11),
  ('guides_5',      'book',    12),
  ('knots_5',       'knot',    13)
on conflict (id) do nothing;
