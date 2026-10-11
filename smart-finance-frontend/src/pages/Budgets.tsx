import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import {
  getBudgets,
  createBudget,
  deleteBudget,
  type Budget,
  type BudgetData,
} from "../api/budgets";

const now = new Date();
const emptyForm: BudgetData = {
  category: "",
  limitAmount: 0,
  month: now.getMonth() + 1,
  year: now.getFullYear(),
};

function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<BudgetData>(emptyForm);
  const { showToast } = useToast();

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await getBudgets();
      setBudgets(data);
      setError("");
    } catch {
      setError("Unable to load your budgets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "category" ? value : name === "limitAmount" ? Math.max(0, Number(value)) : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBudget(form);
      setForm(emptyForm);
      await fetchBudgets();
      showToast("Budget added");
    } catch {
      showToast("Unable to save this budget. Please try again.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this budget? This can't be undone.");
    if (!confirmed) return;
    try {
      await deleteBudget(id);
      await fetchBudgets();
      showToast("Budget deleted");
    } catch {
      showToast("Unable to delete this budget. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="stat-grid">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    );
  }

  return (
    <div>
      {error && <div className="error-state" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="panel" style={{ marginBottom: 24 }}>
        <h2 className="panel-title">Add a budget</h2>
        <form className="tx-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category (e.g. Food)"
            required
          />
          <input
            type="number"
            name="limitAmount"
            value={form.limitAmount}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Monthly limit"
            required
          />
          <input
            type="number"
            name="month"
            value={form.month}
            onChange={handleChange}
            min={1}
            max={12}
            placeholder="Month"
            required
          />
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="Year"
            required
          />
          <button type="submit" className="btn-primary">Add</button>
        </form>
      </div>

      <div className="panel">
        <h2 className="panel-title">All budgets</h2>
        {budgets.length === 0 ? (
          <div className="empty-state">
            <p>No budgets yet.</p>
            <span>Set a monthly spending limit for a category above to start tracking it.</span>
          </div>
        ) : (
          <div className="budget-list">
            {budgets.map((b) => {
              const pct = b.limitAmount > 0 ? Math.min((b.spentAmount / b.limitAmount) * 100, 100) : 0;
              const overBudget = b.remainingAmount < 0;
              return (
                <div key={b.id} className="budget-card">
                  <div className="budget-card-header">
                    <div>
                      <strong>{b.category}</strong>
                      <span className="text-muted" style={{ marginLeft: 8, fontSize: 13 }}>
                        {b.month}/{b.year}
                      </span>
                    </div>
                    <button className="btn-danger" onClick={() => handleDelete(b.id)}>Delete</button>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className={`progress-bar-fill ${overBudget ? "over-budget" : ""}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="budget-card-footer">
                    <span className={overBudget ? "negative" : "text-muted"}>
                      Rs. {b.spentAmount.toLocaleString()} spent
                    </span>
                    <span className="text-muted">of Rs. {b.limitAmount.toLocaleString()}</span>
                    <span className={overBudget ? "negative" : "positive"}>
                      {overBudget
                        ? `Rs. ${Math.abs(b.remainingAmount).toLocaleString()} over`
                        : `Rs. ${b.remainingAmount.toLocaleString()} left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Budgets;