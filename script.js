
// =====================================
// SPENDWISE - WEEK 6
// Interactive Budget Tracker
// =====================================

// 1. Budget categories
const budgets = [
    { name: "Food & Dining", limit: 50000, spent: 0, icon: "🍔" },
    { name: "Transport", limit: 25000, spent: 0, icon: "🚗" },
    { name: "Rent & Housing", limit: 120000, spent: 0, icon: "🏠" },
    { name: "Entertainment", limit: 15000, spent: 0, icon: "🎬" },
    { name: "Savings Goal", limit: 50000, spent: 0, icon: "🐷" },
    { name: "Utilities", limit: 30000, spent: 0, icon: "⚡" }
];

// 2. Array to store multiple expenses
let expenses = [];

// 3. Get HTML elements
const expenseForm = document.getElementById("expense-form");
const expenseName = document.getElementById("expense-name");
const expenseAmount = document.getElementById("expense-amount");
const expenseCategory = document.getElementById("expense-category");

const expenseList = document.getElementById("expense-list");
const feedbackMessage = document.getElementById("feedback-message");

const totalBudgetElement = document.getElementById("total-budget");
const totalExpensesElement = document.getElementById("total-expenses");
const remainingBalanceElement = document.getElementById("remaining-balance");

const dashboardGrid = document.getElementById("dashboard-grid");

// 4. Calculate total budget
function calculateTotalBudget() {
    let total = 0;

    budgets.forEach(function(budget) {
        total += budget.limit;
    });

    return total;
}

// 5. Calculate total expenses using a loop
function calculateTotalExpenses() {
    let total = 0;

    expenses.forEach(function(expense) {
        total += expense.amount;
    });

    return total;
}

// 6. Update dashboard
function updateDashboard() {

    const totalBudget = calculateTotalBudget();
    const totalExpenses = calculateTotalExpenses();
    const remainingBalance = totalBudget - totalExpenses;

    totalBudgetElement.textContent =
        `KSh ${totalBudget.toLocaleString()}`;

    totalExpensesElement.textContent =
        `KSh ${totalExpenses.toLocaleString()}`;

    remainingBalanceElement.textContent =
        `KSh ${remainingBalance.toLocaleString()}`;

    // Budget decision making
    if (remainingBalance < 0) {
        feedbackMessage.textContent =
            "Warning! You have exceeded your total budget.";
    } else if (remainingBalance === 0) {
        feedbackMessage.textContent =
            "Your entire budget has been used.";
    } else {
        feedbackMessage.textContent =
            "Good job! You are still within your budget.";
    }

    displayBudgetCards();
    displayExpenses();
}

// 7. Display budget cards using a loop
function displayBudgetCards() {

    dashboardGrid.innerHTML = "";

    budgets.forEach(function(budget) {

        let status = "On Track";
        let statusClass = "label-success";

        if (budget.spent > budget.limit) {
            status = "Over Budget";
            statusClass = "label-danger";
        } else if (budget.spent === budget.limit) {
            status = "Budget Used";
            statusClass = "label-warning";
        } else if (budget.spent >= budget.limit * 0.8) {
            status = "Almost Full";
            statusClass = "label-warning";
        }

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="card-header">
                <span class="card-icon">${budget.icon}</span>
                <span class="card-tag ${statusClass}">
                    ${status}
                </span>
            </div>

            <div class="card-body">
                <h3 class="card-title">${budget.name}</h3>

                <p class="card-amount">
                    KSh ${budget.spent.toLocaleString()}
                </p>

                <p class="card-limit">
                    of KSh ${budget.limit.toLocaleString()} budget
                </p>
            </div>
        `;

        dashboardGrid.appendChild(card);
    });
}

// 8. Display expense records using a loop
function displayExpenses() {

    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        expenseList.textContent = "No expenses added yet.";
        return;
    }

    expenses.forEach(function(expense, index) {

        const item = document.createElement("div");
        item.className = "transaction-item";

        item.innerHTML = `
            <div class="transaction-info">
                <h3>${expense.name}</h3>
                <p>${expense.category}</p>
            </div>

            <span class="transaction-amount">
                KSh ${expense.amount.toLocaleString()}
            </span>

            <button
                class="delete-btn"
                type="button"
                data-index="${index}">
                Delete
            </button>
        `;

        expenseList.appendChild(item);
    });
}

// 9. Handle form submission
expenseForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const category = expenseCategory.value;

    if (!name || !Number.isFinite(amount) || amount <= 0 || !category) {
        feedbackMessage.textContent =
            "Please enter valid expense details.";
        return;
    }

    // Find selected budget category
    const selectedBudget = budgets.find(function(budget) {
        return budget.name === category;
    });

    if (!selectedBudget) {
        feedbackMessage.textContent = "Invalid budget category.";
        return;
    }

    // Add expense to array
    const newExpense = {
        name: name,
        amount: amount,
        category: category
    };

    expenses.push(newExpense);

    // Update category spending
    selectedBudget.spent += amount;

    // Update dashboard
    updateDashboard();

    // Clear form
    expenseForm.reset();
});

// 10. Handle delete button clicks
expenseList.addEventListener("click", function(event) {

    if (event.target.classList.contains("delete-btn")) {

        const index = Number(event.target.dataset.index);

        const deletedExpense = expenses[index];

        if (deletedExpense) {

            const selectedBudget = budgets.find(function(budget) {
                return budget.name === deletedExpense.category;
            });

            if (selectedBudget) {
                selectedBudget.spent -= deletedExpense.amount;
            }

            expenses.splice(index, 1);

            updateDashboard();
        }
    }
});

// 11. Search transactions
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function() {

    const searchText = searchInput.value.toLowerCase();

    const filteredExpenses = expenses.filter(function(expense) {
        return expense.name.toLowerCase().includes(searchText) ||
               expense.category.toLowerCase().includes(searchText);
    });

    expenseList.innerHTML = "";

    filteredExpenses.forEach(function(expense) {

        const item = document.createElement("div");
        item.className = "transaction-item";

        item.innerHTML = `
            <div class="transaction-info">
                <h3>${expense.name}</h3>
                <p>${expense.category}</p>
            </div>

            <span class="transaction-amount">
                KSh ${expense.amount.toLocaleString()}
            </span>
        `;

        expenseList.appendChild(item);
    });
});

// 12. Initial dashboard display
updateDashboard();
