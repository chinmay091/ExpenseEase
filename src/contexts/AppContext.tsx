import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import moment, { Moment } from 'moment';
import Toast from 'react-native-toast-message';
import LoadingModal from '../components/LoadingModal';
import { Account, Investment, Transaction } from '../services/pluggy/types';
import { plaidApi } from '../services/pluggy/apiAdapter';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppContextValue = {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  hideValues: boolean;
  setHideValues: (value: boolean) => void;
  date: Moment;
  setDate: (value: Moment) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  accounts: Account[];
  transactions: Transaction[];
  investments: Investment[];
  totalBalance: number;
  totalInvestment: number;
  totalLiability: number;
  totalIncomes: number;
  totalExpenses: number;
  fetchAccounts: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchIncome: () => Promise<void>;
  fetchLiabilities: () => Promise<void>;
  fetchInvestments: () => Promise<void>;
  fetchTotals: () => Promise<void>;
  fetchExpenses: () => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  updateItems: () => Promise<void>;
  fetchItems: () => Promise<void>;
  totalInvoice: number;
  lastUpdateDate: Moment;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AppContext = createContext({} as AppContextValue);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hideValues, setHideValues] = useState(false);
  const [date, setDate] = useState(moment());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalLiability, setTotalLiability] = useState(0);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (accessToken: string) => {
    try {
      await AsyncStorage.setItem('access_token', accessToken);
      setIsAuthenticated(true);  // ✅ Update authentication state
      console.log('✅ User logged in successfully');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  // ✅ Function to log out user
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');  // Remove token
      setIsAuthenticated(false);  // Mark user as logged out
    } catch (err) {
      console.error('Error removing auth token:', err);
    }
  };

  // ✅ This runs on app startup to check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        console.log("🔍 Stored Token:", token);  // ✅ Check if a token exists
        setIsAuthenticated(!!token);
        console.log("🔍 isAuthenticated:", !!token);  // ✅ Log authentication state
      } catch (err) {
        console.error("Error retrieving auth token:", err);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAccounts();
      fetchTransactions();
      fetchInvestments();
      fetchTotals();
      fetchExpenses();
    }
  }, [isAuthenticated]);

  const fetchAccounts = async () => {
    try {
      const data = await plaidApi.fetchAccounts();
      setAccounts(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error fetching accounts' });
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await plaidApi.fetchTransactions();
      setTransactions(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error fetching transactions' });
    }
  };

  const fetchInvestments = async () => {
    try {
      const data = await plaidApi.fetchInvestments();
      setInvestments(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error fetching investments' });
    }
  };

  const fetchTotals = async () => {
    try {
      const totalIncome = await plaidApi.fetchIncome();
      const totalLiabilities = await plaidApi.fetchLiabilities();
      const totalInvestments = await plaidApi.fetchInvestments();
      
      setTotalIncomes(totalIncome);
      setTotalLiability(totalLiabilities);
      setTotalInvestment(totalInvestments);
      setTotalBalance(totalIncome - totalLiabilities);
    } catch (error) {
      console.error('Error fetching totals:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const transactions: Transaction[] = await plaidApi.fetchTransactions();
      const total = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
      setTotalExpenses(total);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchIncome = async () => {
    try {
      const totalIncome = await plaidApi.fetchIncome();
      setTotalIncomes(totalIncome);
    } catch (error) {
      console.error('Error fetching income:', error);
    }
  };
  
  const fetchLiabilities = async () => {
    try {
      const totalLiabilities = await plaidApi.fetchLiabilities();
      setTotalLiability(totalLiabilities);
    } catch (error) {
      console.error('Error fetching liabilities:', error);
    }
  };
  

  const deleteItem = async (itemId: string) => {
    try {
      await plaidApi.deleteItem(itemId);
      await fetchAccounts();
    } catch (error) {
      console.error(`Error deleting item ${itemId}:`, error);
    }
  };

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchAccounts(),
        fetchTransactions(),
        fetchLiabilities(),
        fetchIncome(),
        fetchInvestments(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Function to update/synchronize data (forces fresh fetch)
  const updateItems = async () => {
    try {
      setIsLoading(true);
      console.log("Synchronizing data...");

      await Promise.all([
        fetchAccounts(), // Refresh accounts
        fetchTransactions(), // Refresh transactions
        fetchLiabilities(), // Refresh liabilities
        fetchIncome(), // Refresh income
        fetchInvestments(), // Refresh investments
      ]);

      console.log("Data synchronization complete.");
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      login,
      logout,
      isLoading,
      setIsLoading,
      hideValues,
      setHideValues,
      date,
      setDate,
      isAuthenticated,
      setIsAuthenticated,
      accounts,
      transactions,
      investments,
      totalBalance,
      totalInvestment,
      totalLiability,
      totalIncomes,
      totalExpenses,
      fetchAccounts,
      fetchTransactions,
      fetchIncome,
      fetchLiabilities,
      fetchInvestments,
      fetchTotals,
      fetchExpenses,
      deleteItem,
      fetchItems,
      updateItems,
      totalInvoice: totalIncomes - totalExpenses,
      lastUpdateDate: moment(),
    }}>
      {children}
      {isLoading && <LoadingModal text="Loading financial data..." />}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export default AppContext;
