import { describe, expect, it } from "vitest";
import { addWeeksYMD, getISOWeekStart, getWeekDays, parseYMD } from "@/lib/week";

describe("week utilities", () => {
  it("computes ISO week start (Mon)", () => {
    // 2026-02-05 is a Thursday
    const weekStart = getISOWeekStart(new Date("2026-02-05T12:00:00"));
    expect(weekStart).toBe("2026-02-02");
  });

  it("lists 7 days from weekStart", () => {
    const days = getWeekDays("2026-02-02");
    expect(days).toHaveLength(7);
    expect(days[0]).toBe("2026-02-02");
    expect(days[6]).toBe("2026-02-08");
  });

  it("adds weeks correctly", () => {
    expect(addWeeksYMD("2026-02-02", 1)).toBe("2026-02-09");
    expect(addWeeksYMD("2026-02-02", -1)).toBe("2026-01-26");
  });

  it("parses YYYY-MM-DD as a real date", () => {
    const d = parseYMD("2026-02-05");
    expect(Number.isNaN(d.getTime())).toBe(false);
  });
});

