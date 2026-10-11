import apiClient from "./client";

export interface Budget {
  id: number;
  category: string;
  limitAmount: number;
  month: number;
  year: number;
  spentAmount: number;
  remainingAmount: number;
}

export interface BudgetData {
  category: string;
  limitAmount: number;
  month: number;
  year: number;
}

export const getBudgets = async (): Promise<Budget[]> => {
  const response = await apiClient.get("/budgets");
  return response.data;
};

export const createBudget = async (data: BudgetData): Promise<Budget> => {
  const response = await apiClient.post("/budgets", data);
  return response.data;
};

export const updateBudget = async (id: number, data: BudgetData): Promise<Budget> => {
  const response = await apiClient.put(`/budgets/${id}`, data);
  return response.data;
};

export const deleteBudget = async (id: number): Promise<void> => {
  await apiClient.delete(`/budgets/${id}`);
};