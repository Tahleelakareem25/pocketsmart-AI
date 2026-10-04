import { useState } from "react";

function BudgetForm({ onBudgetUpdate }) {
  const [income, setIncome] = useState("");
  const [food, setFood] = useState("");
  const [transport, setTransport] = useState("");
  const [shopping, setShopping] = useState("");
  const [other, setOther] = useState("");
  const [savings, setSavings] = useState("");

  const [message, setMessage] = useState("");
  const [recommendation, setRecommendation] =
    useState("");

  const [recommendationSource, setRecommendationSource] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  /* =========================================
     CALCULATE EXPENSES
  ========================================= */

  const totalExpense =
    Number(food || 0) +
    Number(transport || 0) +
    Number(shopping || 0) +
    Number(other || 0);

  const remainingBalance =
    Number(income || 0) - totalExpense;

  /* =========================================
     UPDATE DASHBOARD
  ========================================= */

  const updateDashboard = () => {
    if (onBudgetUpdate) {
      onBudgetUpdate({
        income: Number(income || 0),
        food: Number(food || 0),
        travel: Number(transport || 0),
        education: 0,
        shopping: Number(shopping || 0),
        other: Number(other || 0),
        savingsGoal: Number(savings || 0),
      });
    }
  };

  /* =========================================
     SAVE BUDGET
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!income) {
      setMessage(
        "Please enter your monthly income."
      );
      return;
    }

    updateDashboard();

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/budgets",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            income: Number(income),
            food: Number(food || 0),
            transport: Number(transport || 0),
            shopping: Number(shopping || 0),
            other: Number(other || 0),
            savings: Number(savings || 0),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save budget"
        );
      }

      setMessage(
        "✅ Budget saved successfully!"
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "❌ Failed to save budget. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     AI RECOMMENDATION
  ========================================= */

  const getAIRecommendation = async () => {
    if (!income) {
      setMessage(
        "Please enter your monthly income first."
      );
      return;
    }

    updateDashboard();

    try {
      setAiLoading(true);

      setRecommendation("");

      setRecommendationSource("");

      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/ai/recommend",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            income: Number(income),
            food: Number(food || 0),
            transport: Number(transport || 0),
            shopping: Number(shopping || 0),
            other: Number(other || 0),
            savings: Number(savings || 0),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "❌ AI recommendation failed."
        );

        return;
      }

      setRecommendation(
        data.recommendation || ""
      );

      setRecommendationSource(
        data.source ||
          "PocketSmart Smart Recommendation"
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "❌ Cannot connect to the AI server. Please make sure the backend is running."
      );
    } finally {
      setAiLoading(false);
    }
  };

  /* =========================================
     CLEAR / RESET
  ========================================= */

  const handleReset = () => {
    setIncome("");
    setFood("");
    setTransport("");
    setShopping("");
    setOther("");
    setSavings("");

    setMessage("");
    setRecommendation("");
    setRecommendationSource("");

    if (onBudgetUpdate) {
      onBudgetUpdate({
        income: 0,
        food: 0,
        travel: 0,
        education: 0,
        shopping: 0,
        other: 0,
        savingsGoal: 0,
      });
    }
  };

  /* =========================================
     CHECK AI SOURCE
  ========================================= */

  const isGemini =
    recommendationSource === "Gemini AI";

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="budget-container">

      {/* =====================================
          HEADING
      ===================================== */}

      <div className="form-heading">
        <div>
          <h2>
            💰 Monthly Budget
          </h2>

          <p>
            Enter your monthly income and
            expenses to analyze your spending.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* =================================
            INCOME
        ================================= */}

        <div className="form-group">
          <label>
            Monthly Income (₹)
          </label>

          <input
            type="number"
            min="0"
            value={income}
            onChange={(e) =>
              setIncome(e.target.value)
            }
            placeholder="Example: 25000"
          />
        </div>

        {/* =================================
            FOOD
        ================================= */}

        <div className="form-group">
          <label>
            🍔 Food Expense (₹)
          </label>

          <input
            type="number"
            min="0"
            value={food}
            onChange={(e) =>
              setFood(e.target.value)
            }
            placeholder="Example: 5000"
          />
        </div>

        {/* =================================
            TRANSPORT
        ================================= */}

        <div className="form-group">
          <label>
            🚌 Transport Expense (₹)
          </label>

          <input
            type="number"
            min="0"
            value={transport}
            onChange={(e) =>
              setTransport(e.target.value)
            }
            placeholder="Example: 3000"
          />
        </div>

        {/* =================================
            SHOPPING
        ================================= */}

        <div className="form-group">
          <label>
            🛍️ Shopping Expense (₹)
          </label>

          <input
            type="number"
            min="0"
            value={shopping}
            onChange={(e) =>
              setShopping(e.target.value)
            }
            placeholder="Example: 2000"
          />
        </div>

        {/* =================================
            OTHER
        ================================= */}

        <div className="form-group">
          <label>
            📦 Other Expense (₹)
          </label>

          <input
            type="number"
            min="0"
            value={other}
            onChange={(e) =>
              setOther(e.target.value)
            }
            placeholder="Example: 1000"
          />
        </div>

        {/* =================================
            SAVINGS
        ================================= */}

        <div className="form-group">
          <label>
            💵 Savings Target (₹)
          </label>

          <input
            type="number"
            min="0"
            value={savings}
            onChange={(e) =>
              setSavings(e.target.value)
            }
            placeholder="Example: 5000"
          />
        </div>

        {/* =================================
            SUMMARY
        ================================= */}

        <div className="budget-summary">

          <div>
            <span>
              Total Expense
            </span>

            <strong>
              ₹
              {totalExpense.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div>
            <span>
              Remaining Balance
            </span>

            <strong
              className={
                remainingBalance < 0
                  ? "negative-balance"
                  : ""
              }
            >
              ₹
              {remainingBalance.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

        </div>

        {/* =================================
            SAVE BUTTON
        ================================= */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "💾 Save Budget"}
        </button>

        {/* =================================
            AI BUTTON
        ================================= */}

        <button
          type="button"
          onClick={getAIRecommendation}
          disabled={aiLoading}
          className="ai-button"
        >
          {aiLoading
            ? "🤖 AI is analyzing..."
            : "🤖 Get AI Recommendation"}
        </button>

        {/* =================================
            RESET BUTTON
        ================================= */}

        <button
          type="button"
          onClick={handleReset}
          className="reset-button"
        >
          🔄 Clear / Reset
        </button>

        {/* =================================
            MESSAGE
        ================================= */}

        {message && (
          <div className="message">
            {message}
          </div>
        )}

      </form>

      {/* =====================================
          AI RECOMMENDATION
      ===================================== */}

      {recommendation && (
        <div className="recommendation-box">

          {/* AI HEADER */}

          <div className="recommendation-header">

            <div className="ai-icon">
              {isGemini
                ? "🧠"
                : "💡"}
            </div>

            <div>

              <h3>
                PocketSmart AI
              </h3>

              <span>
                {isGemini
                  ? "Gemini AI Recommendation"
                  : "Smart Budget Recommendation"}
              </span>

            </div>

          </div>

          {/* RECOMMENDATION */}

          <div className="recommendation-content">

            <p>
              {recommendation}
            </p>

          </div>

          {/* FOOTER */}

          <div className="recommendation-footer">

            {isGemini ? (
              <>
                🧠 Powered by Gemini AI •
                Review your spending regularly
                to improve your savings.
              </>
            ) : (
              <>
                💡 Powered by PocketSmart Smart
                Analysis • Review your spending
                regularly to improve your savings.
              </>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default BudgetForm;