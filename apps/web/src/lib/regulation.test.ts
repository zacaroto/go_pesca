import { describe, it, expect } from "vitest";
import { parseRegulation } from "@/lib/regulation";

describe("parseRegulation", () => {
  it("keeps the two known rules", () => {
    expect(parseRegulation("release")).toBe("release");
    expect(parseRegulation("regulated")).toBe("regulated");
  });
  it("treats null, missing and unknown values as no rule", () => {
    expect(parseRegulation(null)).toBeNull();
    expect(parseRegulation(undefined)).toBeNull();
    expect(parseRegulation("banned")).toBeNull();
  });
});
