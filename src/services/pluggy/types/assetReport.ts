import { Account } from './item';

export interface AssetReport {
  report_id: string;
  request_id: string;
  generated_time: string;
  items: {
    item_id: string;
    accounts: Account[];
  }[];
}
