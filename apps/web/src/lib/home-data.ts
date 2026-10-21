export type HomeCatch = {
  id: string;
  species_id: number;
  species_name: string;
  scientific_name: string;
  habitat: string | null;
  description: string | null;
  reference_photo_url: string | null;
  photo_url: string;
  catch_date: string;
  location_name: string | null;
  weight_kg: number | null;
  length_cm: number | null;
  bait_lure: string | null;
};

export function pickLatestNewSpecies(catches: HomeCatch[]): HomeCatch | null {
  const chronological = [...catches].sort((a, b) => a.catch_date.localeCompare(b.catch_date));
  const seen = new Set<number>();
  let latest: HomeCatch | null = null;
  for (const entry of chronological) {
    if (seen.has(entry.species_id)) continue;
    seen.add(entry.species_id);
    latest = entry;
  }
  return latest;
}
