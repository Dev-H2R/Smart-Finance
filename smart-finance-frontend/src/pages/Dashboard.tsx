import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, type DashboardData } from "../api/dashboard";
import { getForecast, type ForecastData } from "../api/forecast";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [forecastLoading, setForecastLoading] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    getDashboard()
      .then((result) => setData(result))
      .catch(() => setError("Unable to load your dashboard. Please try again."))
      .finally(() => setLoading(false));

    getForecast()
  .then((result) => setForecast(result))
  .catch(() => setForecast(null))
  .finally(() => setForecastLoading(false));  }, [navigate]);

  if (loading) {
    return (
      <div className="stat-grid">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    );
  }

  if (error) return <div className="error-state">{error}</div>;
  if (!data) return null;

  const categories = Object.entries(data.expenseByCategory);

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Total Income</span>
          <span className="stat-value positive">Rs. {data.totalIncome.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Expense</span>
          <span className="stat-value negative">Rs. {data.totalExpense.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Savings</span>
          <span className={`stat-value ${data.savings >= 0 ? "positive" : "negative"}`}>
            Rs. {data.savings.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">Expenses by Category</h2>
        {categories.length === 0 ? (
          <div className="empty-state">
            <p>No expenses recorded yet.</p>
            <span>Add a transaction to see your spending breakdown here.</span>
          </div>
        ) : (
          <ul className="category-list">
            {categories.map(([category, amount]) => (
              <li key={category} className="category-row">
                <span>{category}</span>
                <span className="negative">Rs. {amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

     <div className="panel">
  <h2 className="panel-title">
    {forecast ? `Forecast for ${forecast.forecast_month}` : "Forecast"}
  </h2>
  {forecastLoading ? (
    <div className="skeleton-card" />
  ) : !forecast || forecast.forecasts.length === 0 ? (
          <div className="empty-state">
            <p>Not enough data yet for a forecast.</p>
            <span>Add transactions across a couple of months to see predictions here.</span>
          </div>
        ) : (
          <ul className="category-list">
            {forecast.forecasts.map((f) => (
              <li key={f.category} className="category-row">
                <span>{f.category}</span>
                <span className="negative">Rs. {f.predicted_amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}