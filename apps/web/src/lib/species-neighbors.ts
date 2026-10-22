export type SpeciesLink = { id: number; name: string };

/**
 * Previous and next species in catalog order (alphabetical by localized name, like /species),
 * wrapping around at both ends. Null when the species is not in the list or is the only one.
 */
export function speciesNeighbors(
  list: SpeciesLink[],
  currentId: number,
  locale: string,
): { prev: SpeciesLink; next: SpeciesLink } | null {
  const collator = new Intl.Collator(locale, { sensitivity: "base" });
  const sorted = [...list].sort((a, b) => collator.compare(a.name, b.name));
  const i = sorted.findIndex((s) => s.id === currentId);
  if (i === -1 || sorted.length < 2) return null;
  return {
    prev: sorted[(i - 1 + sorted.length) % sorted.length],
    next: sorted[(i + 1) % sorted.length],
  };
}
