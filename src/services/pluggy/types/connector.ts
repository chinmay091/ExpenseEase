export const CONNECTOR_TYPES = ['PERSONAL_BANK', 'BUSINESS_BANK', 'INVESTMENT'] as const;

/**
 * @typedef ConnectorType
 * Type of connectors available
 */
export type ConnectorType = typeof CONNECTOR_TYPES[number];

export const PRODUCT_TYPES = [
  'ACCOUNTS',
  'CREDIT_CARDS',
  'TRANSACTIONS',
  'PAYMENT_DATA',
  'INVESTMENTS',
  'INVESTMENTS_TRANSACTIONS',
  'IDENTITY',
  'LIABILITIES',
  'STATEMENTS',
  'INCOME',
] as const;

export type ProductType = typeof PRODUCT_TYPES[number];

export type Connector = {
  /** Primary identifier of the connector */
  id: string;
  /** Name of the financial institution */
  name: string;
  /** URL of the institution */
  institutionUrl?: string;
  /** Logo URL of the institution */
  imageUrl?: string;
  /** Type of connector */
  type: ConnectorType;
  /** Country codes where the institution operates */
  countries: string[];
  /** List of supported Plaid products */
  products: ProductType[];
  /** Health status of the connector */
  health: {
    status: 'ONLINE' | 'OFFLINE' | 'UNSTABLE';
    stage?: 'BETA' | null;
  };
};

/**
 * Maps Plaid institutions to the Connector format.
 */
export const mapPlaidConnector = (institution: any): Connector => ({
  id: institution.institution_id,
  name: institution.name,
  institutionUrl: institution.url || undefined,
  imageUrl: institution.logo || undefined,
  type: 'PERSONAL_BANK', // Default, but can be refined based on the institution
  countries: institution.country_codes,
  products: institution.products.filter((product: string) =>
    PRODUCT_TYPES.includes(product as ProductType),
  ) as ProductType[],
  health: {
    status: 'ONLINE', // Plaid does not provide real-time health, defaulting to "ONLINE"
    stage: institution.is_beta ? 'BETA' : null,
  },
});
