import { ApisauceInstance, create } from 'apisauce';

export type PlaidClientParams = {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
};

export class BaseApi {
  protected client: ApisauceInstance;
  protected clientId: string;
  protected clientSecret: string;
  protected accessToken?: string;

  constructor({ clientId, clientSecret, accessToken }: PlaidClientParams) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accessToken = accessToken;

    this.client = create({
      baseURL: 'https://sandbox.plaid.com',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
    });
  }

  // Setter method to update accessToken dynamically
  public setAccessToken(token: string) {
    this.accessToken = token;
  }

  // Generic function to handle all POST requests
  protected async postRequest<T>(
    url: string,
    body: Record<string, unknown>,
    includeAccessToken = true,
  ): Promise<T> {
    try {
      const requestBody = {
        client_id: this.clientId,
        secret: this.clientSecret,
        ...(includeAccessToken && this.accessToken ? { access_token: this.accessToken } : {}),
        ...body,
      };

      const response = await this.client.post<T>(url, requestBody);

      if (!response.ok) {
        console.error('Plaid API Error:', response);
        throw new Error(response.problem || 'Unknown API error');
      }

      return response.data as T;
    } catch (error) {
      console.error('Request failed:', error);
      return Promise.reject(error);
    }
  }
}
