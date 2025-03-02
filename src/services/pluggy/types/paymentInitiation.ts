export type PaymentInitiation = {
  payment_id: string;
  status: string;
  amount: {
    currency: string;
    value: number;
  };
};
