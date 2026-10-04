import { useState } from "react";

import BudgetForm from "./components/BudgetForm";
import Dashboard from "./components/Dashboard";
import BudgetHistory from "./components/BudgetHistory";

import "./App.css";

function App() {
  const [budgetData, setBudgetData] =
    useState({
      income: 0,
      food: 0,
      travel: 0,
      education: 0,
      shopping: 0,
      other: 0,
      savingsGoal: 0,
    });

  const handleBudgetUpdate = (data) => {
    setBudgetData({
      income:
        Number(data.income) || 0,

      food:
        Number(data.food) || 0,

      travel:
        Number(data.travel) || 0,

      education:
        Number(data.education) || 0,

      shopping:
        Number(data.shopping) || 0,

      other:
        Number(data.other) || 0,

      savingsGoal:
        Number(data.savingsGoal) || 0,
    });
  };

  return (
    <div className="app">

      {/* =================================
          HEADER
      ================================= */}

      <header className="header">

        <div className="logo">
          💰
        </div>

        <h1>
          PocketSmart AI
        </h1>

        <p>
          Your Smart Budget &
          Recommendation Assistant
        </p>

      </header>

      {/* =================================
          MAIN CONTENT
      ================================= */}

      <main className="main-content">

        {/* BUDGET FORM */}

        <BudgetForm
          onBudgetUpdate={
            handleBudgetUpdate
          }
        />

        {/* DASHBOARD */}

        <Dashboard
          income={
            budgetData.income
          }

          food={
            budgetData.food
          }

          travel={
            budgetData.travel
          }

          education={
            budgetData.education
          }

          shopping={
            budgetData.shopping
          }

          other={
            budgetData.other
          }

          savingsGoal={
            budgetData.savingsGoal
          }
        />

        {/* BUDGET HISTORY */}

        <BudgetHistory />

      </main>

      {/* =================================
          FOOTER
      ================================= */}

      <footer className="footer">

        <p>
          © 2026 PocketSmart AI
        </p>

        <p>
          Smart Budgeting •
          AI Recommendations •
          Budget History
        </p>

      </footer>

    </div>
  );
}

export default App;