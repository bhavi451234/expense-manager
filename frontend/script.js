const token = localStorage.getItem("token");
const BASE_URL = "http://localhost:3000";

if (!token) {
    window.location.href = "login.html";
}

function getHeaders() {

    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

}

let editingId = null;
let sortOrder = "none";
let expenseChart = null;
let lineChart = null;
let deleteId = null;

function showToast(message, color) {

    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
            background: color
        }
    }).showToast();

}


const TOAST = {
    success: "#2ecc71",
    error: "#e74c3c",
    warning: "#f39c12",
    info: "#3498db"
};

async function getExpenses(){

    const loader = document.getElementById("loader");

      loader.style.display = "block";

    let data;

try {

   const response = await fetch(
    `${BASE_URL}/expenses`,
    {
        headers: getHeaders()
    }
);

if (!response.ok) {
    throw new Error("Failed to fetch expenses");
}

data = await response.json();
    

}
catch(err){

    showToast("Failed to load expenses.", TOAST.error);
    return;

}
finally{

    loader.style.display = "none";

}
    

    
    const categoryTotals = {};
    const monthlyTotals = {};

    const search = document
         .getElementById("search")
         .value.toLowerCase();

    const list = document.getElementById("expense-body");

    list.innerHTML = "";
   

    const selectedDate = document.getElementById("date-filter").value;

    const selectedCategory = document.getElementById("filter-category").value;

    const filteredExpenses = data.filter(exp =>{
       
        const matchesSearch = 
         exp.title.toLowerCase().includes(search) ||
         exp.category.toLowerCase().includes(search);

        const matchesCategory = 
          selectedCategory === "All" ||
          exp.category === selectedCategory;

        

          const matchesDate = 
              selectedDate === "" ||
              exp.created_at.startsWith(selectedDate);
    

    return matchesSearch && matchesCategory && 
           matchesDate;
});

filteredExpenses.forEach(exp => {
   

     const month = new Date(exp.created_at).toLocaleString("default", {
            month: "short"
        });

        if (monthlyTotals[month]) {
            monthlyTotals[month] += Number(exp.amount);
        }

        else {
            monthlyTotals[month] = Number(exp.amount);
        }

    if(categoryTotals[exp.category]) {
        categoryTotals[exp.category] += Number(exp.amount);
    }

    else{
        categoryTotals[exp.category] = Number(exp.amount);
    }
});


const total = filteredExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
);

const highest = filteredExpenses.length
    ? Math.max(...filteredExpenses.map(exp => Number(exp.amount)))
    : 0;

const average = filteredExpenses.length
    ? (total / filteredExpenses.length).toFixed(2)
    : 0;

document.getElementById("total-expense").textContent =
    `₹${total}`;

document.getElementById("total-count").textContent =
    filteredExpenses.length;

document.getElementById("highest-expense").textContent =
    `₹${highest}`;

document.getElementById("average-expense").textContent =
    `₹${average}`;




updateChart(categoryTotals);
updateLineChart(monthlyTotals);



if(sortOrder === "high"){
    filteredExpenses.sort((a,b) => b.amount - a.amount);
}

else if(sortOrder === "low"){
    filteredExpenses.sort((a,b) => a.amount - b.amount);
}



if (filteredExpenses.length === 0) {

    list.innerHTML = "<p class='no-expenses'>No expenses found.</p>";

    document.getElementById("total").textContent = "Total: Rs.0.00";

    return;
}

filteredExpenses.forEach(exp => {

    
    const date = new Date(exp.created_at);
    const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
});
    const category = exp.category || "Other";

    let badgeColor = "";

switch(category){

    case "Food":
        badgeColor = "#f59e0b";
        break;

    case "Travel":
        badgeColor = "#3b82f6";
        break;

    case "Shopping":
        badgeColor = "#8b5cf6";
        break;

    case "Bills":
        badgeColor = "#ef4444";
        break;

    case "Entertainment":
        badgeColor = "#06b6d4";
        break;

    default:
        badgeColor = "#10b981";
}

list.innerHTML += `
<tr>

    <td class="expense-title">
        ${exp.title}
    </td>

   <td>

    <span
        class="category-tag"
        style="
            background:${badgeColor};
            color:white;
        ">

        ${category}

    </span>

</td>

    <td class="amount">

        ₹${Number(exp.amount).toLocaleString("en-IN")}

    </td>

    <td>

       ${formattedDate}

    </td>

   <td class="action-buttons">

    <button
        class="icon-btn edit-btn"
        onclick="editExpense(
            ${exp.id},
            '${exp.title}',
            ${exp.amount},
            '${exp.category}'
        )">

        <i class="fa-solid fa-pen"></i>

    </button>

    <button
        class="icon-btn delete-btn"
        onclick="deleteExpense(${exp.id})">

        <i class="fa-solid fa-trash"></i>

    </button>

</td>
</tr>
`;

    

});

