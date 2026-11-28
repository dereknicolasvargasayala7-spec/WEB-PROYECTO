const formulario = document.getElementById("formulario-contacto");
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const mensaje = document.getElementById("mensaje");
const estadoFormulario = document.getElementById("estado-formulario");
const claveMensaje = "refugio-mensaje-prueba";
formulario.noValidate = true;
document.getElementById("guardar-mensaje").hidden = false;
document.getElementById("borrar-mensaje").hidden = false;

function indicarError(campo, texto) {
    document.getElementById("error-" + campo.id).textContent = texto;
    campo.setAttribute("aria-invalid", String(texto !== ""));
}

try {
    const guardado = JSON.parse(localStorage.getItem(claveMensaje) || "null");
    if (guardado && typeof guardado.nombre === "string" && typeof guardado.correo === "string" && typeof guardado.mensaje === "string") {
        nombre.value = guardado.nombre.slice(0, 80);
        correo.value = guardado.correo.slice(0, 120);
        mensaje.value = guardado.mensaje.slice(0, 1000);
        estadoFormulario.textContent = "Recuperamos tu mensaje de prueba guardado en este navegador.";
    }
} catch (error) {
    estadoFormulario.textContent = "No se pudo recuperar un mensaje guardado. Puedes completar uno nuevo.";
}

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    nombre.value = nombre.value.trim();
    correo.value = correo.value.trim();
    mensaje.value = mensaje.value.trim();
    const nombreValido = nombre.value.length >= 2 && nombre.value.length <= 80;
    const correoValido = correo.value !== "" && correo.validity.valid;
    const mensajeValido = mensaje.value.length >= 10 && mensaje.value.length <= 1000;
    indicarError(nombre, nombreValido ? "" : "Escribe un nombre de entre 2 y 80 caracteres.");
    indicarError(correo, correoValido ? "" : "Escribe un correo válido, por ejemplo nombre@correo.com.");
    indicarError(mensaje, mensajeValido ? "" : "Escribe un mensaje de entre 10 y 1000 caracteres.");
    if (!nombreValido || !correoValido || !mensajeValido) {
        formulario.querySelector('[aria-invalid="true"]').focus();
        estadoFormulario.textContent = "Revisa los campos marcados antes de guardar.";
        return;
    }
    const datos = { nombre: nombre.value, correo: correo.value, mensaje: mensaje.value };
    try {
        localStorage.setItem(claveMensaje, JSON.stringify(datos));
        estadoFormulario.textContent = "Mensaje de prueba guardado en este navegador. No se ha enviado por correo.";
    } catch (error) {
        estadoFormulario.textContent = "No se pudo guardar. El navegador bloqueó el almacenamiento; tu texto permanece en el formulario.";
    }
});

document.getElementById("borrar-mensaje").addEventListener("click", function () {
    try {
        localStorage.removeItem(claveMensaje);
        formulario.reset();
        [nombre, correo, mensaje].forEach(function (campo) {
            indicarError(campo, "");
        });
        estadoFormulario.textContent = "Datos de prueba borrados de este navegador.";
        nombre.focus();
    } catch (error) {
        estadoFormulario.textContent = "El navegador no permitió borrar los datos guardados.";
    }
});
