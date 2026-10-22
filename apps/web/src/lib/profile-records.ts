export type RecordCatch = {
  id: string;
  species_id: number;
  weight_kg: number | null;
  length_cm: number | null;
  catch_date: string;
};

export type RecordSpecies = {
  id: number;
  name: string;
  trophy_weight_kg: number | null;
  trophy_length_cm: number | null;
};

export type PersonalRecord = {
  catchId: string;
  speciesId: number;
  speciesName: string;
  weightKg: number | null;
  lengthCm: number | null;
  catchDate: string;
  trophy: boolean;
};

type Measured = { weight_kg: number | null; length_cm: number | null };

/** A catch is a trophy when it reaches its species' weight or length threshold. */
export function isTrophy(c: Measured, species: Pick<RecordSpecies, "trophy_weight_kg" | "trophy_length_cm"> | undefined): boolean {
  if (!species) return false;
  const byWeight = species.trophy_weight_kg != null && c.weight_kg != null && c.weight_kg >= species.trophy_weight_kg;
  const byLength = species.trophy_length_cm != null && c.length_cm != null && c.length_cm >= species.trophy_length_cm;
  return byWeight || byLength;
}

/** True when `a` is a better catch than `b`: heavier wins; length breaks ties and ranks catches never weighed. */
export function isBetterCatch(a: Measured, b: Measured): boolean {
  const aw = a.weight_kg ?? -1;
  const bw = b.weight_kg ?? -1;
  if (aw !== bw) return aw > bw;
  return (a.length_cm ?? -1) > (b.length_cm ?? -1);
}

/** Best catch per species, trophies first, then by weight. Catches of unknown species are skipped. */
export function personalRecords(catches: RecordCatch[], species: RecordSpecies[]): PersonalRecord[] {
  const byId = new Map(species.map((s) => [s.id, s]));
  const best = new Map<number, RecordCatch>();
  for (const c of catches) {
    if (!byId.has(c.species_id)) continue;
    const current = best.get(c.species_id);
    if (!current || isBetterCatch(c, current)) best.set(c.species_id, c);
  }
  const records = [...best.values()].map((c) => {
    const s = byId.get(c.species_id)!;
    return {
      catchId: c.id,
      speciesId: s.id,
      speciesName: s.name,
      weightKg: c.weight_kg,
      lengthCm: c.length_cm,
      catchDate: c.catch_date,
      trophy: isTrophy(c, s),
    };
  });
  return records.sort(
    (a, b) => Number(b.trophy) - Number(a.trophy) || (b.weightKg ?? -1) - (a.weightKg ?? -1) || (b.lengthCm ?? -1) - (a.lengthCm ?? -1),
  );
}
