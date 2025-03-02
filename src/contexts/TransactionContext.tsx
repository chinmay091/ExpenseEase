// src/hooks/TransactionContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createLinkToken, exchangePublicToken, fetchTransactions } from '../hooks/useplaidService'; // Import Plaid API services

// Define the type for the transaction
interface Transaction {
  id: string; // Plaid transactions have a unique string ID
  name: string; // Transaction name (e.g., "Starbucks")
  amount: number; // Transaction amount
  date: string; // Date of the transaction
}

// Create the Transaction Context
const TransactionContext = createContext<{
  transactionHistory: Transaction[];
  totalBalance: number;
  linkToken: string | null;
  initializeLinkToken: () => Promise<void>;
  handlePublicTokenExchange: (publicToken: string) => Promise<void>;
  addTransaction: (amount: number) => void;
}>(null!);

// Provider component
export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [linkToken, setLinkToken] = useState<string | null>(null);

  // Initialize Plaid Link token
  const initializeLinkToken = async () => {
    try {
      const token = await createLinkToken();
      setLinkToken(token);
    } catch (error) {
      console.error('Error initializing link token:', error);
    }
  };

  // Handle public token exchange and fetch transactions
  const handlePublicTokenExchange = async (publicToken: string) => {
    try {
      // Exchange public token for access token
      const accessToken = await exchangePublicToken(publicToken);

      // Fetch transactions using the access token
      const transactions = await fetchTransactions(accessToken);

      // Update the transaction history and balance
      setTransactionHistory(transactions);
      const total = transactions.reduce((sum, txn) => sum + txn.amount, 0);
      setTotalBalance(total);
    } catch (error) {
      console.error('Error handling public token exchange:', error);
    }
  };

  // Add manual transactions (optional)
  const addTransaction = (amount: number) => {
    setTotalBalance((prevBalance) => prevBalance + amount);
    setTransactionHistory((prevHistory) => [
      {
        id: `manual-${prevHistory.length + 1}`,
        name: 'Manual Transaction',
        amount,
        date: new Date().toISOString(),
      },
      ...prevHistory,
    ]);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactionHistory,
        totalBalance,
        linkToken,
        initializeLinkToken,
        handlePublicTokenExchange,
        addTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook to use the Transaction Context
export const useTransaction = () => useContext(TransactionContext);
