"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Transaction, TransactionType } from "@/lib/types";
import {
  addTransaction,
  deleteTransaction,
  listTransactions,
  subscribeTransactionsChanged,
  updateTransaction
} from "@/lib/storage/transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isReady, setIsReady] = useState(false);

  const reload = useCallback(() => {
    setTransactions(listTransactions());
    setIsReady(true);
  }, []);

  useEffect(() => {
    reload();
    return subscribeTransactionsChanged(() => reload());
  }, [reload]);

  const add = useCallback(
    (input: {
      amountCents: number;
      date: string;
      type: TransactionType;
      category: string;
      note?: string;
    }) => {
      const created = addTransaction(input);
      setTransactions(listTransactions());
      return created;
    },
    []
  );

  const update = useCallback(
    (
      id: string,
      patch: Partial<Pick<Transaction, "amountCents" | "date" | "type" | "category" | "note">>
    ) => {
      const updated = updateTransaction(id, patch);
      setTransactions(listTransactions());
      return updated;
    },
    []
  );

  const remove = useCallback((id: string) => {
    const ok = deleteTransaction(id);
    setTransactions(listTransactions());
    return ok;
  }, []);

  const getById = useCallback(
    (id: string) => transactions.find((t) => t.id === id) ?? null,
    [transactions]
  );

  return useMemo(
    () => ({
      isReady,
      transactions,
      add,
      update,
      remove,
      getById,
      reload
    }),
    [isReady, transactions, add, update, remove, getById, reload]
  );
}

