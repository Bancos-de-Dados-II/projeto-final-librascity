const form = document.getElementById("loginForm") as HTMLFormElement;

form.addEventListener("submit", async (event)=>{
    event.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {

        const response = await fetch("http://localhost:3000/login", {

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

        alert("Login realizado!");

        window.location.href = "home.html";

    } catch (error) {

        console.error(error);

    }
} )