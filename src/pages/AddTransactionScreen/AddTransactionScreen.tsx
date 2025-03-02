import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';
import { useTransaction } from '../../contexts/TransactionContext';

const AddTransactionScreen = () => {
  const { addTransaction, transactionHistory, totalBalance } = useTransaction();
  const [amount, setAmount] = useState<string>('');

  const handleAddTransaction = () => {
    const transactionAmount = parseFloat(amount);
    if (!isNaN(transactionAmount)) {
      addTransaction(transactionAmount);
      setAmount('');
    } else {
      alert('Please enter a valid number.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Balance: ₹{totalBalance.toFixed(2)}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
      />
      <Button title="Add Transaction" onPress={handleAddTransaction} />
      <Text style={styles.historyTitle}>Latest Transactions</Text>
      <FlatList
        data={transactionHistory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text>
              Transaction #{item.id}: ₹{item.amount.toFixed(2)}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default AddTransactionScreen;
