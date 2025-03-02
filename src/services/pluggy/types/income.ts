export type Income = {
  income_streams: {
    description: string;
    confidence: number;
    days: number;
    monthly_income: number;
  }[];
  last_updated_time: string;
  projected_yearly_income: number;
  request_id: string;
};
