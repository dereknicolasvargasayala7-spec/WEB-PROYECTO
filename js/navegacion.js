const controlMenu = document.querySelector(".header__control");
const navegacion = document.getElementById("navegacion");
const pantallaPequena = window.matchMedia("(max-width: 1050px)");

function cerrarMenu() {
    controlMenu.setAttribute("aria-expanded", "false");
    navegacion.hidden = pantallaPequena.matches;
}

function ajustarMenu() {
    controlMenu.hidden = !pantallaPequena.matches;
    cerrarMenu();
}

controlMenu.addEventListener("click", function () {
    const abierto = controlMenu.getAttribute("aria-expanded") === "true";
    controlMenu.setAttribute("aria-expanded", String(!abierto));
    navegacion.hidden = abierto;
});

document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && pantallaPequena.matches && !navegacion.hidden) {
        cerrarMenu();
        controlMenu.focus();
    }
});

pantallaPequena.addEventListener("change", ajustarMenu);
ajustarMenu();
