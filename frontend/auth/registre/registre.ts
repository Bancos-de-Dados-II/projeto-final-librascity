const rform = document.getElementById("registerForm") as HTMLFormElement;

rform.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Erro ao cadastrar usuário.");
            return;
        }

        alert("Usuário cadastrado com sucesso!");
        window.location.href = "login.html";

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de conexão com o servidor. Tente novamente.");
    }
});