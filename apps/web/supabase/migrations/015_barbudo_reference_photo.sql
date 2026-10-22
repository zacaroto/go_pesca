-- Barbudo used a .gif thumbnail path that 014 did not match; use its full-size fishbase.de photo.
UPDATE public.species
SET reference_photo_url = 'https://www.fishbase.de/images/species/Rhgua_u0.jpg'
WHERE scientific_name = 'Rhamdia guatemalensis';
