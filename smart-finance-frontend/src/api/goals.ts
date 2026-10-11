import apiClient from "./client";

export interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  progressPercent: number;
}

export interface GoalData {
  name: string;
  targetAmount: number;
  targetDate: string;
}

export const getGoals = async (): Promise<Goal[]> => {
  const response = await apiClient.get("/goals");
  return response.data;
};

export const createGoal = async (data: GoalData): Promise<Goal> => {
  const response = await apiClient.post("/goals", data);
  return response.data;
};

export const updateGoal = async (id: number, data: GoalData): Promise<Goal> => {
  const response = await apiClient.put(`/goals/${id}`, data);
  return response.data;
};

export const updateGoalProgress = async (id: number, currentAmount: number): Promise<Goal> => {
  const response = await apiClient.patch(`/goals/${id}/progress`, { currentAmount });
  return response.data;
};

export const deleteGoal = async (id: number): Promise<void> => {
  await apiClient.delete(`/goals/${id}`);
};