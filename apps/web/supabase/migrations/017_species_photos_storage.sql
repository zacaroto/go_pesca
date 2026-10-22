-- Self-hosted species photos (Supabase Storage bucket "species") with attribution.
-- Upload the matching <slug>.jpg files to the bucket after running this.
-- CC BY / CC BY-SA photos require crediting the author; photo_credit + photo_source_url hold it.

insert into storage.buckets (id, name, public)
values ('species', 'species', true)
on conflict (id) do update set public = true;

alter table public.species add column if not exists photo_credit text;
alter table public.species add column if not exists photo_source_url text;

update public.species s
set reference_photo_url = v.url,
    photo_credit = v.credit,
    photo_source_url = v.source
from (values
  ('Istiophorus platypterus', 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/species/pez-vela.jpg', 'NOAA''s National Ocean Service · Public domain · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Fastest-fish.jpg'),
  ('Makaira nigricans', 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/species/marlin-azul.jpg', 'NOAA · Public domain · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Atlantic_blue_marlin.jpg'),
  ('Megalops atlanticus', 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/species/sabalo.jpg', 'Daiju Azuma · CC BY-SA 4.0 · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Megalops_atlanticus_by_DaijuAzuma.jpg'),
  ('Coryphaena hippurus', 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/species/dorado.jpg', 'Eduardo Lockwood Benet · CC BY-SA 3.0 · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Mahi-Mahi.jpg'),
  ('Parachromis dovii', 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/species/guapote.jpg', 'Sesamehoneytart · CC BY-SA 3.0 · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Parachromis_dovii_guapote.JPG'),
  ('Centropomus undecimalis', 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/species/robalo.jpg', 'Bob Care - Florida Keys NMS · Public domain · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Centropomus_undecimalis.jpg'),
  ('Lutjanus campechanus', 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/species/pargo-rojo.jpg', 'Geeklikepi · CC BY-SA 3.0 · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Red_Snapper.jpg'),
  ('Carcharhinus leucas', 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/species/tiburon-toro.jpg', 'João D''Andretta · CC BY 4.0 · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Bull_shark_(Carcharhinus_leucas).jpg'),
  ('Thunnus albacares', 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/species/atun-aleta-amarilla.jpg', 'OAR/National Undersea Research Program (NURP) · Public domain · Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Yellowfin_tuna_nurp.jpg')
) as v(scientific_name, url, credit, source)
where s.scientific_name = v.scientific_name;
