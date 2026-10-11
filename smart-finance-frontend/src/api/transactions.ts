import apiClient from './client';

export interface Transaction {
  id: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
  date: string;
}

export interface TransactionData {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
  date: string;
}

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await apiClient.get('/transactions');
  return response.data;
};

export const createTransaction = async (data: TransactionData): Promise<Transaction> => {
  const response = await apiClient.post('/transactions', data);
  return response.data;
};

export const updateTransaction = async (id: number, data: TransactionData): Promise<Transaction> => {
  const response = await apiClient.put(`/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await apiClient.delete(`/transactions/${id}`);
};