const totalElement = document.getElementById("total");

totalElement.textContent =
`₹${total.toLocaleString("en-IN")}`;

}




async function addExpense(){
    const title = document.getElementById("title").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;

    if(!title || !amount || Number(amount) <= 0){
         showToast("Please enter a valid title and amount.", TOAST.warning);
         return;
    }

if (editingId == null) {

    const response = await fetch(`${BASE_URL}/expenses`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ title, amount, category })
    });

    if (!response.ok) {
        showToast("Failed to add expense.", TOAST.error);
        return;
    }

    showToast("Expense added successfully!", TOAST.success);
}

else {

    const response = await fetch(
        `${BASE_URL}/expenses/${editingId}`,
        {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ title, amount, category })
        }
    );

    if (!response.ok) {
        showToast("Failed to update expense.", TOAST.error);
        return;
    }

    editingId = null;
    document.getElementById("add-btn").textContent = "Add Expense";
    showToast("Expense updated successfully!", TOAST.info);
}


document.getElementById("title").value = "";
document.getElementById("amount").value = "";
document.getElementById("category").value = "";

getExpenses();

}

function deleteExpense(id){

    deleteId = id;

    document.getElementById("deleteModal").style.display = "flex";

}



function editExpense(id,title,amount,category) {
    document.getElementById("title").value = title;
    document.getElementById("amount").value = amount;
    document.getElementById("category").value = category;

    editingId = id;

    document.getElementById("add-btn").textContent="Update Expense"
}

getExpenses();

function toggleExpenses(){
    
    const list = document.getElementById("expense-list");
    const button = document.getElementById("toggle-btn");

    if(window.getComputedStyle(list).display === "none"){

        list.style.display = "block";
        button.textContent = "Hide Expenses";
    }

    else{
        
        list.style.display = "none";
        button.textContent = "View Expenses";
    }


}

function sortHighToLow(){
    sortOrder = "high";
    getExpenses();
}

function sortLowToHigh(){
    sortOrder = "low";
    getExpenses();
}

function updateChart(categoryTotals){

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    const ctx = document.getElementById("expenseChart");

    if(expenseChart){
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx,{

        type:"pie",

        data:{

            labels,

            datasets:[{

                data:values,

                radius:"100%",

                backgroundColor:[
                    "#7dc780",
                    "#388ed4",
                    "#ffc107",
                    "#F44336",
                    "#9C27B0",
                    "#ff9800"
                ]

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            layout:{
                padding:15
            },

            plugins:{

    legend:{
        position:"top",
        align:"center",

        labels:{

            font:{
                size:16,
                weight:"600"
            },

            boxWidth:18,
            boxHeight:12,

            padding:20

        }
    }
}

        }

    });

}

function updateLineChart(monthlyTotals) {
     
    const labels = Object.keys(monthlyTotals);

    const values = Object.values(monthlyTotals);

    const ctx = document.getElementById("lineChart");

    if(lineChart) {
        lineChart.destroy();
    }

    lineChart = new Chart(ctx , {

        type: "line",

        data: {

            labels: labels,

            datasets: [ {
                label : "Monthly Expenses",

                data: values,

                borderColor: "#388ed4",

                backgroundColor: "rgba(56,142,212,0.2)",

                fill : true,

                tension : 0.4
            }]
        }
    });
}

function logout() {
     localStorage.removeItem("token");
     window.location.href = "login.html";
}

document
.getElementById("cancelDelete")
.onclick = function(){

    document.getElementById("deleteModal").style.display = "none";

    deleteId = null;

};


document
.getElementById("confirmDelete")
.onclick = async function(){

    const response =await fetch(
        `${BASE_URL}/expenses/${deleteId}`,
        {
            method:"DELETE",
            headers:getHeaders()
        }

    );
    if (!response.ok) {
    showToast("Failed to delete expense.", TOAST.error);
    return;
}
    showToast("Expense deleted successfully!", TOAST.warning);

    document.getElementById("deleteModal").style.display = "none";

    deleteId = null;

    getExpenses();

};

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
    document.body.classList.add("dark");
}

const themeBtn = document.getElementById("theme-btn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme", "dark");
    }

    else{
        localStorage.setItem("theme", "light");
    }

    updateThemeButton();

});

  updateThemeButton();



function updateThemeButton() {

    const icon = document.getElementById("theme-icon");
    const text = document.getElementById("theme-text");

    if(document.body.classList.contains("dark")){

        icon.textContent = "☀️";
        text.textContent = "Light";

    }

    else{

        icon.textContent = "🌙";
        text.textContent = "Dark";

    }

}

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", logout);


