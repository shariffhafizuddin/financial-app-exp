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

