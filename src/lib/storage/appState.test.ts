import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadAppState,
  saveAppState,
  enableVault,
  isVaultEnabled,
  unlockVault
} from "./appState";
import { AppState } from "@/lib/types";

describe("appState storage", () => {
  const mockState: AppState = {
    transactions: [
      {
        id: "1",
        amountCents: 1000,
        date: "2023-01-01",
        type: "expense",
        category: "Food",
        note: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should save and load plaintext state", async () => {
    await saveAppState(mockState);
    const loaded = await loadAppState();
    expect(loaded).toEqual(mockState);
  });

  it("should never write plaintext when vault is enabled", async () => {
    const passphrase = "secure-password";
    const key = await enableVault(passphrase, mockState);

    const raw = localStorage.getItem("financial-tracker:app-state:v1");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveProperty("kdf");
    expect(parsed).toHaveProperty("cipher");
    expect(raw).not.toContain("Food"); // Data should be encrypted

    // Should load with key
    const loaded = await loadAppState(key);
    expect(loaded).toEqual(mockState);

    // Should NOT load without key
    const locked = await loadAppState();
    expect(locked).toBeNull();
  });

  it("should migrate from legacy transactions key", async () => {
    const legacyKey = "financial-tracker:transactions:v1";
    localStorage.setItem(legacyKey, JSON.stringify(mockState.transactions));

    const loaded = await loadAppState();
    expect(loaded).toEqual(mockState);
  });

  it("should upgrade version if needed (migration test placeholder)", async () => {
    // Current version is 1. If we change AppState in the future, we test migration here.
    const oldVersionBlob = {
        version: 0,
        transactions: mockState.transactions
    };
    localStorage.setItem("financial-tracker:app-state:v1", JSON.stringify(oldVersionBlob));

    const loaded = await loadAppState();
    expect(loaded).toEqual(mockState);
  });

  it("should unlock vault with correct passphrase", async () => {
    const passphrase = "my-secret-vault";
    await enableVault(passphrase, mockState);

    const key = await unlockVault(passphrase);
    expect(key).not.toBeNull();

    const loaded = await loadAppState(key!);
    expect(loaded).toEqual(mockState);
  });

  it("should fail to unlock with wrong passphrase", async () => {
    const passphrase = "my-secret-vault";
    await enableVault(passphrase, mockState);

    const key = await unlockVault("wrong-password");
    expect(key).toBeNull();
  });
});
