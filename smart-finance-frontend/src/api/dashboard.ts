import apiClient from "./client";

export interface DashboardData {
  totalIncome: number;
  totalExpense: number;
  savings: number;
  expenseByCategory: Record<string, number>;
}

export async function getDashboard(): Promise<DashboardData> {
  const response = await apiClient.get("/dashboard");
  return response.data;
}
