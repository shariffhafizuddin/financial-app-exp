import { describe, expect, it } from "vitest";
import type { Transaction } from "@/lib/types";
import { buildWeeklyDailySeries } from "@/lib/insights/weekSeries";

function tx(overrides: Partial<Transaction>): Transaction {
  return {
    id: overrides.id ?? "t1",
    amountCents: overrides.amountCents ?? 100,
    date: overrides.date ?? "2026-02-02",
    type: overrides.type ?? "expense",
    category: overrides.category ?? "Misc",
    note: overrides.note ?? "",
    createdAt: overrides.createdAt ?? "2026-02-02T10:00:00.000Z",
    updatedAt: overrides.updatedAt ?? "2026-02-02T10:00:00.000Z"
  };
}

describe("buildWeeklyDailySeries", () => {
  it("returns seven days for week start", () => {
    const series = buildWeeklyDailySeries([], "2026-02-02");
    expect(series).toHaveLength(7);
    expect(series[0]?.day).toBe("2026-02-02");
    expect(series[6]?.day).toBe("2026-02-08");
  });

  it("sums income and expense per day", () => {
    const series = buildWeeklyDailySeries(
      [
        tx({ id: "a", date: "2026-02-03", type: "income", amountCents: 500 }),
        tx({ id: "b", date: "2026-02-03", type: "expense", amountCents: 200 }),
        tx({ id: "c", date: "2026-02-03", type: "expense", amountCents: 300 })
      ],
      "2026-02-02"
    );

    const day = series.find((d) => d.day === "2026-02-03");
    expect(day?.incomeCents).toBe(500);
    expect(day?.expenseCents).toBe(500);
    expect(day?.netCents).toBe(0);
  });

  it("fills missing days with zeros", () => {
    const series = buildWeeklyDailySeries([tx({ date: "2026-02-06", amountCents: 120 })], "2026-02-02");
    const emptyDay = series.find((d) => d.day === "2026-02-04");
    expect(emptyDay?.incomeCents).toBe(0);
    expect(emptyDay?.expenseCents).toBe(0);
    expect(emptyDay?.netCents).toBe(0);
  });

  it("ignores transactions outside the week", () => {
    const series = buildWeeklyDailySeries(
      [
        tx({ id: "a", date: "2026-01-31", type: "income", amountCents: 900 }),
        tx({ id: "b", date: "2026-02-02", type: "income", amountCents: 300 })
      ],
      "2026-02-02"
    );

    const day = series.find((d) => d.day === "2026-02-02");
    expect(day?.incomeCents).toBe(300);
  });
});
