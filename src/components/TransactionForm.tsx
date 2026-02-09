"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { Transaction, TransactionType } from "@/lib/types";
import { parseAmountToCents } from "@/lib/money";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import { formatYMD } from "@/lib/week";

export default function TransactionForm({
  initial,
  submitLabel,
  onSubmit
}: {
  initial?: Partial<Pick<Transaction, "amountCents" | "date" | "type" | "category" | "note">>;
  submitLabel: string;
  onSubmit: (input: {
    amountCents: number;
    date: string;
    type: TransactionType;
    category: string;
    note: string;
  }) => void;
}) {
  const defaultDate = useMemo(() => formatYMD(new Date()), []);
  const [amount, setAmount] = useState(() => {
    if (typeof initial?.amountCents === "number") return (initial.amountCents / 100).toFixed(2);
    return "";
  });
  const [date, setDate] = useState(initial?.date ?? defaultDate);
  const [type, setType] = useState<TransactionType>(initial?.type ?? "expense");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const amountCents = parseAmountToCents(amount);
    if (!amountCents || amountCents <= 0) return setError("Amount must be greater than 0.");
    if (!date) return setError("Date is required.");
    if (!category.trim()) return setError("Category is required.");

    setError(null);
    onSubmit({
      amountCents,
      date,
      type,
      category: category.trim(),
      note: note.trim()
    });
  }

  return (
    <Card>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <div className="mb-1 text-xs font-medium text-slate-600">Amount (RM)</div>
            <Input
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label className="block">
            <div className="mb-1 text-xs font-medium text-slate-600">Date</div>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <div className="mb-1 text-xs font-medium text-slate-600">Type</div>
            <Select value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
          </label>
          <label className="block">
            <div className="mb-1 text-xs font-medium text-slate-600">Category</div>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Groceries" />
          </label>
        </div>

        <label className="block">
          <div className="mb-1 text-xs font-medium text-slate-600">Note</div>
          <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
        </label>

        {error ? <div className="text-sm text-rose-700">{error}</div> : null}

        <div className="flex justify-end gap-2">
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Card>
  );
}
