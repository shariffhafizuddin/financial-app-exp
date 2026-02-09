import type { Transaction, TransactionType } from "@/lib/types";

const STORAGE_KEY = "financial-tracker:transactions:v1";
const CHANGE_EVENT = "financial-tracker:transactions:changed";

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

function emitChange(): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

function isTransactionType(value: unknown): value is TransactionType {
  return value === "income" || value === "expense";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function coerceTransaction(value: unknown): Transaction | null {
  if (!isPlainObject(value)) return null;

  const {
    id,
    amountCents,
    date,
    type,
    category,
    note,
    createdAt,
    updatedAt
  } = value;

  if (typeof id !== "string") return null;
  if (typeof amountCents !== "number" || !Number.isInteger(amountCents) || amountCents <= 0) return null;
  if (typeof date !== "string") return null;
  if (!isTransactionType(type)) return null;
  if (typeof category !== "string" || category.trim().length === 0) return null;
  if (typeof createdAt !== "string") return null;
  if (typeof updatedAt !== "string") return null;

  return {
    id,
    amountCents,
    date,
    type,
    category,
    note: typeof note === "string" ? note : "",
    createdAt,
    updatedAt
  };
}

export function loadTransactions(): Transaction[] {
  const storage = getLocalStorage();
  if (!storage) return [];

  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return [];
  }
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(coerceTransaction)
      .filter((t): t is Transaction => t !== null)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
        if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
        return 0;
      });
  } catch {
    return [];
  }
}

export function saveTransactions(list: Transaction[]): void {
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    return;
  }
  emitChange();
}

export function listTransactions(): Transaction[] {
  return loadTransactions();
}

export function getTransaction(id: string): Transaction | null {
  return loadTransactions().find((t) => t.id === id) ?? null;
}

export function addTransaction(input: {
  amountCents: number;
  date: string;
  type: TransactionType;
  category: string;
  note?: string;
}): Transaction {
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

  const next = [transaction, ...loadTransactions()].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
    return 0;
  });

  saveTransactions(next);
  return transaction;
}

export function updateTransaction(
  id: string,
  patch: Partial<Pick<Transaction, "amountCents" | "date" | "type" | "category" | "note">>
): Transaction | null {
  const current = loadTransactions();
  const idx = current.findIndex((t) => t.id === id);
  if (idx === -1) return null;

  const existing = current[idx];
  const updated: Transaction = {
    ...existing,
    ...patch,
    category: (patch.category ?? existing.category).trim(),
    note: (patch.note ?? existing.note).trim(),
    updatedAt: new Date().toISOString()
  };

  const next = [...current];
  next[idx] = updated;
  next.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
    return 0;
  });

  saveTransactions(next);
  return updated;
}

export function deleteTransaction(id: string): boolean {
  const current = loadTransactions();
  const next = current.filter((t) => t.id !== id);
  if (next.length === current.length) return false;
  saveTransactions(next);
  return true;
}

export function subscribeTransactionsChanged(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  try {
    window.addEventListener(CHANGE_EVENT, handler);
    return () => {
      try {
        window.removeEventListener(CHANGE_EVENT, handler);
      } catch {
        // ignore
      }
    };
  } catch {
    return () => {};
  }
}
