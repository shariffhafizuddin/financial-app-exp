"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AppState } from "@/lib/types";
import {
  loadAppState,
  saveAppState,
  isVaultEnabled,
  unlockVault,
  enableVault as enableVaultStorage,
  disableVault as disableVaultStorage
} from "@/lib/storage/appState";

interface VaultContextType {
  isLocked: boolean;
  isVaultEnabled: boolean;
  appState: AppState | null;
  unlock: (passphrase: string) => Promise<boolean>;
  lock: () => void;
  updateState: (newState: AppState) => Promise<void>;
  enableVault: (passphrase: string) => Promise<void>;
  disableVault: () => Promise<void>;
  error: string | null;
  isInitialized: boolean;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [sessionKey, setSessionKey] = useState<CryptoKey | null>(null);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [vaultEnabled, setVaultEnabled] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshVaultStatus = useCallback(async () => {
    const enabled = await isVaultEnabled();
    setVaultEnabled(enabled);
    return enabled;
  }, []);

  const loadData = useCallback(async (key?: CryptoKey) => {
    try {
      const state = await loadAppState(key);
      setAppState(state);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Failed to load data. The vault might be corrupted.");
    }
  }, []);

  useEffect(() => {
    async function init() {
      const enabled = await refreshVaultStatus();
      if (!enabled) {
        await loadData();
      }
      setIsInitialized(true);
    }
    init();
  }, [refreshVaultStatus, loadData]);

  const unlock = async (passphrase: string) => {
    setError(null);
    const key = await unlockVault(passphrase);
    if (key) {
      setSessionKey(key);
      await loadData(key);
      return true;
    } else {
      setError("Invalid passphrase");
      return false;
    }
  };

  const lock = () => {
    setSessionKey(null);
    setAppState(null);
  };

  const updateState = async (newState: AppState) => {
    await saveAppState(newState, sessionKey || undefined);
    setAppState(newState);
  };

  const enableVault = async (passphrase: string) => {
    const currentAppState = appState || { transactions: [] };
    const key = await enableVaultStorage(passphrase, currentAppState);
    setSessionKey(key);
    setVaultEnabled(true);
    await loadData(key);
  };

  const disableVault = async () => {
    if (!sessionKey) return;
    await disableVaultStorage(sessionKey);
    setSessionKey(null);
    setVaultEnabled(false);
    await loadData();
  };

  const isLocked = vaultEnabled && !sessionKey;

  return (
    <VaultContext.Provider
      value={{
        isLocked,
        isVaultEnabled: vaultEnabled,
        appState,
        unlock,
        lock,
        updateState,
        enableVault,
        disableVault,
        error,
        isInitialized
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
}
