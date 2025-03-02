export interface RecurringTransactions {
  inflows: {
    transaction_id: string;
    amount: number;
    frequency: string;
    merchant_name?: string;
  }[];
  outflows: {
    transaction_id: string;
    amount: number;
    frequency: string;
    merchant_name?: string;
  }[];
}
