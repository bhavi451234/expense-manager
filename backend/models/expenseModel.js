const db = require("../db");

// Get all expenses
function getAllExpenses(userId, callback) {
    const query = "SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC";
    db.query(query, [userId], callback);
}

// Add expense
function addExpense(title, amount, category, userId, callback) {
    const query = "INSERT INTO expenses (title, amount, category, user_id) VALUES (?, ?, ?, ?)";

    db.query(query, [title, amount, category, userId],callback);
}

// Update expense
function updateExpense(id, title, amount, category,userId, callback) {
    const query = "UPDATE expenses SET title = ?, amount = ?, category = ? WHERE id = ? AND user_id = ?";

    db.query(query, [title, amount, category, id, userId], callback);
}

// Delete expense
function deleteExpense(id, userId, callback) {
    const query = "DELETE FROM expenses WHERE id = ? AND user_id = ? ";

    db.query(query, [id, userId], callback);
}

module.exports = {
    getAllExpenses,
    addExpense,
    updateExpense,
    deleteExpense
};