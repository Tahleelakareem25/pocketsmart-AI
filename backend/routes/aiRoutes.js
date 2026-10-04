const express = require("express");

const router = express.Router();


// =========================================
// CHECK GEMINI API KEY
// =========================================

console.log(
  "Gemini key loaded:",
  process.env.GEMINI_API_KEY
    ? "YES"
    : "NO"
);


// =========================================
// GEMINI CLIENT
// =========================================

let aiClient = null;

async function getAIClient() {
  if (!aiClient) {
    const { GoogleGenAI } = await import(
      "@google/genai"
    );

    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return aiClient;
}


// =========================================
// WAIT FUNCTION
// =========================================

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


// =========================================
// FALLBACK RECOMMENDATION
// =========================================
// This works even when Gemini is unavailable
// or the Gemini free quota is exhausted.
// =========================================

function generateFallbackRecommendation({
  income,
  food,
  transport,
  shopping,
  other,
  savings,
}) {
  const totalExpense =
    food +
    transport +
    shopping +
    other;

  const remaining =
    income - totalExpense;

  const recommendations = [];


  // -----------------------------------------
  // SPENDING ANALYSIS
  // -----------------------------------------

  if (income <= 0) {
    recommendations.push(
      "Please enter a valid monthly income."
    );
  } else if (remaining < 0) {
    recommendations.push(
      "⚠️ Your expenses are higher than your monthly income."
    );
  } else {
    const expensePercentage =
      (totalExpense / income) * 100;

    recommendations.push(
      `📊 You are spending about ${expensePercentage.toFixed(
        1
      )}% of your monthly income.`
    );
  }


  // -----------------------------------------
  // FOOD ANALYSIS
  // -----------------------------------------

  if (
    income > 0 &&
    food > income * 0.25
  ) {
    recommendations.push(
      "🍔 Your food spending is relatively high. Try reducing outside food, snacks and food delivery expenses."
    );
  } else if (food > 0) {
    recommendations.push(
      "🍔 Your food expense is being tracked. Continue monitoring food purchases."
    );
  }


  // -----------------------------------------
  // TRANSPORT ANALYSIS
  // -----------------------------------------

  if (
    income > 0 &&
    transport > income * 0.15
  ) {
    recommendations.push(
      "🚌 Your transport spending is relatively high. Consider public transport or combining trips when possible."
    );
  } else if (transport > 0) {
    recommendations.push(
      "🚌 Your transport expenses are included in your budget."
    );
  }


  // -----------------------------------------
  // SHOPPING ANALYSIS
  // -----------------------------------------

  if (
    income > 0 &&
    shopping > income * 0.15
  ) {
    recommendations.push(
      "🛍️ Your shopping expense is relatively high. Try limiting non-essential purchases."
    );
  } else if (shopping > 0) {
    recommendations.push(
      "🛍️ Keep monitoring shopping expenses and prioritize essential purchases."
    );
  }


  // -----------------------------------------
  // OTHER EXPENSES
  // -----------------------------------------

  if (
    income > 0 &&
    other > income * 0.15
  ) {
    recommendations.push(
      "📦 Your other expenses are relatively high. Review these expenses and reduce unnecessary spending."
    );
  }


  // -----------------------------------------
  // REMAINING BALANCE
  // -----------------------------------------

  if (remaining > 0) {
    recommendations.push(
      `💰 You currently have ₹${remaining.toLocaleString(
        "en-IN"
      )} remaining after expenses.`
    );
  }


  // -----------------------------------------
  // SAVINGS TARGET
  // -----------------------------------------

  if (
    savings > 0 &&
    remaining >= savings
  ) {
    recommendations.push(
      `🎯 Your remaining balance is enough to meet your ₹${savings.toLocaleString(
        "en-IN"
      )} savings target.`
    );
  } else if (
    savings > 0 &&
    remaining > 0
  ) {
    const difference =
      savings - remaining;

    recommendations.push(
      `🎯 You are ₹${difference.toLocaleString(
        "en-IN"
      )} short of your savings target. Try reducing unnecessary expenses.`
    );
  }


  // -----------------------------------------
  // OVER BUDGET
  // -----------------------------------------

  if (remaining < 0) {
    const overspending =
      Math.abs(remaining);

    recommendations.push(
      `⚠️ You are overspending by ₹${overspending.toLocaleString(
        "en-IN"
      )}. Reduce non-essential expenses first.`
    );
  }


  // -----------------------------------------
  // FINAL RECOMMENDATION
  // -----------------------------------------

  recommendations.push(
    "💡 Review your expenses every month and prioritize needs before wants."
  );


  return recommendations.join(
    "\n\n"
  );
}


// =========================================
// AI RECOMMENDATION ROUTE
// =========================================

router.post(
  "/recommend",
  async (req, res) => {

    try {

      // -------------------------------------
      // GET DATA FROM FRONTEND
      // -------------------------------------

      const {
        income,
        food,
        transport,
        shopping,
        other,
        savings,
      } = req.body;


      // -------------------------------------
      // CONVERT VALUES TO NUMBERS
      // -------------------------------------

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


      // -------------------------------------
      // CALCULATE TOTAL EXPENSE
      // -------------------------------------

      const totalExpense =
        foodExpense +
        transportExpense +
        shoppingExpense +
        otherExpense;


      // -------------------------------------
      // CALCULATE REMAINING BALANCE
      // -------------------------------------

      const remainingBalance =
        monthlyIncome -
        totalExpense;


      // -------------------------------------
      // VALIDATE INCOME
      // -------------------------------------

      if (monthlyIncome <= 0) {

        return res.status(400).json({
          success: false,

          message:
            "Please enter a valid monthly income.",
        });

      }


      // -------------------------------------
      // GEMINI PROMPT
      // -------------------------------------

      const prompt = `
You are PocketSmart AI, a smart budget assistant for college students.

Analyze this monthly budget:

Monthly Income: ₹${monthlyIncome}

Food Expense: ₹${foodExpense}

Transport Expense: ₹${transportExpense}

Shopping Expense: ₹${shoppingExpense}

Other Expense: ₹${otherExpense}

Savings Target: ₹${savingsTarget}

Total Expenses: ₹${totalExpense}

Remaining Balance: ₹${remainingBalance}

Give a short, simple and useful financial recommendation.

Include:

1. Spending Analysis
2. Two ways to reduce expenses
3. A savings suggestion
4. One final recommendation

Use simple language suitable for a college student.

Do not provide investment advice.
`;


      // -------------------------------------
      // GET GEMINI CLIENT
      // -------------------------------------

      const ai =
        await getAIClient();


      let response = null;


      // =====================================
      // GEMINI REQUEST
      // =====================================

      for (
        let attempt = 1;
        attempt <= 2;
        attempt++
      ) {

        try {

          console.log(
            `Gemini attempt ${attempt}/2`
          );


          response =
            await ai.models.generateContent({

              model:
                "gemini-3.8-flash",

              contents:
                prompt,

            });


          console.log(
            "Gemini response received successfully."
          );


          break;

        } catch (error) {

          console.log(
            `Gemini attempt ${attempt} failed:`,
            error.message
          );


          // =================================
          // QUOTA EXCEEDED
          // =================================

          if (
            error.status === 429
          ) {

            console.log(
              "Gemini quota exceeded."
            );

            console.log(
              "Using PocketSmart fallback recommendation."
            );


            const fallback =
              generateFallbackRecommendation({

                income:
                  monthlyIncome,

                food:
                  foodExpense,

                transport:
                  transportExpense,

                shopping:
                  shoppingExpense,

                other:
                  otherExpense,

                savings:
                  savingsTarget,

              });


            return res.json({

              success: true,

              recommendation:
                fallback,

              source:
                "PocketSmart Smart Recommendation",

              budget: {

                income:
                  monthlyIncome,

                totalExpense:
                  totalExpense,

                remainingBalance:
                  remainingBalance,

                savingsTarget:
                  savingsTarget,

              },

            });

          }


          // =================================
          // GEMINI TEMPORARILY BUSY
          // =================================

          if (
            error.status === 503 &&
            attempt < 2
          ) {

            console.log(
              "Gemini is temporarily busy."
            );

            console.log(
              "Waiting 10 seconds before retry..."
            );


            await wait(
              10000
            );


            continue;

          }


          // =================================
          // OTHER ERRORS
          // =================================

          throw error;

        }

      }


      // =====================================
      // IF GEMINI DID NOT RESPOND
      // =====================================

      if (!response) {

        console.log(
          "Gemini did not return a response."
        );


        const fallback =
          generateFallbackRecommendation({

            income:
              monthlyIncome,

            food:
              foodExpense,

            transport:
              transportExpense,

            shopping:
              shoppingExpense,

            other:
              otherExpense,

            savings:
              savingsTarget,

          });


        return res.json({

          success: true,

          recommendation:
            fallback,

          source:
            "PocketSmart Smart Recommendation",

          budget: {

            income:
              monthlyIncome,

            totalExpense:
              totalExpense,

            remainingBalance:
              remainingBalance,

            savingsTarget:
              savingsTarget,

          },

        });

      }


      // =====================================
      // GEMINI SUCCESS
      // =====================================

      return res.json({

        success: true,

        recommendation:
          response.text,

        source:
          "Gemini AI",

        budget: {

          income:
            monthlyIncome,

          totalExpense:
            totalExpense,

          remainingBalance:
            remainingBalance,

          savingsTarget:
            savingsTarget,

        },

      });


    } catch (error) {


      // =====================================
      // MAIN ERROR HANDLER
      // =====================================

      console.log(
        "===================================="
      );

      console.log(
        "          GEMINI ERROR"
      );

      console.log(
        "===================================="
      );

      console.log(
        "Message:",
        error.message
      );

      console.log(
        "Status:",
        error.status
      );

      console.log(
        "===================================="
      );


      // =====================================
      // FALLBACK FOR 429 / 503
      // =====================================

      if (
        error.status === 429 ||
        error.status === 503
      ) {

        console.log(
          "Gemini unavailable."
        );

        console.log(
          "Using PocketSmart fallback recommendation."
        );


        const {
          income,
          food,
          transport,
          shopping,
          other,
          savings,
        } = req.body;


        const fallback =
          generateFallbackRecommendation({

            income:
              Number(income || 0),

            food:
              Number(food || 0),

            transport:
              Number(transport || 0),

            shopping:
              Number(shopping || 0),

            other:
              Number(other || 0),

            savings:
              Number(savings || 0),

          });


        return res.json({

          success: true,

          recommendation:
            fallback,

          source:
            "PocketSmart Smart Recommendation",

        });

      }


      // =====================================
      // OTHER ERROR MESSAGES
      // =====================================

      let message =
        "Unable to generate AI recommendation.";


      if (
        error.status === 400
      ) {

        message =
          "❌ Gemini API request is invalid. Please check the API configuration.";

      }


      if (
        error.status === 404
      ) {

        message =
          "❌ The selected Gemini model is currently unavailable.";

      }


      if (
        error.status === 401 ||
        error.status === 403
      ) {

        message =
          "❌ Gemini API key is invalid or does not have permission.";

      }


      return res.status(
        error.status || 500
      ).json({

        success: false,

        message:
          message,

        error:
          error.message,

      });

    }

  }
);


// =========================================
// EXPORT ROUTER
// =========================================

module.exports = router;