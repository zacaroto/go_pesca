import { describe, it, expect } from "vitest";
import { parseTheme } from "@/lib/theme";

describe("parseTheme", () => {
  it("keeps explicit choices", () => {
    expect(parseTheme("light")).toBe("light");
    expect(parseTheme("dark")).toBe("dark");
  });
  it("falls back to system for missing or unknown values", () => {
    expect(parseTheme(null)).toBe("system");
    expect(parseTheme(undefined)).toBe("system");
    expect(parseTheme("sepia")).toBe("system");
  });
});
