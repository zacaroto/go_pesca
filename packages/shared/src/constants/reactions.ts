export const REACTION_TYPES = ["fish", "fire", "trophy", "wow", "respect"] as const;

export type ReactionType = (typeof REACTION_TYPES)[number];

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  fish: "\ud83d\udc1f",
  fire: "\ud83d\udd25",
  trophy: "\ud83c\udfc6",
  wow: "\ud83d\ude2e",
  respect: "\ud83c\udfa3",
};
