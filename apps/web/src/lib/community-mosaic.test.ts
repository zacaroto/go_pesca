import { describe, it, expect } from "vitest";
import { pickFeatured, communityWindows, tallyTopSpecies, relativeDate } from "@/lib/community-mosaic";
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
  it("uses the Costa Rica day for the 7-day window", () => {
    // 23:30 on Oct 21 in CR (05:30Z on the 22nd): Oct 14 is 7 days back (recent), Oct 13 is 8 (not)
    const late = new Date("2026-10-22T05:30:00Z");
    const list = [f("old", "Pargo", "2026-10-13", 3), f("edge", "Dorado", "2026-10-14", 8)];
    expect(pickFeatured(list, { old: r(50), edge: r(1) }, late).featured?.id).toBe("edge");
  });
  it("handles an empty feed", () => {
    expect(pickFeatured([], {}, now)).toEqual({ featured: null, rest: [] });
  });
});

describe("communityWindows", () => {
  it("uses the Costa Rica month on the last evening of October", () => {
    const w = communityWindows(new Date("2026-10-31T23:30:00-06:00"));
    expect(w).toMatchObject({ today: "2026-10-31", monthStart: "2026-10-01", nextMonthStart: "2026-11-01" });
  });
  it("stays on Oct 31 when UTC has already rolled to November", () => {
    const w = communityWindows(new Date("2026-11-01T05:30:00Z"));
    expect(w.today).toBe("2026-10-31");
    expect(w.monthStart).toBe("2026-10-01");
  });
  it("rolls the year over in December", () => {
    const w = communityWindows(new Date("2026-12-15T12:00:00Z"));
    expect(w.monthStart).toBe("2026-12-01");
    expect(w.nextMonthStart).toBe("2027-01-01");
  });
  it("starts the 7-day window 6 days back, across a month boundary", () => {
    expect(communityWindows(new Date("2026-11-03T12:00:00Z")).weekStart).toBe("2026-10-28");
    expect(communityWindows(new Date("2026-10-21T12:00:00Z")).weekStart).toBe("2026-10-15");
  });
});

describe("tallyTopSpecies", () => {
  it("returns the most frequent species", () => {
    const rows = [{ species_name: "Dorado" }, { species_name: "Pargo" }, { species_name: "Dorado" }];
    expect(tallyTopSpecies(rows)).toEqual({ name: "Dorado", count: 2 });
  });
  it("breaks ties alphabetically", () => {
    const rows = [{ species_name: "Wahoo" }, { species_name: "Dorado" }, { species_name: "Wahoo" }, { species_name: "Dorado" }];
    expect(tallyTopSpecies(rows)).toEqual({ name: "Dorado", count: 2 });
  });
  it("returns null with no rows", () => {
    expect(tallyTopSpecies([])).toBeNull();
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
  it("uses calendar days in Costa Rica time, not UTC", () => {
    expect(relativeDate("2026-10-21", new Date("2026-10-22T05:30:00Z"), "es", t)).toBe("today");
    expect(relativeDate("2026-10-20", new Date("2026-10-21T06:10:00Z"), "es", t)).toBe("yesterday");
  });
  it("falls back to a localized short date after a week", () => {
    expect(relativeDate("2026-10-01", now, "en", t)).toBe("Oct 1");
  });
});
