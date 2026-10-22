-- Barbudo (Rhamdia guatemalensis): self-hosted photo in the "species" bucket.
-- Supersedes 015 (fishbase links are unreliable). No free photo of R. guatemalensis exists on
-- Wikimedia Commons, so this is its close congener Rhamdia quelen; the credit says so.
-- Upload barbudo.jpg to the bucket root after running this.
update public.species
set reference_photo_url = 'https://qqorufwncknnszrzyvsi.supabase.co/storage/v1/object/public/species/barbudo.jpg',
    photo_credit = 'Deftiks · CC BY-SA 4.0 · Wikimedia Commons (Rhamdia quelen)',
    photo_source_url = 'https://commons.wikimedia.org/wiki/File:Rhamdia_quelen,_florida.jpg'
where scientific_name = 'Rhamdia guatemalensis';
