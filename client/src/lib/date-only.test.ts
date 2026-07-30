import { describe, expect, it } from "vitest";
import { isDateOnlyOnOrAfter } from "./date-only";

describe("date-only comparisons", () => {
  it("keeps a service upcoming for its complete local calendar date", () => {
    expect(isDateOnlyOnOrAfter("2026-07-30T00:00:00.000Z", "2026-07-30")).toBe(true);
  });

  it("moves a service to the past only after its calendar date", () => {
    expect(isDateOnlyOnOrAfter("2026-07-29T00:00:00.000Z", "2026-07-30")).toBe(false);
  });
});
