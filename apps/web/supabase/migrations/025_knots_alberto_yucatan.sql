-- Two more braid-to-leader knots the founder uses a lot: Alberto and Yucatan. No free diagrams
-- exist on Wikimedia Commons, so they ship with steps only (image_url null).
insert into public.knots (slug, sort_order, name_es, name_en, summary_es, summary_en, best_for_es, best_for_en, difficulty, steps, sources) values
('alberto', 9, 'Alberto', 'Alberto knot',
 'Une trenzado con un líder de fluoro o mono; delgado, fuerte y pasa limpio por las guías.',
 'Joins braid to a fluoro or mono leader; slim, strong and runs cleanly through the guides.',
 'Trenzado a líder de fluorocarbono o monofilamento, sobre todo con líderes livianos y medianos en spinning y casting.',
 'Braid to a fluorocarbon or mono leader, especially light and medium leaders on spinning and casting gear.',
 2,
 '[
   {"text_es": "Dobla la punta del líder para formar un lazo y deja unos 15 cm de sobrante a lo largo del líder.", "text_en": "Double the end of the leader into a loop, leaving about 6 in (15 cm) of tag along the leader."},
   {"text_es": "Pasa unos 20 cm del trenzado por dentro del lazo del líder.", "text_en": "Pass about 8 in (20 cm) of braid through the leader loop."},
   {"text_es": "Enrolla el trenzado 7 a 10 veces sobre las dos líneas del líder, alejándote del lazo.", "text_en": "Wrap the braid 7 to 10 times around both strands of the leader, working away from the loop."},
   {"text_es": "Regresa enrollando la misma cantidad de vueltas hacia el lazo, encima de las primeras.", "text_en": "Wrap back toward the loop with the same number of turns, over the first ones."},
   {"text_es": "Saca el extremo del trenzado por el lazo, del mismo lado por donde entró.", "text_en": "Pass the braid tag back out through the loop on the same side it went in."},
   {"text_es": "Humedece el nudo y tira parejo de las cuatro puntas hasta que asiente; luego tira solo de las dos líneas principales.", "text_en": "Moisten the knot and pull all four ends evenly until it seats; then pull just the two main lines."},
   {"text_es": "Corta los sobrantes bien cerca del nudo.", "text_en": "Trim both tags close to the knot."}
 ]'::jsonb,
 array['https://www.wired2fish.com/fishing-knots/how-to-tie-the-alberto-knot', 'https://www.mercurymarine.com/ch/fr/dockline/how-to-tie-the-alberto-knot-with-george-gozdz', 'https://www.outdoorlife.com/fishing/alberto-knot', 'https://castandspear.com/alberto-knot/']),
('yucatan', 10, 'Yucatán', 'Yucatan knot',
 'Une el trenzado doblado con un líder grueso; rápido de hacer en el bote, ideal para altamar.',
 'Joins doubled braid to a heavy leader; quick to tie on the boat, great offshore.',
 'Trenzado doblado (con Bimini o a mano) a líderes de mono o fluoro medianos y gruesos en troleo y jigging.',
 'Doubled braid (Bimini or hand-doubled) to medium and heavy mono or fluoro leaders for trolling and jigging.',
 2,
 '[
   {"text_es": "Dobla el trenzado para tener una línea doble con lazo; un Bimini lo hace más seguro.", "text_en": "Double the braid to get a doubled line with a loop; a Bimini twist makes it more secure."},
   {"text_es": "Coloca el líder paralelo a la línea doble, con unos 20 cm de sobrante hacia el lazo.", "text_en": "Lay the leader alongside the doubled line, with about 8 in (20 cm) of tag toward the loop."},
   {"text_es": "Enrolla la línea doble alrededor del líder unas 6 a 10 veces, con vueltas parejas y apretadas.", "text_en": "Wrap the doubled line around the leader about 6 to 10 times, keeping the turns even and tight."},
   {"text_es": "Pasa el extremo del líder por dentro del lazo de la línea doble.", "text_en": "Pass the leader tag through the loop of the doubled line."},
   {"text_es": "Humedece y aprieta tirando a la vez de las líneas principales y los extremos, cuidando que el trenzado no se resbale.", "text_en": "Moisten and tighten by pulling the main lines and tags together, making sure the braid doesn''t slip."},
   {"text_es": "Corta los sobrantes; con trenzado muy delgado prueba el nudo antes de pescar, porque puede resbalar.", "text_en": "Trim the tags; with very thin braid test the knot before fishing, since it can slip."}
 ]'::jsonb,
 array['https://www.wired2fish.com/fishing-knots/how-to-tie-the-yucatan-knot/', 'https://fishtrack.com/article/how-to-tie-a-yucatan-knot', 'https://castandspear.com/yucatan-knot/'])
on conflict (slug) do update set sort_order = excluded.sort_order, name_es = excluded.name_es, name_en = excluded.name_en, summary_es = excluded.summary_es, summary_en = excluded.summary_en, best_for_es = excluded.best_for_es, best_for_en = excluded.best_for_en, difficulty = excluded.difficulty, steps = excluded.steps, sources = excluded.sources;
