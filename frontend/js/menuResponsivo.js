const botao = document.getElementById("menu-mobile");
const menu = document.getElementById("menu");

botao.addEventListener("click", () => {

    menu.classList.toggle("active");

    const icone = botao.querySelector("i");

    if(menu.classList.contains("active")){

        icone.classList.remove("fa-bars");
        icone.classList.add("fa-xmark");

    }else{

        icone.classList.remove("fa-xmark");
        icone.classList.add("fa-bars");

    }

});