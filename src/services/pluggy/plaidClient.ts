import { BaseApi } from './baseApi';
import { Account, Investment, Item, Transaction, Identity } from './types';
import { Liabilities } from './types/liabilities';
import { Statement } from './types/statements';
import { Income } from './types/income';
import { PaymentInitiation } from './types/paymentInitiation';
import { Signal } from './types/signal';
import { TransactionFilters } from './types/transactionsRefresh';
import { AssetReport } from './types/assetReport';
import { RecurringTransactions } from './types/recurringTransactions';

import {
  CURRENCY_CODES,
  CurrencyCode,
  COUNTRY_CODES,
  CountryCode,
  PageResponse,
  PageFilters,
} from './types';

export class PlaidClient extends BaseApi {
  // No need to declare accessToken here

  async createLinkToken(userId: string) {
    return this.postRequest<{ link_token: string }>(
      '/link/token/create',
      {
        user: { client_user_id: userId },
        client_name: 'Your App',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
      },
      false,
    );
  }

  async exchangePublicToken(publicToken: string) {
    const response = await this.postRequest<{ access_token: string; item_id: string }>(
      '/item/public_token/exchange',
      { public_token: publicToken },
      false,
    );

    // Store the access token for future requests
    this.setAccessToken(response.access_token);
    return response;
  }

  async fetchAccounts() {
    this.ensureAccessToken();
    return this.postRequest<{ accounts: Account[] }>('/accounts/get', {});
  }

  async fetchInvestments() {
    this.ensureAccessToken();
    return this.postRequest<{ investments: Investment[] }>('/investments/holdings/get', {});
  }

  async fetchItem() {
    this.ensureAccessToken();
    return this.postRequest<{ item: Item }>('/item/get', {});
  }

  async fetchTransactions(
    startDate: string,
    endDate: string,
    options: Omit<TransactionFilters, 'start_date' | 'end_date'> = {},
  ) {
    this.ensureAccessToken();
    return this.postRequest<{ transactions: Transaction[] }>('/transactions/get', {
      start_date: startDate,
      end_date: endDate,
      ...options,
    });
  }

  async fetchIdentity() {
    this.ensureAccessToken();
    return this.postRequest<{ identity: Identity }>('/identity/get', {});
  }

  async fetchIncome() {
    this.ensureAccessToken();
    return this.postRequest<{ income: Income }>('/income/get', {});
  }

  async fetchLiabilities() {
    this.ensureAccessToken();
    return this.postRequest<{ liabilities: Liabilities }>('/liabilities/get', {});
  }

  async initiatePayment(paymentInitiation: PaymentInitiation) {
    return this.postRequest<{ payment_id: string }>(
      '/payment_initiation/payment/create',
      paymentInitiation,
    );
  }

  async fetchAssetReport(assetReportToken: string) {
    return this.postRequest<{ asset_report: AssetReport }>('/asset_report/get', {
      asset_report_token: assetReportToken,
    });
  }

  async signalFraudDetection(transactionId: string) {
    this.ensureAccessToken();
    return this.postRequest<{ signal_decision: Signal }>('/signal/evaluate', {
      transaction_id: transactionId,
    });
  }

  async fetchRecurringTransactions() {
    this.ensureAccessToken();
    return this.postRequest<{ recurring_transactions: RecurringTransactions }>(
      '/transactions/recurring/get',
      {},
    );
  }

  async fetchStatements() {
    this.ensureAccessToken();
    return this.postRequest<{ statements: Statement }>('/statements/get', {});
  }

  // Ensure that accessToken is set before making a request
  private ensureAccessToken() {
    if (!this.accessToken) {
      throw new Error('Access token is not set. Please exchange a public token first.');
    }
  }
}
