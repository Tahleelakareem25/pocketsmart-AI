const express = require("express");

const router = express.Router();

const Budget = require("../models/Budget");

/* =========================================
   GET ALL BUDGETS
========================================= */

router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find().sort({
      createdAt: -1,
    });

    res.json(budgets);
  } catch (error) {
    console.error(
      "Failed to fetch budgets:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch budgets",
      error: error.message,
    });
  }
});


/* =========================================
   POST NEW BUDGET
========================================= */

router.post("/", async (req, res) => {
  try {
    const {
      income,
      food,
      transport,
      shopping,
      other,
      savings,
    } = req.body;

    const monthlyIncome =
      Number(income || 0);

    const foodExpense =
      Number(food || 0);

    const transportExpense =
      Number(transport || 0);

    const shoppingExpense =
      Number(shopping || 0);

    const otherExpense =
      Number(other || 0);

    const savingsTarget =
      Number(savings || 0);

    /* Calculate total expenses */

    const totalExpense =
      foodExpense +
      transportExpense +
      shoppingExpense +
      otherExpense;

    /* Calculate remaining balance */

    const remainingBalance =
      monthlyIncome -
      totalExpense;

    /* Create budget */

    const budget = new Budget({
      income: monthlyIncome,

      food: foodExpense,

      transport: transportExpense,

      shopping: shoppingExpense,

      other: otherExpense,

      savings: savingsTarget,

      totalExpense: totalExpense,

      remainingBalance:
        remainingBalance,
    });

    /* Save to MongoDB */

    const savedBudget =
      await budget.save();

    console.log(
      "Budget saved successfully:",
      savedBudget._id
    );

    res.status(201).json(
      savedBudget
    );
  } catch (error) {
    console.error(
      "Failed to save budget:",
      error
    );

    res.status(500).json({
      message: "Failed to save budget",
      error: error.message,
    });
  }
});


/* =========================================
   DELETE BUDGET
========================================= */

router.delete("/:id", async (req, res) => {
  try {
    const deletedBudget =
      await Budget.findByIdAndDelete(
        req.params.id
      );

    if (!deletedBudget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    res.json({
      message:
        "Budget deleted successfully",
    });
  } catch (error) {
    console.error(
      "Failed to delete budget:",
      error
    );

    res.status(500).json({
      message: "Failed to delete budget",
      error: error.message,
    });
  }
});


/* =========================================
   EXPORT ROUTER
========================================= */

module.exports = router;