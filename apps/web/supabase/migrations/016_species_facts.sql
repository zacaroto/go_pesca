-- Fun facts per species, bilingual, shown on the landing page, login and species views.
-- Several facts per species so the UI can rotate; source_url keeps each claim checkable.

create table public.species_facts (
  id uuid primary key default gen_random_uuid(),
  species_id int not null references public.species(id) on delete cascade,
  fact_es text not null,
  fact_en text not null,
  source_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz default now()
);

create index species_facts_species_id_idx on public.species_facts (species_id, sort_order);

alter table public.species_facts enable row level security;

-- Public read (the landing page is shown signed out), published facts only.
create policy "Anyone can view published species facts"
  on public.species_facts for select
  using (is_published = true);

create policy "Admins can view all species facts"
  on public.species_facts for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can insert species facts"
  on public.species_facts for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can update species facts"
  on public.species_facts for update
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can delete species facts"
  on public.species_facts for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Seed: two facts for each landing-page species, matched by scientific name.
insert into public.species_facts (species_id, fact_es, fact_en, source_url, sort_order)
select s.id, f.fact_es, f.fact_en, f.source_url, f.sort_order
from (values
  ('Istiophorus platypterus',
   'Cambia de color en segundos: al cazar enciende franjas azules en el cuerpo para desorientar a los cardúmenes.',
   'It changes color in seconds, lighting up blue stripes while hunting to confuse schools of fish.',
   'https://en.wikipedia.org/wiki/Sailfish', 1),
  ('Istiophorus platypterus',
   'Pliega su enorme aleta dorsal, la “vela”, dentro de una ranura del lomo para nadar más rápido.',
   'It folds its huge dorsal fin, the “sail”, into a groove along its back to swim faster.',
   'https://en.wikipedia.org/wiki/Sailfish', 2),
  ('Makaira nigricans',
   'Las hembras son mucho más grandes que los machos: pueden superar los 500 kg, mientras los machos rara vez pasan de 160 kg.',
   'Females are far larger than males: they can exceed 500 kg, while males rarely pass 160 kg.',
   'https://en.wikipedia.org/wiki/Atlantic_blue_marlin', 1),
  ('Makaira nigricans',
   'Usa su pico para golpear y aturdir a los peces de un cardumen antes de comérselos.',
   'It uses its bill to slash through schools and stun fish before eating them.',
   'https://en.wikipedia.org/wiki/Atlantic_blue_marlin', 2),
  ('Megalops atlanticus',
   'Puede respirar aire: sube a la superficie y traga aire, que absorbe con una vejiga natatoria que funciona como pulmón.',
   'It can breathe air, gulping it at the surface and absorbing it through a lung-like swim bladder.',
   'https://en.wikipedia.org/wiki/Atlantic_tarpon', 1),
  ('Megalops atlanticus',
   'Es muy longevo: puede vivir más de 50 años.',
   'It is long-lived and can reach more than 50 years of age.',
   'https://en.wikipedia.org/wiki/Atlantic_tarpon', 2),
  ('Coryphaena hippurus',
   'Crece muy rápido y vive poco: rara vez pasa de los 5 años.',
   'It grows very fast and lives short: it rarely reaches 5 years.',
   'https://en.wikipedia.org/wiki/Mahi-mahi', 1),
  ('Coryphaena hippurus',
   'Sus colores dorado, azul y verde se apagan en minutos al salir del agua.',
   'Its gold, blue and green colors fade within minutes once out of the water.',
   'https://en.wikipedia.org/wiki/Mahi-mahi', 2),
  ('Parachromis dovii',
   'Es uno de los cíclidos más grandes de Centroamérica: puede llegar a unos 70 cm.',
   'It is one of the largest cichlids in Central America, reaching about 70 cm.',
   'https://en.wikipedia.org/wiki/Parachromis_dovii', 1),
  ('Parachromis dovii',
   'Es un depredador: caza otros peces y defiende con fuerza su territorio y sus crías.',
   'It is a predator that hunts other fish and fiercely guards its territory and young.',
   'https://en.wikipedia.org/wiki/Parachromis_dovii', 2),
  ('Centropomus undecimalis',
   'Muchos nacen machos y se vuelven hembras al crecer.',
   'Many are born male and turn female as they grow.',
   'https://en.wikipedia.org/wiki/Common_snook', 1),
  ('Centropomus undecimalis',
   'La línea negra que recorre su cuerpo es su línea lateral, con la que siente las vibraciones del agua.',
   'The black stripe along its body is its lateral line, which senses vibrations in the water.',
   'https://en.wikipedia.org/wiki/Common_snook', 2),
  ('Lutjanus campechanus',
   'Puede vivir más de 50 años.',
   'It can live for more than 50 years.',
   'https://en.wikipedia.org/wiki/Northern_red_snapper', 1),
  ('Lutjanus campechanus',
   'De joven vive en fondos de arena y de adulto se muda a arrecifes y estructuras rocosas.',
   'Young fish live over sandy bottoms; adults move to reefs and rocky structures.',
   'https://en.wikipedia.org/wiki/Northern_red_snapper', 2),
  ('Carcharhinus leucas',
   'Puede vivir en agua dulce: sube por el río San Juan hasta el lago de Nicaragua.',
   'It can live in fresh water, swimming up the San Juan River into Lake Nicaragua.',
   'https://en.wikipedia.org/wiki/Bull_shark', 1),
  ('Carcharhinus leucas',
   'Sus riñones y una glándula especial regulan la sal de su cuerpo, por eso pasa del mar a los ríos.',
   'Its kidneys and a special gland regulate its salt balance, letting it move from sea to river.',
   'https://en.wikipedia.org/wiki/Bull_shark', 2),
  ('Thunnus albacares',
   'Nunca deja de nadar: necesita moverse para que el agua pase por sus branquias.',
   'It never stops swimming: it needs to move so water flows over its gills.',
   'https://en.wikipedia.org/wiki/Yellowfin_tuna', 1),
  ('Thunnus albacares',
   'Puede pasar de los 180 kg.',
   'It can exceed 180 kg.',
   'https://en.wikipedia.org/wiki/Yellowfin_tuna', 2)
) as f(scientific_name, fact_es, fact_en, source_url, sort_order)
join public.species s on s.scientific_name = f.scientific_name;
