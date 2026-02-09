"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import TransactionForm from "@/components/TransactionForm";
import { useTransactions } from "@/hooks/useTransactions";
import { Button, Card } from "@/components/ui";

export default function TransactionEditClient({ id }: { id: string }) {
  const router = useRouter();
  const { transactions, update, isReady } = useTransactions();

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Edit transaction</h1>
        <Link href={`/transactions/${id}`}>
          <Button variant="secondary" type="button">
            Cancel
          </Button>
        </Link>
      </div>
      <TransactionForm
        initial={tx}
        submitLabel="Save"
        onSubmit={(input) => {
          update(id, input);
          router.push(`/transactions/${id}`);
        }}
      />
    </div>
  );
}

