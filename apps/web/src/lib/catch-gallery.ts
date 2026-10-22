export type GalleryCatch = {
  id: string;
  species_id: number;
  species_name: string;
  catch_date: string;
  weight_kg: number | null;
  location_name: string | null;
};

export type GallerySort = "recent" | "heaviest";

const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** My-catches view: optional species chip, accent-insensitive search over species and place, then sort. */
export function filterGallery<T extends GalleryCatch>(
  list: T[],
  { query, speciesId, sort }: { query: string; speciesId: number | null; sort: GallerySort },
): T[] {
  const q = fold(query.trim());
  return list
    .filter((c) => speciesId === null || c.species_id === speciesId)
    .filter((c) => !q || fold(c.species_name).includes(q) || fold(c.location_name ?? "").includes(q))
    .sort((a, b) =>
      sort === "heaviest"
        ? (b.weight_kg ?? -1) - (a.weight_kg ?? -1) || b.catch_date.localeCompare(a.catch_date)
        : b.catch_date.localeCompare(a.catch_date),
    );
}

/** Species chips: one per caught species with its catch count, most caught first. */
export function speciesCounts(list: GalleryCatch[]): { id: number; name: string; count: number }[] {
  const counts = new Map<number, { id: number; name: string; count: number }>();
  for (const c of list) {
    const entry = counts.get(c.species_id) ?? { id: c.species_id, name: c.species_name, count: 0 };
    entry.count++;
    counts.set(c.species_id, entry);
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
