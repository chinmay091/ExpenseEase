import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Moment } from 'moment';
import React, { useContext, useMemo, useState } from 'react';
import {
  Alert,
  LayoutAnimation,
  LayoutChangeEvent,
  Platform,
  RefreshControl,
  ScrollView,
  UIManager,
  Button,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'styled-components/native';
import FlexContainer from '../../components/FlexContainer';
import Header from '../../components/Header';
import HorizontalBar from '../../components/HorizontalBar';
import Money from '../../components/Money';
import MonthYearPicker from '../../components/MonthYearPicker';
import ScreenContainer from '../../components/ScreenContainer';
import TransactionListItem from '../../components/TransactionListItem';
import AddTransactionButton from '../../components/AddTransactionButton/AddTransactionButton';
import AppContext from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { checkCurrentMonth, formatMonthYearDate, NOW } from '../../utils/date';
import {
  BalanceContainer,
  BalanceFillLine,
  BalanceLine,
  BottomSheet,
  ConnectionsButton,
  Divider,
  HorizontalBarContainer,
  SeeMoreButton,
  TopContainer,
  TransactionListContainer,
  SectionHeader,
  BalanceWithTreding,
} from './styles';

const TRANSACTION_LIST_MIN_CAPACITY = 3;

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Home: React.FC = () => {
  const formatMonthYearDate = (value: Moment): string => {
    return value.format('MMMM YYYY');
  };

  const { user, logout } = useAuth();
  const userName = user?.displayName || 'User';
  const [monthYearPickerOpened, setMonthYearPickerOpened] = useState(false);
  const [transactionListCapacity, setTransactionListCapacity] = useState(0);
  const [headerTitle, setHeaderTitle] = useState(formatMonthYearDate(NOW)); 
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const theme = useTheme();
  const navigation = useNavigation();

  const toggleUserDropdown = () => {
    setShowUserDropdown((prev) => !prev); // <-- NEW
  };

  const {
    isLoading,
    date,
    setDate,
    minimumDateWithData,
    lastUpdateDate,
    updateItems,
    fetchItems,
    transactions,
    totalBalance,
    totalInvestment,
    totalInvoice,
    totalIncomes,
    totalExpenses,
  } = useContext(AppContext);

  const isCurrentMonth = checkCurrentMonth(date);

  const balance = totalIncomes - totalExpenses;

  const incomesBarGrow = totalIncomes >= totalExpenses ? 1 : totalIncomes / totalExpenses;
  const expensesBarGrow = totalExpenses >= totalIncomes ? 1 : totalExpenses / totalIncomes;
  const expensesSurplusGrow =
    totalIncomes >= totalExpenses ? 0 : (totalExpenses - totalIncomes) / totalExpenses;

  const lastTransactions = useMemo(() => {
    const amount = Math.max(transactionListCapacity, TRANSACTION_LIST_MIN_CAPACITY);
    return transactions.slice(0, amount);
  }, [transactions, transactionListCapacity]);

  const onTransactionListLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    const listCapacity = Math.round(height / (40 + 24));
    setTransactionListCapacity(listCapacity);
  };

  const animatedChangeDate = (value: Moment) => {
    const isNextValueCurrentMonth = checkCurrentMonth(value);

    if (isNextValueCurrentMonth) {
      setTransactionListCapacity(TRANSACTION_LIST_MIN_CAPACITY);
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setDate(value);
  };

  const handleMonthYearPickerChange = (value: Moment) => {
    animatedChangeDate(value);
    setHeaderTitle(formatMonthYearDate(value));
    setMonthYearPickerOpened(false);
  };
  

  const handleRefreshPage = () => {
    Alert.alert(
      'Do you want to synchronize connections?',
      'When synchronizing connections, the latest data will be obtained. This may take a few minutes.\n\nRefreshing will only get what has already been synced previously.',
      [
        {
          text: 'Update',
          onPress: async () => {
            await fetchItems();
          },
        },
        {
          text: 'Synchronize',
          onPress: async () => {
            await updateItems();
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      "Are you sure?",
      "Do you really want to log out?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel logout"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await logout();
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  return (
    <ScreenContainer>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefreshPage}
            colors={[theme.colors.primary]}
          />
        }
        contentContainerStyle={{ flexGrow: 1, overflow: 'hidden' }}
      >
        <TopContainer>
          <Header
            userIcon ='account-circle'
            userName={userName}
            title={headerTitle} 
            titleIcon="expand-more"
            onUserPress={toggleUserDropdown}
            onTitlePress={() => setMonthYearPickerOpened(true)}
            actions={[
              {
                icon: 'undo',
                onPress: () => animatedChangeDate(NOW),
                hidden: isCurrentMonth,
              },
              {
                icon: 'logout',
                onPress: handleLogout,
                title: 'logout',
              }
            ]}
          />


          {isCurrentMonth && (
            <BalanceContainer>
              <Text variant="light" color="textWhite">
                Updated on {lastUpdateDate}
              </Text>
              <BalanceLine>
                <Text color="textWhite">Account balance</Text>
                <BalanceFillLine />
                <Money value={totalBalance} color="textWhite" />
              </BalanceLine>
              <BalanceLine>
                <Text color="textWhite">Card invoice</Text>
                <BalanceFillLine />
                <Money value={-1 * totalInvoice} color="textWhite" />
              </BalanceLine>
              <BalanceLine>
                <Text color="textWhite">Investments</Text>
                <BalanceFillLine />
                <Money value={totalInvestment} color="textWhite" />
              </BalanceLine>
              <BalanceLine>
                <Text variant="title" color="textWhite">
                  Total
                </Text>
                <BalanceFillLine />
                <Money
                  value={totalBalance + totalInvestment - totalInvoice}
                  variant="title"
                  color="textWhite"
                />
              </BalanceLine>
              <ConnectionsButton
                text="See my connections"
                color="secondary"
                icon="account-balance"
                onPress={() => navigation.navigate('connections')}
              />
            </BalanceContainer>
          )}
        </TopContainer>
        <BottomSheet>
          <FlexContainer gap={16}>
            <SectionHeader>
              <Text variant="title">Summary of the month</Text>
              <SeeMoreButton text="View history" onPress={() => navigation.navigate('history')} />
            </SectionHeader>
            <FlexContainer gap={12}>
              <Text variant="default-bold">Entries</Text>
              <HorizontalBarContainer>
                <HorizontalBar color="income" grow={incomesBarGrow} />
                <Money value={totalIncomes} />
              </HorizontalBarContainer>
            </FlexContainer>
            <FlexContainer gap={12}>
              <Text variant="default-bold">Outputs</Text>
              <HorizontalBarContainer>
                <HorizontalBar
                  color="expense"
                  grow={expensesBarGrow}
                  surplusGrow={expensesSurplusGrow}
                />
                <Money value={totalExpenses} />
              </HorizontalBarContainer>
            </FlexContainer>
          </FlexContainer>
          <Divider />
          <SectionHeader>
            <Text variant="title">Latest transactions</Text>
            <SeeMoreButton text="See more" onPress={() => navigation.navigate('transactions')} />
          </SectionHeader>
          <TransactionListContainer onLayout={onTransactionListLayout}>
            {lastTransactions.map((item, index) => (
              <TransactionListItem item={item} key={index} />
            ))}
          </TransactionListContainer>
        </BottomSheet>
      </ScrollView>

      <MonthYearPicker
        isOpen={monthYearPickerOpened}
        selectedDate={date}
        minimumDate={minimumDateWithData}
        onChange={(value) => handleMonthYearPickerChange(value)}
        onClose={() => setMonthYearPickerOpened(false)}
      />
      <AddTransactionButton onPress={() => navigation.navigate('AddTransaction')} />
    </ScreenContainer>
  );
};


export default Home;
