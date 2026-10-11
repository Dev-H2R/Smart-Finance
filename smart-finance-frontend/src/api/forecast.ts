import apiClient from "./client";

export interface CategoryForecast {
  category: string;
  predicted_amount: number;
  months_of_data: number;
  method: string;
}

export interface ForecastData {
  forecast_month: string;
  forecasts: CategoryForecast[];
}

export async function getForecast(): Promise<ForecastData> {
  const response = await apiClient.get("/forecast");
  return response.data;
}