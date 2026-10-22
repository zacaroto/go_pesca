-- Shorter billfish notes: the card's headline already says release is mandatory in the Pacific,
-- so the note only explains how and where.
update public.species
set regulation_note_es = 'Libéralo sin sacarlo del agua, cortando la línea cerca del anzuelo. No lo subas a la borda para fotos ni uses bichero. Aplica en los golfos y las primeras 30 millas (AJDIP/280-2014 de INCOPESCA, arts. 6 y 7).',
    regulation_note_en = 'Release it without lifting it from the water, cutting the line near the hook. Do not bring it on board for photos or use a gaff. Applies in the gulfs and the first 30 nautical miles (INCOPESCA AJDIP/280-2014, arts. 6 and 7).'
where regulation = 'release';
