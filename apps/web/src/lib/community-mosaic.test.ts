import { describe, it, expect } from "vitest";
import { pickFeatured, computeRecords, relativeDate } from "@/lib/community-mosaic";
import type { FeedCatch, FeedReactions } from "@/lib/feed";

const now = new Date("2026-10-21T12:00:00Z");
const f = (id: string, species_name: string, catch_date: string, weight_kg: number | null): FeedCatch => ({
  id, user_id: "u", photo_url: "", species_name, display_name: "", avatar_url: null,
  location_name: null, catch_date, created_at: `${catch_date}T10:00:00Z`, weight_kg, habitat: null,
});
const r = (n: number): FeedReactions => ({ counts: { fish: n, fire: 0, trophy: 0, wow: 0, respect: 0 }, userReaction: null });

describe("pickFeatured", () => {
  it("picks the most-reacted catch from the last 7 days", () => {
    const list = [f("a", "Dorado", "2026-10-20", 8), f("b", "Pargo", "2026-10-18", 3), f("c", "Wahoo", "2026-10-01", 14)];
    const out = pickFeatured(list, { a: r(2), b: r(9), c: r(40) }, now);
    expect(out.featured?.id).toBe("b");
    expect(out.rest.map((x) => x.id)).toEqual(["a", "c"]);
  });
  it("falls back to the first catch when none are recent", () => {
    const list = [f("x", "Dorado", "2026-09-01", 8), f("y", "Pargo", "2026-08-01", 3)];
    expect(pickFeatured(list, {}, now).featured?.id).toBe("x");
  });
  it("handles an empty feed", () => {
    expect(pickFeatured([], {}, now)).toEqual({ featured: null, rest: [] });
  });
});

describe("computeRecords", () => {
  it("finds this month's heaviest, top species and last-7-days count", () => {
    const list = [
      f("a", "Dorado", "2026-10-20", 8.4), f("b", "Dorado", "2026-10-05", 6),
      f("c", "Sábalo", "2026-10-02", 31), f("d", "Marlín", "2026-09-28", 90),
    ];
    const out = computeRecords(list, now);
    expect(out.heaviest?.id).toBe("c");
    expect(out.topSpecies).toEqual({ name: "Dorado", count: 2 });
    expect(out.weekCount).toBe(1);
  });
  it("returns nulls and zero with no data", () => {
    expect(computeRecords([], now)).toEqual({ heaviest: null, topSpecies: null, weekCount: 0 });
  });
});

describe("relativeDate", () => {
  const t = (key: string, values?: Record<string, string | number>) =>
    values ? `${key}:${JSON.stringify(values)}` : key;
  it("says today, yesterday and N days ago through t()", () => {
    expect(relativeDate("2026-10-21", now, "es", t)).toBe("today");
    expect(relativeDate("2026-10-20", now, "es", t)).toBe("yesterday");
    expect(relativeDate("2026-10-17", now, "es", t)).toBe('daysAgo:{"count":4}');
  });
  it("falls back to a localized short date after a week", () => {
    expect(relativeDate("2026-10-01", now, "en", t)).toBe("Oct 1");
  });
});
