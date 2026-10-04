function Dashboard({
  income,
  food,
  travel,
  education,
  shopping,
  other,
  savingsGoal,
}) {
  const incomeAmount =
    Number(income) || 0;

  const foodAmount =
    Number(food) || 0;

  const travelAmount =
    Number(travel) || 0;

  const educationAmount =
    Number(education) || 0;

  const shoppingAmount =
    Number(shopping) || 0;

  const otherAmount =
    Number(other) || 0;

  const goalAmount =
    Number(savingsGoal) || 0;

  // Total expenses
  const totalExpense =
    foodAmount +
    travelAmount +
    educationAmount +
    shoppingAmount +
    otherAmount;

  // Remaining balance
  const remaining =
    incomeAmount - totalExpense;

  // Savings percentage
  const savingsRate =
    incomeAmount > 0
      ? Math.max(
          0,
          (remaining / incomeAmount) * 100
        )
      : 0;

  // Expenses
  const expenses = [
    {
      name: "Food",
      amount: foodAmount,
      icon: "🍔",
    },
    {
      name: "Travel",
      amount: travelAmount,
      icon: "🚌",
    },
    {
      name: "Education",
      amount: educationAmount,
      icon: "📚",
    },
    {
      name: "Shopping",
      amount: shoppingAmount,
      icon: "🛍️",
    },
    {
      name: "Other",
      amount: otherAmount,
      icon: "📦",
    },
  ];

  // Highest expense
  const highestExpense =
    expenses.reduce(
      (max, expense) =>
        expense.amount > max.amount
          ? expense
          : max,
      expenses[0]
    );

  // Savings progress
  const savingsProgress =
    goalAmount > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (remaining / goalAmount) * 100
          )
        )
      : 0;

  // Expense percentage
  const expenseRate =
    incomeAmount > 0
      ? Math.min(
          100,
          (totalExpense / incomeAmount) * 100
        )
      : 0;

  return (
    <div className="dashboard">

      {/* Dashboard Heading */}
      <div className="dashboard-heading">

        <div>
          <h2>
            📊 Financial Dashboard
          </h2>

          <p>
            Here's a summary of your monthly
            financial activity.
          </p>
        </div>

        <div className="dashboard-status">

          {remaining < 0 ? (
            <span className="status-danger">
              ⚠️ Over Budget
            </span>
          ) : goalAmount > 0 &&
            remaining >= goalAmount ? (
            <span className="status-success">
              🎉 Goal Achieved
            </span>
          ) : (
            <span className="status-normal">
              💡 Keep Saving
            </span>
          )}

        </div>

      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">

        {/* Income */}
        <div className="dashboard-card income-dashboard">

          <div className="dashboard-icon">
            💰
          </div>

          <div>
            <h4>
              Monthly Income
            </h4>

            <h3>
              ₹
              {incomeAmount.toLocaleString(
                "en-IN"
              )}
            </h3>

            <small>
              Your total monthly income
            </small>
          </div>

        </div>

        {/* Expenses */}
        <div className="dashboard-card expense-dashboard">

          <div className="dashboard-icon">
            💸
          </div>

          <div>
            <h4>
              Total Expenses
            </h4>

            <h3>
              ₹
              {totalExpense.toLocaleString(
                "en-IN"
              )}
            </h3>

            <small>
              {expenseRate.toFixed(1)}%
              {" "}of income
            </small>
          </div>

        </div>

        {/* Balance */}
        <div className="dashboard-card balance-dashboard">

          <div className="dashboard-icon">
            💵
          </div>

          <div>
            <h4>
              Remaining Balance
            </h4>

            <h3
              className={
                remaining < 0
                  ? "negative-balance"
                  : "positive-balance"
              }
            >
              ₹
              {remaining.toLocaleString(
                "en-IN"
              )}
            </h3>

            <small>
              Available after expenses
            </small>
          </div>

        </div>

        {/* Savings */}
        <div className="dashboard-card savings-dashboard">

          <div className="dashboard-icon">
            🎯
          </div>

          <div>
            <h4>
              Savings Rate
            </h4>

            <h3>
              {savingsRate.toFixed(1)}%
            </h3>

            <small>
              Based on remaining balance
            </small>
          </div>

        </div>

      </div>

      {/* Analysis */}
      <div className="analysis-section">

        {/* Expense Analysis */}
        <div className="chart-card">

          <h3>
            📈 Expense Analysis
          </h3>

          <p className="card-description">
            See where your money is going
          </p>

          <div className="expense-bars">

            {expenses.map(
              (expense) => {

                const percentage =
                  totalExpense > 0
                    ? (expense.amount /
                        totalExpense) *
                      100
                    : 0;

                return (
                  <div
                    className="expense-row"
                    key={expense.name}
                  >

                    <div className="expense-label">

                      <span>
                        {expense.icon}{" "}
                        {expense.name}
                      </span>

                      <strong>
                        ₹
                        {expense.amount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                    <div className="bar-background">

                      <div
                        className="bar-fill"
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      ></div>

                    </div>

                    <small>
                      {percentage.toFixed(1)}%
                    </small>

                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* Summary */}
        <div className="summary-card">

          <h3>
            🔍 Spending Summary
          </h3>

          <p className="card-description">
            Your current financial overview
          </p>

          <div className="summary-item">

            <span>
              🏆 Highest Expense
            </span>

            <strong>
              {highestExpense?.name ||
                "None"}
            </strong>

          </div>

          <div className="summary-item">

            <span>
              💸 Highest Amount
            </span>

            <strong>
              ₹
              {highestExpense?.amount?.toLocaleString(
                "en-IN"
              ) || 0}
            </strong>

          </div>

          <div className="summary-item">

            <span>
              🎯 Savings Goal
            </span>

            <strong>
              ₹
              {goalAmount.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <div className="summary-item">

            <span>
              💰 Available Balance
            </span>

            <strong>
              ₹
              {remaining.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          {/* Savings Progress */}
          {goalAmount > 0 && (
            <div className="savings-progress">

              <div className="progress-heading">

                <span>
                  Savings Goal Progress
                </span>

                <strong>
                  {savingsProgress.toFixed(0)}%
                </strong>

              </div>

              <div className="progress-background">

                <div
                  className="progress-fill"
                  style={{
                    width:
                      `${savingsProgress}%`,
                  }}
                ></div>

              </div>

            </div>
          )}

          {/* Financial Status */}
          <div className="financial-status">

            {remaining < 0 ? (
              <>
                <span>⚠️</span>

                <p>
                  Your expenses are higher
                  than your income. Try
                  reducing unnecessary
                  spending.
                </p>
              </>
            ) : goalAmount > 0 &&
              remaining >= goalAmount ? (
              <>
                <span>🎉</span>

                <p>
                  Great job! You have enough
                  remaining balance to reach
                  your savings goal.
                </p>
              </>
            ) : remaining > 0 ? (
              <>
                <span>💡</span>

                <p>
                  You have a positive balance.
                  Try saving more of it for
                  your future goals.
                </p>
              </>
            ) : (
              <>
                <span>📊</span>

                <p>
                  Enter your monthly income
                  and expenses to see your
                  financial analysis.
                </p>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;