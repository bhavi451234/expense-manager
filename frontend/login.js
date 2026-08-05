async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    const response = await fetch("http://localhost:3000/auth/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    });

    const data = await response.json();

    if (!response.ok) {

        alert(data.message);

        return;

    }

    localStorage.setItem("token", data.token);

    

    window.location.href = "index.html";

}