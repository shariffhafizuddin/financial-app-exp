import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addTransaction, deleteTransaction, loadTransactions, saveTransactions } from "@/lib/storage/transactions";

describe("transactions storage", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads empty on missing/invalid data", () => {
    expect(loadTransactions()).toEqual([]);
    localStorage.setItem("financial-tracker:transactions:v1", "{not json");
    expect(loadTransactions()).toEqual([]);
  });

  it("adds and deletes a transaction", () => {
    const created = addTransaction({
      amountCents: 1234,
      date: "2026-02-05",
      type: "expense",
      category: "Groceries",
      note: "Test"
    });

    expect(loadTransactions().some((t) => t.id === created.id)).toBe(true);
    expect(deleteTransaction(created.id)).toBe(true);
    expect(loadTransactions().some((t) => t.id === created.id)).toBe(false);
  });

  it("handles storage methods throwing", () => {
    vi.stubGlobal("localStorage", {
      clear: () => {},
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {},
      key: () => null,
      get length() {
        return 0;
      }
    } as unknown as Storage);

    expect(loadTransactions()).toEqual([]);
    expect(() => saveTransactions([])).not.toThrow();
  });

  it("persists a valid list", () => {
    saveTransactions([
      {
        id: "t1",
        amountCents: 100,
        date: "2026-02-05",
        type: "income",
        category: "Salary",
        note: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    const loaded = loadTransactions();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.id).toBe("t1");
  });
});
