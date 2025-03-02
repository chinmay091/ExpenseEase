import AsyncStorage from '@react-native-async-storage/async-storage';
import moment, { Moment } from 'moment';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import LoadingModal from '../components/LoadingModal';
import { usePlaidService } from '../hooks/useplaidService';
import {
  Account,
  AuthResponse,
  Category,
  Common,
  Connector,
  Deserialized,
  Execution,
  Identity,
  Index,
  Investment,
  Item,
  Opportunity,
  Transaction,
  Validation,
  Webhook,
} from '../services/plaid/types';
import { range } from '../utils/array';
import {
  CURRENCY_CODES,
  CurrencyCode,
  COUNTRY_CODES,
  CountryCode,
  PageResponse,
  PageFilters,
} from '../services/pluggy/types';
import {
  ItemsAsyncStorageKey,
  LastUpdateDateFormat,
  LastUpdateDateStorageKey,
} from '../utils/contants';
import { sleep } from '../utils/time';

const NUBANK_IGNORED_TRANSACTIONS = ['Money saved', 'Money rescued'];

export type MonthlyBalance = {
  date: Moment;
  incomes: number;
  expenses: number;
};

export type AppContextValue = {
  isLoading: boolean;
  hideValues: boolean;
  setHideValues: (value: boolean) => void;
  date: Moment;
  setDate: (value: Moment) => void;
  minimumDateWithData: Moment;
  lastUpdateDate: string;
  items: Item[];
  storeItem: (item: Item) => Promise<void>;
  deleteItem: (item: Item) => Promise<void>;
  fetchItems: () => Promise<void>;
  fetchingItems: boolean;
  updateItems: () => Promise<boolean>;
  updatingItems: boolean;
  accounts: Account[];
  fetchAccounts: () => Promise<void>;
  fetchingAccounts: boolean;
  investments: Investment[];
  fetchInvestments: () => Promise<void>;
  fetchingInvestments: boolean;
  transactions: Transaction[];
  fetchTransactions: () => Promise<void>;
  fetchingTransactions: boolean;
  monthlyBalances: MonthlyBalance[];
  fetchMonthlyBalancesPage: (itemsPerPage: number, currentPage: number) => Promise<void>;
  fetchingMonthlyBalances: boolean;
  currentMonthlyBalancesPage: number;
  setCurrentMonthlyBalancesPage: (value: number) => void;
  totalBalance: number;
  totalInvoice: number;
  totalInvestment: number;
  incomeTransactions: Transaction[];
  totalIncomes: number;
  expenseTransactions: Transaction[];
  totalExpenses: number;
};

const AppContext = createContext({} as AppContextValue);

const now = moment();
const currentMonth = moment(now).startOf('month');

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hideValues, setHideValues] = useState(false);
  const [date, setDate] = useState(now);
  const [lastUpdateDate, setLastUpdateDate] = useState('');

  const [itemsId, setItemsId] = useState<string[]>([]);
  const [loadingItemsId, setLoadingItemsId] = useState<boolean>(false);

  const [items, setItems] = useState<Item[]>([]);
  const [fetchingItems, setFetchingItems] = useState(false);
  const [updatingItems, setUpdatingItems] = useState(false);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fetchingAccounts, setFetchingAccounts] = useState(false);

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [fetchingInvestments, setFetchingInvestments] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fetchingTransactions, setFetchingTransactions] = useState(false);

  const [monthlyBalances, setMonthlyBalances] = useState<MonthlyBalance[]>([]);
  const [fetchingMonthlyBalances, setFetchingMonthlyBalances] = useState(false);
  const [currentMonthlyBalancesPage, setCurrentMonthlyBalancesPage] = useState(0);

  const plaidService = usePlaidService();

  const isLoading =
    loadingItemsId ||
    fetchingItems ||
    fetchingAccounts ||
    fetchingInvestments ||
    fetchingTransactions ||
    fetchingMonthlyBalances;

  useEffect(() => {
    const loadItemsId = async () => {
      setLoadingItemsId(true);
      const serializedIds = await AsyncStorage.getItem(ItemsAsyncStorageKey);
      const ids: string[] = serializedIds ? JSON.parse(serializedIds) : [];
      setItemsId(ids);
      setLoadingItemsId(false);
    };
    loadItemsId();
  }, []);

  const fetchItems = useCallback(async () => {
    if (itemsId.length === 0) return;
    setFetchingItems(true);
    try {
      const itemsWithDetails = await Promise.all(
        itemsId.map(async (id) => {
          const accounts = await plaidService.fetchAccounts(id);
          return {
            id,
            connector: 'Plaid',
            status: 'active',
            statusDetail: 'Fetched successfully',
            accounts,
          } as Item;
        }),
      );
      setItems(itemsWithDetails);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Unable to obtain connection information!' });
    }
    setFetchingItems(false);
  }, [plaidService, itemsId]);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        hideValues,
        setHideValues,
        date,
        setDate,
        minimumDateWithData: now.subtract(1, 'year'),
        lastUpdateDate,
        items,
        storeItem: async (item) => {},
        deleteItem: async (item) => {},
        fetchItems,
        fetchingItems,
        updateItems: async () => true,
        updatingItems,
        accounts,
        fetchAccounts: async () => {},
        fetchingAccounts,
        investments,
        fetchInvestments: async () => {},
        fetchingInvestments,
        transactions,
        fetchTransactions: async () => {},
        fetchingTransactions,
        monthlyBalances,
        fetchMonthlyBalancesPage: async () => {},
        fetchingMonthlyBalances,
        currentMonthlyBalancesPage,
        setCurrentMonthlyBalancesPage,
        totalBalance: 0,
        totalInvoice: 0,
        totalInvestment: 0,
        incomeTransactions: [],
        totalIncomes: 0,
        expenseTransactions: [],
        totalExpenses: 0,
      }}
    >
      {children}
      {updatingItems && <LoadingModal text="Synchronizing connections" />}
    </AppContext.Provider>
  );
};

export default AppContext;
