export type FeaturedSpecies = {
  id: number;
  name: string;
  scientificName: string;
  photoUrl: string | null;
  facts: string[];
};

export type FactRow = {
  fact_es: string;
  fact_en: string;
  sort_order: number;
  species: {
    id: number;
    name_es: string;
    name_en: string;
    scientific_name: string;
    reference_photo_url: string | null;
  } | null;
};

/** Groups fact rows into one entry per species (first-seen order), facts sorted by sort_order. */
export function groupFacts(rows: FactRow[], locale: string): FeaturedSpecies[] {
  const bySpecies = new Map<number, { entry: FeaturedSpecies; facts: { order: number; text: string }[] }>();
  for (const row of rows) {
    if (!row.species) continue;
    const s = row.species;
    let group = bySpecies.get(s.id);
    if (!group) {
      group = {
        entry: {
          id: s.id,
          name: locale === "en" ? s.name_en : s.name_es,
          scientificName: s.scientific_name,
          photoUrl: s.reference_photo_url,
          facts: [],
        },
        facts: [],
      };
      bySpecies.set(s.id, group);
    }
    group.facts.push({ order: row.sort_order, text: locale === "en" ? row.fact_en : row.fact_es });
  }
  return [...bySpecies.values()].map(({ entry, facts }) => ({
    ...entry,
    facts: facts.sort((a, b) => a.order - b.order).map((f) => f.text),
  }));
}
