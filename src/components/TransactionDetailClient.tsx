"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Money from "@/components/Money";
import { useTransactions } from "@/hooks/useTransactions";
import { Button, Card } from "@/components/ui";
import { getISOWeekStart, parseYMD } from "@/lib/week";

export default function TransactionDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { transactions, remove, isReady } = useTransactions();

  const tx = useMemo(() => transactions.find((t) => t.id === id) ?? null, [transactions, id]);

  if (!isReady) return <div className="text-sm text-slate-600">Loading…</div>;

  if (!tx)
    return (
      <Card className="space-y-2">
        <div className="text-sm font-semibold">Transaction not found</div>
        <Link className="underline text-sm" href="/">
          Back to current week
        </Link>
      </Card>
    );

  const weekStart = getISOWeekStart(parseYMD(tx.date));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Transaction</h1>
        <div className="flex gap-2">
          <Link href={`/transactions/${id}/edit`}>
            <Button variant="secondary" type="button">
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            type="button"
            onClick={async () => {
              const ok = window.confirm("Delete this transaction? This cannot be undone.");
              if (!ok) return;
              const deleted = await remove(id);
              router.push(deleted ? `/week/${weekStart}` : "/");
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      <Card className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="text-sm font-semibold">{tx.category}</div>
          <div className={tx.type === "income" ? "text-sm font-semibold text-emerald-700" : "text-sm font-semibold text-rose-700"}>
            {tx.type === "income" ? "+" : "-"}
            <Money cents={tx.amountCents} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div>
            <div className="text-xs font-medium text-slate-500">Date</div>
            <div>{tx.date}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Type</div>
            <div className="capitalize">{tx.type}</div>
          </div>
          <div className="sm:col-span-2">
            <div className="text-xs font-medium text-slate-500">Note</div>
            <div className="whitespace-pre-wrap">{tx.note || "—"}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link className="underline text-sm" href={`/week/${weekStart}`}>
            Back to week
          </Link>
          <div className="text-xs text-slate-500">Updated {new Date(tx.updatedAt).toLocaleString()}</div>
        </div>
      </Card>
    </div>
  );
}

