export const REGIONS = [
  "pacific",
  "caribbean",
  "centralValley",
  "northernPlains",
  "southPacific",
] as const;

export type Region = (typeof REGIONS)[number];

export const FISHING_TAGS = [
  "shore",
  "kayak",
  "offshore",
  "fly",
  "river",
  "lake",
  "spearfishing",
] as const;

export type FishingTag = (typeof FISHING_TAGS)[number];

export const HABITATS = ["freshwater", "saltwater", "brackish"] as const;

export type Habitat = (typeof HABITATS)[number];
