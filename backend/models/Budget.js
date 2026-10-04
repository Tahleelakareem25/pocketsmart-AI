const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    income: {
      type: Number,
      required: true,
    },

    food: {
      type: Number,
      default: 0,
    },

    transport: {
      type: Number,
      default: 0,
    },

    shopping: {
      type: Number,
      default: 0,
    },

    other: {
      type: Number,
      default: 0,
    },

    savings: {
      type: Number,
      default: 0,
    },

    totalExpense: {
      type: Number,
      default: 0,
    },

    remainingBalance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;