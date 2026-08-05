# 💰 Expense Manager

A modern full-stack Expense Manager built using HTML, CSS, JavaScript, Node.js, Express, MySQL, and JWT Authentication.

## ✨ Features

- 🔐 User Registration & Login
- 🔑 JWT Authentication
- 🔒 Protected Routes
- 💵 Add Expenses
- ✏️ Edit Expenses
- 🗑️ Delete Expenses
- 📊 Expense Analytics (Chart.js)
- 📈 Expense Trends
- 🌙 Dark / Light Mode
- 🔍 Search Expenses
- 🏷️ Category Filter
- 📅 Date Filter
- ↕️ Sort by Amount
- 📱 Responsive UI
- 🔔 Toast Notifications

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Chart.js
- Toastify.js

### Backend

- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcrypt
- dotenv

---

## 📂 Project Structure

```
expense-manager/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── db.js
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── script.js
│   ├── style.css
│
├── database/
│   └── schema.sql
│
├── package.json
└── README.md
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/bhavi451234/expense-manager.git
```

Install dependencies

```bash
npm install
```

Create a `.env` file inside the backend folder.

Example:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=expense_manager
JWT_SECRET=your_secret_key
```

Start the server

```bash
node backend/server.js
```

Open:

```
frontend/login.html
```

using Live Server.

---

## 🔮 Future Improvements

- Monthly Budget Tracking
- Income Management
- Export to PDF/Excel
- Recurring Expenses
- Expense Categories Dashboard
- Cloud Deployment

---
