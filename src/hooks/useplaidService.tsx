import React, { createContext, useContext, ReactNode } from 'react';
import axios from 'axios';

const BASE_URL = 'http://192.168.29.253:3000/api'; // Update this URL if needed

// Create a hook for the Plaid Service
export const usePlaidService = () => {
  // Create Link Token
  const createLinkToken = async (): Promise<string> => {
    try {
      const response = await axios.post(`${BASE_URL}/create_link_token`);
      return response.data.link_token; // Return the link token
    } catch (error) {
      console.error('Error creating link token:', error);
      throw error;
    }
  };

  // Exchange Public Token for Access Token
  const exchangePublicToken = async (publicToken: string): Promise<string> => {
    try {
      const response = await axios.post(`${BASE_URL}/exchange_public_token`, {
        public_token: publicToken,
      });
      return response.data.access_token; // Return the access token
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw error;
    }
  };

  // Fetch Transactions
  const fetchTransactions = async (accessToken: string): Promise<any[]> => {
    try {
      const response = await axios.post(`${BASE_URL}/transactions`, {
        access_token: accessToken,
      });
      return response.data.transactions; // Return the transactions array
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  };

  // Fetch Accounts
  const fetchAccounts = async (accessToken: string): Promise<any[]> => {
    try {
      const response = await axios.post(`${BASE_URL}/accounts`, {
        access_token: accessToken,
      });
      return response.data.accounts; // Return the accounts array
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  };

  // Fetch Investments (if applicable)
  const fetchInvestments = async (accessToken: string): Promise<any[]> => {
    try {
      const response = await axios.post(`${BASE_URL}/investments`, {
        access_token: accessToken,
      });
      return response.data.investments; // Return the investments array
    } catch (error) {
      console.error('Error fetching investments:', error);
      throw error;
    }
  };

  // Delete an Item (disconnect from Plaid)
  const deleteItem = async (accessToken: string): Promise<void> => {
    try {
      await axios.post(`${BASE_URL}/delete_item`, {
        access_token: accessToken,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  return {
    createLinkToken,
    exchangePublicToken,
    fetchTransactions,
    fetchAccounts,
    fetchInvestments,
    deleteItem,
  };
};

// Define the context shape
interface PlaidServiceContextType {
  createLinkToken: () => Promise<string>;
  exchangePublicToken: (publicToken: string) => Promise<string>;
  fetchTransactions: (accessToken: string) => Promise<any[]>;
  fetchAccounts: (accessToken: string) => Promise<any[]>;
  fetchInvestments: (accessToken: string) => Promise<any[]>;
  deleteItem: (accessToken: string) => Promise<void>;
}

// Create the Plaid service context
const PlaidServiceContext = createContext<PlaidServiceContextType | undefined>(undefined);

// Create a provider for the Plaid service context
export const PlaidServiceContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const plaidService = usePlaidService(); // Get service methods from usePlaidService hook

  return (
    <PlaidServiceContext.Provider value={plaidService}>{children}</PlaidServiceContext.Provider>
  );
};

// Create a custom hook to use the context
export const usePlaidContext = (): PlaidServiceContextType => {
  const context = useContext(PlaidServiceContext);
  if (!context) {
    throw new Error('usePlaidContext must be used within a PlaidServiceContextProvider');
  }
  return context;
};
