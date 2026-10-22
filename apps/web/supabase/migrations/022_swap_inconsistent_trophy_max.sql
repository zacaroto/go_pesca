-- Three species had a trophy threshold above their catalog maximum. Swap the inconsistent
-- dimension so max >= trophy, and rewrite the trophy notes to match the new figures.

-- Barbudo: weight and length both swapped.
update public.species
set max_weight_kg = 1.0, max_length_cm = 40,
    trophy_weight_kg = 0.3, trophy_length_cm = 25,
    trophy_note_es = 'Un barbudo de más de 0,3 kg (unos 25 cm) ya es un buen ejemplar; hay pocos datos y el valor es aproximado.',
    trophy_note_en = 'A catfish over 0.3 kg (about 25 cm) is already a good fish; data is scarce, so this is a rough value.'
where scientific_name = 'Rhamdia guatemalensis';

-- Corvina Aguada: weight and length both swapped.
update public.species
set max_weight_kg = 5.0, max_length_cm = 70,
    trophy_weight_kg = 2.5, trophy_length_cm = 64,
    trophy_note_es = 'Una corvina aguada de más de 2,5 kg (unos 64 cm) es grande; hay pocos datos y el valor es aproximado.',
    trophy_note_en = 'A corvina over 2.5 kg (about 64 cm) is large; evidence is thin, so this is a rough value.'
where scientific_name = 'Cynoscion squamipinnis';

-- Gaspar: only weight swapped (length was already consistent: max 125 cm, trophy 100 cm).
update public.species
set max_weight_kg = 5.0,
    trophy_weight_kg = 2.9,
    trophy_note_es = 'Un gaspar de más de 2,9 kg (cerca de 1 m) es un buen ejemplar; llega a más de 1,2 m, pero hay pocos datos.',
    trophy_note_en = 'A tropical gar over 2.9 kg (about 1 m) is a good fish; it can exceed 1.2 m, but data is thin.'
where scientific_name = 'Atractosteus tropicus';
