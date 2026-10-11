import { useState, useEffect, useMemo } from "react";
import { useToast } from "../context/ToastContext";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  type Transaction,
  type TransactionData,
} from "../api/transactions";

const emptyForm: TransactionData = {
  amount: 0,
  type: "EXPENSE",
  category: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
};

type TypeFilter = "ALL" | "INCOME" | "EXPENSE";
type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<TransactionData>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const { showToast } = useToast();
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
      setError("");
    } catch {
      setError("Unable to load your transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const visibleTransactions = useMemo(() => {
    let result = transactions;

    if (typeFilter !== "ALL") {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (search.trim() !== "") {
      const term = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.category.toLowerCase().includes(term) ||
          (t.description ?? "").toLowerCase().includes(term)
      );
    }

    const sorted = [...result].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return b.date.localeCompare(a.date);
        case "date-asc":
          return a.date.localeCompare(b.date);
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return sorted;
  }, [transactions, search, typeFilter, sortBy]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Math.max(0, Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        await updateTransaction(editingId, form);
      } else {
        await createTransaction(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await fetchTransactions();
      showToast(editingId !== null ? "Transaction updated" : "Transaction added");
    } catch {
      showToast("Unable to save this transaction. Please try again.", "error");
    }
  };

  const handleEdit = (t: Transaction) => {
    setEditingId(t.id);
    setForm({
      amount: t.amount,
      type: t.type,
      category: t.category,
      description: t.description,
      date: t.date,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this transaction? This can't be undone.");
    if (!confirmed) return;
    try {
      await deleteTransaction(id);
      await fetchTransactions();
      showToast("Transaction deleted");
    } catch {
      showToast("Unable to delete this transaction. Please try again.", "error");
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
        <h2 className="panel-title">{editingId !== null ? "Edit transaction" : "Add a transaction"}</h2>
        <form className="tx-form" onSubmit={handleSubmit}>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
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
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary">
            {editingId !== null ? "Update" : "Add"}
          </button>
          {editingId !== null && (
            <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="panel">
        <div className="tx-toolbar">
          <input
            type="text"
            className="tx-search"
            placeholder="Search by category or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}>
            <option value="ALL">All types</option>
            <option value="INCOME">Income only</option>
            <option value="EXPENSE">Expense only</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Amount: high to low</option>
            <option value="amount-asc">Amount: low to high</option>
          </select>
        </div>

        <h2 className="panel-title">
          All transactions
          {transactions.length > 0 && (
            <span className="text-muted" style={{ fontWeight: 400, fontSize: 13, marginLeft: 8 }}>
              ({visibleTransactions.length} of {transactions.length})
            </span>
          )}
        </h2>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet.</p>
            <span>Add your first transaction above to start tracking your finances.</span>
          </div>
        ) : visibleTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions match your filters.</p>
            <span>Try adjusting your search or filter settings.</span>
          </div>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibleTransactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.category}</td>
                  <td className="text-muted">{t.description || "â€”"}</td>
                  <td>{t.type}</td>
                  <td className={t.type === "INCOME" ? "positive" : "negative"}>
                    Rs. {t.amount.toLocaleString()}
                  </td>
                  <td className="tx-actions">
                    <button className="btn-secondary" onClick={() => handleEdit(t)}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
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

export default Transactions;