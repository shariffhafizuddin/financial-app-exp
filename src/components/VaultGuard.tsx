"use client";

import React, { useState } from "react";
import { useVault } from "@/hooks/useVault";
import { Button, Input } from "@/components/ui";
import { getRawStorageData, resetStorage } from "@/lib/storage/appState";

export default function VaultGuard({ children }: { children: React.ReactNode }) {
  const { isLocked, isInitialized, unlock, error } = useVault();
  const [passphrase, setPassphrase] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);

  if (!isInitialized) {
    return <div className="py-12 text-center text-slate-500">Initializing vault…</div>;
  }

  const handleExport = () => {
    const data = getRawStorageData();
    if (!data) return;
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-vault-export-raw-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm("DANGER: This will delete ALL data and reset the vault. Are you sure?")) {
      resetStorage();
      window.location.reload();
    }
  };

  if (isLocked) {
    return (
      <div className="mx-auto mt-20 max-w-sm space-y-6 rounded-xl border bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Vault Locked</h1>
          <p className="text-sm text-slate-500">Enter your passphrase to unlock your financial data.</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsUnlocking(true);
            await unlock(passphrase);
            setIsUnlocking(false);
          }}
        >
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              autoFocus
            />
            {error && <p className="text-xs font-medium text-red-500">{error}</p>}
          </div>
          <Button
            className="w-full"
            type="submit"
            disabled={isUnlocking || !passphrase}
          >
            {isUnlocking ? "Unlocking…" : "Unlock"}
          </Button>
        </form>

        <hr className="border-slate-100" />

        <div className="space-y-4 text-center">
          <p className="text-xs text-slate-400">
            Forgot passphrase or data corrupted? <br/>
            You can export the raw data for recovery or reset the entire vault.
          </p>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" onClick={handleExport}>
              Export Raw Data
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Reset Everything
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
