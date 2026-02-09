"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import TransactionForm from "@/components/TransactionForm";
import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "@/components/ui";

export default function TransactionNewClient() {
  const router = useRouter();
  const { add } = useTransactions();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">New transaction</h1>
        <Link href="/">
          <Button variant="secondary" type="button">
            Back
          </Button>
        </Link>
      </div>
      <TransactionForm
        submitLabel="Create"
        onSubmit={(input) => {
          const created = add(input);
          router.push(`/transactions/${created.id}`);
        }}
      />
    </div>
  );
}

