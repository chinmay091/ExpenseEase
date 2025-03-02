export type Item = {
  id: string;
  institutionId?: string; // Plaid's institution ID (if available)
  connector: 'Plaid'; // Currently, only "Plaid"
  status: 'active' | 'inactive' | 'error'; // Item connection status
  statusDetail: string; // Additional status info
  error?: string; // Error message (if any)
  accounts: Account[]; // Associated accounts
};

export type Account = {
  id: string;
  name: string;
  officialName?: string; // Full account name (if provided)
  type: 'depository' | 'investment' | 'credit' | 'loan' | 'other';
  subtype?: string;
  mask?: string; // Last 4 digits of the account number
  balance: {
    available?: number;
    current: number;
    limit?: number;
    currency: string;
  };
  verificationStatus?:
    | 'pending_automatic_verification'
    | 'pending_manual_verification'
    | 'manually_verified'
    | 'verification_expired';
};

// Function to map Plaid API response to the Item type
export const mapPlaidItem = (plaidItem: any, plaidAccounts: any[]): Item => {
  return {
    id: plaidItem.item_id,
    institutionId: plaidItem.institution_id || undefined,
    connector: 'Plaid',
    status: plaidItem.error ? 'error' : 'active',
    statusDetail: plaidItem.error ? plaidItem.error.message : 'Connected successfully',
    error: plaidItem.error?.message,
    accounts: plaidAccounts.map((account) => ({
      id: account.account_id,
      name: account.name,
      officialName: account.official_name || undefined,
      type: account.type,
      subtype: account.subtype || undefined,
      mask: account.mask || undefined,
      balance: {
        available: account.balances.available ?? undefined,
        current: account.balances.current,
        limit: account.balances.limit ?? undefined,
        currency: account.balances.iso_currency_code || 'USD',
      },
      verificationStatus: account.verification_status || undefined,
    })),
  };
};
