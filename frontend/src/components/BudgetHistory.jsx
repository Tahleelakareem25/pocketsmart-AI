import { useEffect, useState } from "react";

function BudgetHistory() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/budgets"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch budgets"
        );
      }

      setBudgets(data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load budget history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const deleteBudget = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/budgets/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete budget"
        );
      }

      setBudgets((previousBudgets) =>
        previousBudgets.filter(
          (budget) => budget._id !== id
        )
      );

      setMessage("✅ Budget deleted successfully.");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to delete budget.");
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="history-heading">
          <div>
            <h2>📋 Budget History</h2>
            <p>Your previously saved budgets</p>
          </div>
        </div>

        <div className="history-loading">
          ⏳ Loading budget history...
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-heading">
        <div>
          <h2>📋 Budget History</h2>
          <p>
            View and manage your previously saved
            monthly budgets.
          </p>
        </div>

        <button
          className="refresh-history-button"
          onClick={fetchBudgets}
        >
          🔄 Refresh
        </button>
      </div>

      {message && (
        <div className="history-message">
          {message}
        </div>
      )}

      {budgets.length === 0 ? (
        <div className="empty-history">
          <div className="empty-history-icon">
            📊
          </div>

          <h3>No Budget History</h3>

          <p>
            Save your first budget to see it here.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {budgets.map((budget, index) => (
            <div
              className="history-card"
              key={budget._id}
            >
              <div className="history-card-header">
                <div>
                  <span className="history-number">
                    Budget #{budgets.length - index}
                  </span>

                  <span className="history-date">
                    {formatDate(budget.createdAt)}
                  </span>
                </div>

                <button
                  className="delete-history-button"
                  onClick={() =>
                    deleteBudget(budget._id)
                  }
                >
                  🗑️ Delete
                </button>
              </div>

              <div className="history-values">
                <div className="history-value income-history">
                  <span>💰 Income</span>
                  <strong>
                    ₹
                    {Number(
                      budget.income || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="history-value expense-history">
                  <span>💸 Expenses</span>
                  <strong>
                    ₹
                    {Number(
                      budget.totalExpense || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="history-value balance-history">
                  <span>💵 Balance</span>
                  <strong
                    className={
                      Number(
                        budget.remainingBalance || 0
                      ) < 0
                        ? "negative-balance"
                        : "positive-balance"
                    }
                  >
                    ₹
                    {Number(
                      budget.remainingBalance || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="history-value savings-history">
                  <span>🎯 Savings</span>
                  <strong>
                    ₹
                    {Number(
                      budget.savings || 0
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <div className="history-breakdown">
                <h4>Expense Breakdown</h4>

                <div className="history-expenses">
                  <span>
                    🍔 Food: ₹
                    {Number(
                      budget.food || 0
                    ).toLocaleString("en-IN")}
                  </span>

                  <span>
                    🚌 Transport: ₹
                    {Number(
                      budget.transport || 0
                    ).toLocaleString("en-IN")}
                  </span>

                  <span>
                    🛍️ Shopping: ₹
                    {Number(
                      budget.shopping || 0
                    ).toLocaleString("en-IN")}
                  </span>

                  <span>
                    📦 Other: ₹
                    {Number(
                      budget.other || 0
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BudgetHistory;