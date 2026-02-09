export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  amountCents: number;
  date: string; // YYYY-MM-DD (local)
  type: TransactionType;
  category: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type AppState = {
  transactions: Transaction[];
};

export type KdfParams = {
  saltB64: string;
  iterations: number;
};

export type CipherData = {
  ivB64: string;
  ciphertextB64: string;
};

export type VaultData = {
  version: number;
  kdf: KdfParams;
  cipher: CipherData;
};

export type StorageData = AppState | VaultData;

export function isVaultData(data: StorageData): data is VaultData {
  return "kdf" in data && "cipher" in data;
}
