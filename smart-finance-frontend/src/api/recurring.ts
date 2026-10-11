import apiClient from "./client";

export type RecurringFrequency = "DAILY" | "WEEKLY" | "MONTHLY";

export interface RecurringTransaction {
  id: number;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description: string;
  frequency: RecurringFrequency;
  nextDueDate: string;
  active: boolean;
}

export interface RecurringTransactionData {
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description: string;
  frequency: RecurringFrequency;
  nextDueDate: string;
}

export const getRecurring = async (): Promise<RecurringTransaction[]> => {
  const response = await apiClient.get("/recurring-transactions");
  return response.data;
};

export const createRecurring = async (data: RecurringTransactionData): Promise<RecurringTransaction> => {
  const response = await apiClient.post("/recurring-transactions", data);
  return response.data;
};

export const setRecurringActive = async (id: number, active: boolean): Promise<RecurringTransaction> => {
  const response = await apiClient.patch(`/recurring-transactions/${id}/active?active=${active}`);
  return response.data;
};

export const deleteRecurring = async (id: number): Promise<void> => {
  await apiClient.delete(`/recurring-transactions/${id}`);
};