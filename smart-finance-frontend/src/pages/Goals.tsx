import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import {
  getGoals,
  createGoal,
  updateGoalProgress,
  deleteGoal,
  type Goal,
  type GoalData,
} from "../api/goals";

const emptyForm: GoalData = {
  name: "",
  targetAmount: 0,
  targetDate: new Date().toISOString().split("T")[0],
};

function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<GoalData>(emptyForm);
  const [progressInputs, setProgressInputs] = useState<Record<number, string>>({});
  const { showToast } = useToast();

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await getGoals();
      setGoals(data);
      setError("");
    } catch {
      setError("Unable to load your goals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "targetAmount" ? Math.max(0, Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGoal(form);
      setForm(emptyForm);
      await fetchGoals();
      showToast("Goal added");
    } catch {
      showToast("Unable to save this goal. Please try again.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this goal? This can't be undone.");
    if (!confirmed) return;
    try {
      await deleteGoal(id);
      await fetchGoals();
      showToast("Goal deleted");
    } catch {
      showToast("Unable to delete this goal. Please try again.", "error");
    }
  };

  const handleProgressInputChange = (id: number, value: string) => {
    setProgressInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogProgress = async (id: number) => {
    const raw = progressInputs[id];
    if (raw === undefined || raw === "") return;
    try {
      await updateGoalProgress(id, Math.max(0, Number(raw)));
      setProgressInputs((prev) => ({ ...prev, [id]: "" }));
      await fetchGoals();
      showToast("Progress updated");
    } catch {
      showToast("Unable to update progress. Please try again.", "error");
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
        <h2 className="panel-title">Add a goal</h2>
        <form className="tx-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Goal name (e.g. New Laptop)"
            required
          />
          <input
            type="number"
            name="targetAmount"
            value={form.targetAmount}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Target amount"
            required
          />
          <input
            type="date"
            name="targetDate"
            value={form.targetDate}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary">Add</button>
        </form>
      </div>

      <div className="panel">
        <h2 className="panel-title">All goals</h2>
        {goals.length === 0 ? (
          <div className="empty-state">
            <p>No goals yet.</p>
            <span>Set a savings target above to start tracking your progress.</span>
          </div>
        ) : (
          <div className="goal-list">
            {goals.map((g) => {
              const pct = Math.min(g.progressPercent, 100);
              const reached = g.currentAmount >= g.targetAmount;
              return (
                <div key={g.id} className="goal-card">
                  <div className="goal-card-header">
                    <div>
                      <strong>{g.name}</strong>
                      <span className="text-muted" style={{ marginLeft: 8, fontSize: 13 }}>
                        by {g.targetDate}
                      </span>
                    </div>
                    <button className="btn-danger" onClick={() => handleDelete(g.id)}>Delete</button>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className={`progress-bar-fill ${reached ? "" : ""}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="goal-card-footer" style={{ marginBottom: 12 }}>
                    <span className={reached ? "positive" : "text-muted"}>
                      Rs. {g.currentAmount.toLocaleString()} saved
                    </span>
                    <span className="text-muted">of Rs. {g.targetAmount.toLocaleString()}</span>
                    <span className="text-muted">{g.progressPercent.toFixed(1)}%</span>
                  </div>
                  <div className="tx-form" style={{ gap: 8 }}>
                    <input
                      type="number"
                      placeholder="Update saved amount"
                      value={progressInputs[g.id] ?? ""}
                      onChange={(e) => handleProgressInputChange(g.id, e.target.value)}
                    />
                    <button className="btn-secondary" onClick={() => handleLogProgress(g.id)}>
                      Log progress
                    </button>
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

export default Goals;