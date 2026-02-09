import type { Transaction } from "@/lib/types";
import { getWeekDays } from "@/lib/week";

export type DailySeriesPoint = {
  day: string;
  incomeCents: number;
  expenseCents: number;
  netCents: number;
};

export function buildWeeklyDailySeries(
  transactions: Transaction[],
  weekStart: string
): DailySeriesPoint[] {
  const weekDays = getWeekDays(weekStart);
  const daySet = new Set(weekDays);
  const totals = new Map<string, { incomeCents: number; expenseCents: number }>();
  for (const day of weekDays) {
    totals.set(day, { incomeCents: 0, expenseCents: 0 });
  }

  for (const t of transactions) {
    if (!daySet.has(t.date)) continue;
    const current = totals.get(t.date);
    if (!current) continue;
    if (t.type === "income") current.incomeCents += t.amountCents;
    else current.expenseCents += t.amountCents;
  }

  return weekDays.map((day) => {
    const current = totals.get(day) ?? { incomeCents: 0, expenseCents: 0 };
    return {
      day,
      incomeCents: current.incomeCents,
      expenseCents: current.expenseCents,
      netCents: current.incomeCents - current.expenseCents
    };
  });
}
