"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { addWeeksYMD, getISOWeekStart } from "@/lib/week";
import { buildWeeklyDailySeries } from "@/lib/insights/weekSeries";
import Money from "@/components/Money";
import { Button, Card } from "@/components/ui";
import PurpleWeeklyChart from "@/components/PurpleWeeklyChart";

export default function InsightsWeekClient({ weekStart }: { weekStart: string }) {
  const { transactions, isReady } = useTransactions();

  const points = useMemo(() => buildWeeklyDailySeries(transactions, weekStart), [transactions, weekStart]);
  const totals = useMemo(() => {
    return points.reduce(
      (acc, p) => {
        acc.incomeCents += p.incomeCents;
        acc.expenseCents += p.expenseCents;
        return acc;
      },
      { incomeCents: 0, expenseCents: 0 }
    );
  }, [points]);

  const prevWeek = addWeeksYMD(weekStart, -1);
  const nextWeek = addWeeksYMD(weekStart, 1);
  const todayWeekStart = getISOWeekStart(new Date());

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Insights — Week of {weekStart}</h1>
          <div className="text-sm text-slate-600">Daily totals (Mon–Sun)</div>
        </div>
        <div className="flex gap-2">
          <Link href={`/insights/${prevWeek}`}>
            <Button variant="secondary" type="button">
              Prev
            </Button>
          </Link>
          <Link href={`/insights/${nextWeek}`}>
            <Button variant="secondary" type="button">
              Next
            </Button>
          </Link>
          {weekStart !== todayWeekStart ? (
            <Link href={`/insights/${todayWeekStart}`}>
              <Button type="button">Current</Button>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card>
          <div className="text-xs font-medium uppercase text-slate-500">Income</div>
          <div className="mt-1 text-lg font-semibold text-emerald-700">
            <Money cents={totals.incomeCents} />
          </div>
        </Card>
        <Card>
          <div className="text-xs font-medium uppercase text-slate-500">Expenses</div>
          <div className="mt-1 text-lg font-semibold text-rose-700">
            <Money cents={totals.expenseCents} />
          </div>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Income vs Expenses</div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-violet-600" />
              Income
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              Expenses
            </div>
          </div>
        </div>

        {!isReady ? (
          <div className="text-sm text-slate-600">Loading transactions…</div>
        ) : (
          <PurpleWeeklyChart points={points} />
        )}
      </Card>
    </div>
  );
}
