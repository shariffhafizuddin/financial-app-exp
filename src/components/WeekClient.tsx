"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { addWeeksYMD, getISOWeekStart, getWeekDays, parseYMD } from "@/lib/week";
import Money from "@/components/Money";
import { Button, Card } from "@/components/ui";
import type { Transaction } from "@/lib/types";

function totals(transactions: Transaction[]) {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (t.type === "income") income += t.amountCents;
    else expense += t.amountCents;
  }
  return { income, expense, net: income - expense };
}

export default function WeekClient({ weekStart }: { weekStart: string }) {
  const { transactions, isReady } = useTransactions();

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const daySet = useMemo(() => new Set(weekDays), [weekDays]);

  const weekTransactions = useMemo(
    () => transactions.filter((t) => daySet.has(t.date)),
    [transactions, daySet]
  );

  const byDay = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const day of weekDays) map.set(day, []);
    for (const t of weekTransactions) map.get(t.date)?.push(t);
    return map;
  }, [weekDays, weekTransactions]);

  const { income, expense, net } = useMemo(() => totals(weekTransactions), [weekTransactions]);

  const prevWeek = addWeeksYMD(weekStart, -1);
  const nextWeek = addWeeksYMD(weekStart, 1);
  const todayWeekStart = getISOWeekStart(new Date());

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Week of {weekStart}</h1>
          <div className="text-sm text-slate-600">ISO week (Mon–Sun)</div>
        </div>
        <div className="flex gap-2">
          <Link href={`/week/${prevWeek}`}>
            <Button variant="secondary" type="button">
              Prev
            </Button>
          </Link>
          <Link href={`/week/${nextWeek}`}>
            <Button variant="secondary" type="button">
              Next
            </Button>
          </Link>
          <Link href="/transactions/new">
            <Button type="button">Add</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <div className="text-xs font-medium uppercase text-slate-500">Income</div>
          <div className="mt-1 text-lg font-semibold text-emerald-700">
            <Money cents={income} />
          </div>
        </Card>
        <Card>
          <div className="text-xs font-medium uppercase text-slate-500">Expenses</div>
          <div className="mt-1 text-lg font-semibold text-rose-700">
            <Money cents={expense} />
          </div>
        </Card>
        <Card>
          <div className="text-xs font-medium uppercase text-slate-500">Net</div>
          <div className="mt-1 text-lg font-semibold">
            <Money cents={net} />
          </div>
        </Card>
      </div>

      {!isReady ? (
        <div className="text-sm text-slate-600">Loading transactions…</div>
      ) : weekTransactions.length === 0 ? (
        <Card className="text-sm text-slate-600">
          No transactions for this week.{" "}
          <Link className="underline" href="/transactions/new">
            Add one
          </Link>
          .{" "}
          {weekStart !== todayWeekStart ? (
            <Link className="underline" href={`/week/${todayWeekStart}`}>
              Jump to current week
            </Link>
          ) : null}
        </Card>
      ) : (
        <div className="space-y-3">
          {weekDays.map((day) => {
            const list = byDay.get(day) ?? [];
            if (list.length === 0) return null;
            const label = parseYMD(day).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short"
            });

            return (
              <Card key={day}>
                <div className="mb-3 flex items-baseline justify-between">
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-xs text-slate-500">{day}</div>
                </div>
                <div className="divide-y divide-slate-100">
                  {list.map((t) => (
                    <Link
                      key={t.id}
                      href={`/transactions/${t.id}`}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{t.category}</div>
                        {t.note ? <div className="truncate text-xs text-slate-500">{t.note}</div> : null}
                      </div>
                      <div
                        className={
                          t.type === "income"
                            ? "shrink-0 text-sm font-semibold text-emerald-700"
                            : "shrink-0 text-sm font-semibold text-rose-700"
                        }
                      >
                        {t.type === "income" ? "+" : "-"}
                        <Money cents={t.amountCents} />
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

