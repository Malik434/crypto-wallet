import React from 'react';
import { View, Text } from 'react-native';

// Define a type for a single transaction
type Transaction = {
  description: string;
  amount: string;
};

// Define a type for the props expected by the Transactions component
type TransactionsProps = {
  transactions: Transaction[];
};

const Transactions = ({ transactions }: TransactionsProps) => {
  return (
    <View>
      <Text>Recent Transactions</Text>
      {transactions.map((transaction, index) => (
        <View key={index}>
          <Text>{transaction.description}</Text>
          <Text>{transaction.amount}</Text>
        </View>
      ))}
    </View>
  );
};

export default Transactions;