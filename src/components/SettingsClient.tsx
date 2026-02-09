"use client";

import React, { useState } from "react";
import { useVault } from "@/hooks/useVault";
import { Button, Input } from "@/components/ui";
import { getRawStorageData, importVaultData, resetStorage } from "@/lib/storage/appState";

export default function SettingsClient() {
  const {
    isVaultEnabled,
    enableVault,
    disableVault,
    lock,
    isLocked,
    error: vaultError
  } = useVault();

  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnableVault = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase !== confirmPassphrase) {
      setError("Passphrases do not match");
      return;
    }
    if (passphrase.length < 8) {
      setError("Passphrase must be at least 8 characters");
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      await enableVault(passphrase);
      setPassphrase("");
      setConfirmPassphrase("");
    } catch (e) {
      setError("Failed to enable vault");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisableVault = async () => {
    if (!confirm("Are you sure you want to disable the vault? Your data will be stored in plaintext.")) {
      return;
    }
    setIsProcessing(true);
    try {
      await disableVault();
    } catch (e) {
      setError("Failed to disable vault");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    const data = getRawStorageData();
    if (!data) return;
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-vault-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        importVaultData(json);
        window.location.reload();
      } catch (e) {
        alert("Invalid vault data");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm("DANGER: This will delete ALL data. Are you sure?")) {
      resetStorage();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-500">Manage your data and security.</p>
      </div>

      <section className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Security</h2>

        {isVaultEnabled ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-600">Vault is enabled</p>
                <p className="text-sm text-slate-500">Your data is encrypted using AES-GCM.</p>
              </div>
              <div className="space-x-2">
                <Button variant="secondary" onClick={lock}>Lock Vault</Button>
                <Button variant="danger" onClick={handleDisableVault} disabled={isProcessing}>
                  Disable Vault
                </Button>
              </div>
            </div>

            <hr />

            <form className="space-y-4" onSubmit={handleEnableVault}>
              <h3 className="text-sm font-medium">Change Passphrase</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="password"
                  placeholder="New Passphrase"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Confirm New Passphrase"
                  value={confirmPassphrase}
                  onChange={(e) => setConfirmPassphrase(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" disabled={isProcessing || !passphrase}>
                Update Passphrase
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Your data is currently stored in plaintext in your browser's local storage.
              Enable the vault to encrypt it with a passphrase.
            </p>
            <form className="space-y-4" onSubmit={handleEnableVault}>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="password"
                  placeholder="Passphrase (min 8 chars)"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Confirm Passphrase"
                  value={confirmPassphrase}
                  onChange={(e) => setConfirmPassphrase(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" disabled={isProcessing || !passphrase}>
                Enable Vault
              </Button>
            </form>
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Data Management</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary" onClick={handleExport}>
            Export Vault Data
          </Button>
          <div className="relative">
            <label className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer">
              Import Vault Data
              <input type="file" className="hidden" onChange={handleImport} accept=".json" />
            </label>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Exporting downloads the encrypted vault (or plaintext if vault is disabled).
          Importing will OVERWRITE your current data.
        </p>
      </section>

      <section className="space-y-4 rounded-xl border border-red-100 bg-red-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
        <p className="text-sm text-red-700">
          If you forgot your passphrase, you can reset the entire application.
          All your transactions will be permanently deleted.
        </p>
        <Button variant="danger" onClick={handleReset}>
          Reset All Data
        </Button>
      </section>
    </div>
  );
}
