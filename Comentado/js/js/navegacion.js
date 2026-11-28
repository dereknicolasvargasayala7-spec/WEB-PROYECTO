// Selecciona el botón que abre el menú en pantallas pequeñas.
const controlMenu = document.querySelector(".header__control");
// Selecciona el contenedor de enlaces de navegación.
const navegacion = document.getElementById("navegacion");
// Detecta cuándo la ventana tiene el tamaño usado por el menú compacto.
const pantallaPequena = window.matchMedia("(max-width: 1050px)");

// Declara la función que cierra el menú compacto.
function cerrarMenu() {
    // Comunica a las tecnologías de asistencia que el menú está cerrado.
    controlMenu.setAttribute("aria-expanded", "false");
    // Oculta los enlaces solamente si la pantalla es pequeña.
    navegacion.hidden = pantallaPequena.matches;
// Termina la función cerrarMenu.
}

// Declara la función que actualiza el encabezado al cambiar el tamaño.
function ajustarMenu() {
    // Muestra el botón solo en pantallas pequeñas.
    controlMenu.hidden = !pantallaPequena.matches;
    // Coloca el menú en su estado inicial para ese tamaño.
    cerrarMenu();
// Termina la función ajustarMenu.
}

// Escucha un clic sobre el botón del menú.
controlMenu.addEventListener("click", function () {
    // Comprueba si el menú estaba abierto antes del clic.
    const abierto = controlMenu.getAttribute("aria-expanded") === "true";
    // Actualiza el estado accesible al valor contrario.
    controlMenu.setAttribute("aria-expanded", String(!abierto));
    // Oculta el menú si estaba abierto, o lo muestra si estaba cerrado.
    navegacion.hidden = abierto;
// Termina el evento de clic.
});

// Escucha las teclas que presiona el usuario.
document.addEventListener("keydown", function (evento) {
    // Comprueba que se presionó Escape mientras el menú compacto está abierto.
    if (evento.key === "Escape" && pantallaPequena.matches && !navegacion.hidden) {
        // Cierra el menú desplegado.
        cerrarMenu();
        // Devuelve el foco del teclado al botón del menú.
        controlMenu.focus();
    // Termina la condición de Escape.
    }
// Termina el evento de teclado.
});

// Actualiza el encabezado cuando se cruza el ancho de 1050 píxeles.
pantallaPequena.addEventListener("change", ajustarMenu);
// Prepara el menú al abrir la página.
ajustarMenu();
