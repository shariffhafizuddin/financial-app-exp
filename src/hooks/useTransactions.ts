"use client";

import { useCallback, useMemo } from "react";
import type { Transaction, TransactionType } from "@/lib/types";
import { useVault } from "./useVault";

export function useTransactions() {
  const { appState, updateState, isInitialized } = useVault();

  const transactions = useMemo(() => appState?.transactions ?? [], [appState]);

  const add = useCallback(
    async (input: {
      amountCents: number;
      date: string;
      type: TransactionType;
      category: string;
      note?: string;
    }) => {
      const now = new Date().toISOString();
      const transaction: Transaction = {
        id: crypto.randomUUID(),
        amountCents: input.amountCents,
        date: input.date,
        type: input.type,
        category: input.category.trim(),
        note: (input.note ?? "").trim(),
        createdAt: now,
        updatedAt: now
      };

      const nextTransactions = [transaction, ...transactions].sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
        if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
        return 0;
      });

      await updateState({ ...appState, transactions: nextTransactions });
      return transaction;
    },
    [appState, transactions, updateState]
  );

  const update = useCallback(
    async (
      id: string,
      patch: Partial<Pick<Transaction, "amountCents" | "date" | "type" | "category" | "note">>
    ) => {
      const idx = transactions.findIndex((t) => t.id === id);
      if (idx === -1) return null;

      const existing = transactions[idx];
      const updated: Transaction = {
        ...existing,
        ...patch,
        category: (patch.category ?? existing.category).trim(),
        note: (patch.note ?? existing.note).trim(),
        updatedAt: new Date().toISOString()
      };

      const nextTransactions = [...transactions];
      nextTransactions[idx] = updated;
      nextTransactions.sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
        if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
        return 0;
      });

      await updateState({ ...appState, transactions: nextTransactions });
      return updated;
    },
    [appState, transactions, updateState]
  );

  const remove = useCallback(async (id: string) => {
    const nextTransactions = transactions.filter((t) => t.id !== id);
    if (nextTransactions.length === transactions.length) return false;

    await updateState({ ...appState, transactions: nextTransactions });
    return true;
  }, [appState, transactions, updateState]);

  const getById = useCallback(
    (id: string) => transactions.find((t) => t.id === id) ?? null,
    [transactions]
  );

  return useMemo(
    () => ({
      isReady: isInitialized,
      transactions,
      add,
      update,
      remove,
      getById,
      reload: () => {} // No-op now as it's reactive through context
    }),
    [isInitialized, transactions, add, update, remove, getById]
  );
}
