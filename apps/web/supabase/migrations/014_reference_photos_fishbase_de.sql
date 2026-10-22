-- www.fishbase.se stopped responding (requests time out), so every species reference photo
-- failed to load. Point them at the fishbase.de mirror, and at the full-size species image
-- instead of the 211x134 thumbnail. All 39 distinct images were checked to return 200 on .de.
--
-- Revert:
--   UPDATE public.species
--   SET reference_photo_url = regexp_replace(reference_photo_url,
--     '^https://www\.fishbase\.de/images/species/', 'https://www.fishbase.se/images/thumbnails/jpg/tn_')
--   WHERE reference_photo_url LIKE 'https://www.fishbase.de/images/species/%';

UPDATE public.species
SET reference_photo_url = regexp_replace(
  reference_photo_url,
  '^https://www\.fishbase\.se/images/thumbnails/jpg/tn_',
  'https://www.fishbase.de/images/species/'
)
WHERE reference_photo_url LIKE 'https://www.fishbase.se/images/thumbnails/jpg/tn\_%';
