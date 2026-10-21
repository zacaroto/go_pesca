import type { PokedexEntry } from "./pokedex";

export type Habitat = "saltwater" | "freshwater" | "brackish";
export type HabitatFilter = Habitat | "all";
export type IndexSection = { letter: string; entries: PokedexEntry[] };

const FOLD: Record<string, string> = { Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U", Ü: "U" };

export function speciesName(e: Pick<PokedexEntry, "name_es" | "name_en">, locale: string): string {
  return locale === "en" ? e.name_en : e.name_es;
}

export function buildSpeciesIndex(entries: PokedexEntry[], locale: string, habitat: HabitatFilter): IndexSection[] {
  const collator = new Intl.Collator(locale, { sensitivity: "base" });
  const sorted = entries
    .filter((e) => habitat === "all" || e.habitat === habitat)
    .sort((a, b) => collator.compare(speciesName(a, locale), speciesName(b, locale)));

  const sections: IndexSection[] = [];
  for (const entry of sorted) {
    const first = speciesName(entry, locale).charAt(0).toUpperCase();
    const letter = FOLD[first] ?? first;
    const last = sections[sections.length - 1];
    if (last && last.letter === letter) last.entries.push(entry);
    else sections.push({ letter, entries: [entry] });
  }
  return sections;
}

export function countByHabitat(entries: PokedexEntry[]): Record<Habitat, { caught: number; total: number }> {
  const out: Record<Habitat, { caught: number; total: number }> = {
    saltwater: { caught: 0, total: 0 },
    freshwater: { caught: 0, total: 0 },
    brackish: { caught: 0, total: 0 },
  };
  for (const e of entries) {
    const bucket = out[e.habitat as Habitat];
    if (!bucket) continue;
    bucket.total++;
    if (e.catch_count > 0) bucket.caught++;
  }
  return out;
}

/** Running best weight: non-positive or missing weights never count. */
export function nextBestWeight(prev: number | null, weight: number | null | undefined): number | null {
  const w = weight != null && weight > 0 ? weight : null;
  if (w == null) return prev;
  return prev == null ? w : Math.max(prev, w);
}
