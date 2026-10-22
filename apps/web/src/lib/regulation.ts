/** Costa Rican sport-fishing rule for a species: must be released, or kept under legal limits. */
export type Regulation = "release" | "regulated";

/** Narrows the raw `species.regulation` column; anything else means no specific rule. */
export function parseRegulation(value: unknown): Regulation | null {
  return value === "release" || value === "regulated" ? value : null;
}
