import { describe, it, expect } from "vitest";
import { parseInviteCode, summarizeGroup, type OverviewCatch } from "@/lib/group-overview";

const now = new Date("2026-10-21T18:00:00Z");
const c = (id: string, user_id: string, created_at: string, photo_url: string | null = `https://x/${id}.jpg`): OverviewCatch => ({
  id,
  user_id,
  photo_url,
  species_name: "Róbalo",
  weight_kg: 6.2,
  catch_date: created_at.slice(0, 10),
  created_at,
  display_name: user_id,
});

describe("summarizeGroup", () => {
  const catches = [
    c("1", "ana", "2026-10-20T12:00:00Z"),
    c("2", "out", "2026-10-19T12:00:00Z"),
    c("3", "ben", "2026-10-18T12:00:00Z", null),
    c("4", "ana", "2026-10-10T12:00:00Z"),
    c("5", "ben", "2026-10-01T12:00:00Z"),
  ];
  it("keeps only members' catches, up to 3 photos, newest first", () => {
    const s = summarizeGroup(new Set(["ana", "ben"]), catches, now);
    expect(s.photos).toEqual(["https://x/1.jpg", "https://x/4.jpg", "https://x/5.jpg"]);
    expect(s.latest?.id).toBe("1");
  });
  it("counts the last 7 days", () => {
    expect(summarizeGroup(new Set(["ana", "ben"]), catches, now).newThisWeek).toBe(2);
  });
  it("is empty for a quiet group", () => {
    expect(summarizeGroup(new Set(["zoe"]), catches, now)).toEqual({ photos: [], latest: null, newThisWeek: 0 });
  });
});

describe("parseInviteCode", () => {
  it("reads a bare code or a full invite link", () => {
    expect(parseInviteCode("  aB3x9k ")).toBe("aB3x9k");
    expect(parseInviteCode("https://gopesca.app/es/groups/join/aB3x9k")).toBe("aB3x9k");
  });
  it("rejects empty or junk input", () => {
    expect(parseInviteCode("")).toBeNull();
    expect(parseInviteCode("no es un código")).toBeNull();
  });
});
