const expenseModel = require("../models/expenseModel");

// GET all expenses
exports.getExpenses = (req, res) => {
     
    const userId = req.user.id;
    expenseModel.getAllExpenses(userId, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Internal server error"
        });
        }

        return res.json(results);
        });
}



// POST new expense
exports.addExpense = (req, res) => {

    const { title, amount, category } = req.body;
    const userId = req.user.id;

    if (!title || !amount || !category) {
    return res.status(400).json({
        message: "All fields are required"
    });
}

    expenseModel.addExpense(title, amount, category, userId, (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Internal server error"
            });
        }

        return res.status(201).json({
    message: "Expense added successfully",
    id: result.insertId
});
    });
};

// PUT update expense
exports.updateExpense = (req, res) => {

    const id = req.params.id;
    const { title, amount, category } = req.body;
    const userId = req.user.id;

    if (!title || !amount || !category) {
    return res.status(400).json({
        message: "All fields are required"
    });
}

    expenseModel.updateExpense(id, title, amount, category, userId, (err) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Internal server error"
            });
        }

        return res.json({
            message: "Expense updated successfully"
        });
    });
};

// DELETE expense
exports.deleteExpense = (req, res) => {

    const id = req.params.id;
    const userId = req.user.id;

    expenseModel.deleteExpense(id, userId, (err) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Internal server error"
            });
        }

        return res.json({
            message: "Deleted successfully"
        });
    });
};