export type Liabilities = {
  credit: {
    account_id: string;
    is_overdue?: boolean;
    last_payment_date?: string;
    last_payment_amount?: number;
  }[];
};
