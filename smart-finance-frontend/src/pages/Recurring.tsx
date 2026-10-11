import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import {
  getRecurring,
  createRecurring,
  setRecurringActive,
  deleteRecurring,
  type RecurringTransaction,
  type RecurringTransactionData,
} from "../api/recurring";

const emptyForm: RecurringTransactionData = {
  amount: 0,
  type: "EXPENSE",
  category: "",
  description: "",
  frequency: "MONTHLY",
  nextDueDate: new Date().toISOString().split("T")[0],
};

function Recurring() {
  const [items, setItems] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<RecurringTransactionData>(emptyForm);
  const { showToast } = useToast();

  const fetchRecurring = async () => {
    try {
      setLoading(true);
      const data = await getRecurring();
      setItems(data);
      setError("");
    } catch {
      setError("Unable to load your recurring transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRecurring(form);
      setForm(emptyForm);
      await fetchRecurring();
      showToast("Recurring transaction added");
    } catch {
      showToast("Unable to save this recurring transaction. Please try again.", "error");
    }
  };

  const handleToggleActive = async (item: RecurringTransaction) => {
    try {
      await setRecurringActive(item.id, !item.active);
      await fetchRecurring();
      showToast(item.active ? "Paused" : "Resumed");
    } catch {
      showToast("Unable to update this recurring transaction. Please try again.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this recurring transaction? This can't be undone.");
    if (!confirmed) return;
    try {
      await deleteRecurring(id);
      await fetchRecurring();
      showToast("Recurring transaction deleted");
    } catch {
      showToast("Unable to delete this recurring transaction. Please try again.", "error");
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
        <h2 className="panel-title">Add a recurring transaction</h2>
        <form className="tx-form" onSubmit={handleSubmit}>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            required
          />
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <select name="frequency" value={form.frequency} onChange={handleChange}>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
          <input
            type="date"
            name="nextDueDate"
            value={form.nextDueDate}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary">Add</button>
        </form>
      </div>

      <div className="panel">
        <h2 className="panel-title">All recurring transactions</h2>
        {items.length === 0 ? (
          <div className="empty-state">
            <p>No recurring transactions yet.</p>
            <span>Set up a repeating bill or income above and it'll generate automatically.</span>
          </div>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Frequency</th>
                <th>Next due</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.category}</td>
                  <td className="text-muted">{r.description || "â€”"}</td>
                  <td>{r.type}</td>
                  <td className={r.type === "INCOME" ? "positive" : "negative"}>
                    Rs. {r.amount.toLocaleString()}
                  </td>
                  <td className="text-muted">{r.frequency}</td>
                  <td className="text-muted">{r.nextDueDate}</td>
                  <td className={r.active ? "positive" : "text-muted"}>
                    {r.active ? "Active" : "Paused"}
                  </td>
                  <td className="tx-actions">
                    <button className="btn-secondary" onClick={() => handleToggleActive(r)}>
                      {r.active ? "Pause" : "Resume"}
                    </button>
                    <button className="btn-danger" onClick={() => handleDelete(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Recurring;