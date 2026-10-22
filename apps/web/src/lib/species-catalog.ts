export type CatalogSpecies = {
  id: number;
  name_es: string;
  name_en: string;
  scientific_name: string;
  habitat: string;
  max_weight_kg: number | null;
  regulation?: string | null;
};

export type CatalogFilter = "all" | "saltwater" | "freshwater" | "brackish" | "release";
export type CatalogSort = "az" | "largest";

const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function matches(s: CatalogSpecies, filter: CatalogFilter): boolean {
  if (filter === "all") return true;
  if (filter === "release") return s.regulation === "release";
  return s.habitat === filter;
}

/** Catalog view: filter chip, accent-insensitive search over common and scientific names, then sort. */
export function filterCatalog<T extends CatalogSpecies>(
  list: T[],
  { query, filter, sort }: { query: string; filter: CatalogFilter; sort: CatalogSort },
  locale: string,
): T[] {
  const name = (s: T) => (locale === "en" ? s.name_en : s.name_es);
  const q = fold(query.trim());
  const collator = new Intl.Collator(locale, { sensitivity: "base" });
  return list
    .filter((s) => matches(s, filter))
    .filter((s) => !q || fold(name(s)).includes(q) || fold(s.scientific_name).includes(q))
    .sort((a, b) =>
      sort === "largest"
        ? (b.max_weight_kg ?? -1) - (a.max_weight_kg ?? -1) || collator.compare(name(a), name(b))
        : collator.compare(name(a), name(b)),
    );
}

export function catalogCounts(list: CatalogSpecies[]): Record<CatalogFilter, number> {
  const count = (f: CatalogFilter) => list.filter((s) => matches(s, f)).length;
  return {
    all: list.length,
    saltwater: count("saltwater"),
    freshwater: count("freshwater"),
    brackish: count("brackish"),
    release: count("release"),
  };
}
