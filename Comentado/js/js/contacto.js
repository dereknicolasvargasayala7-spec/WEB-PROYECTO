// Selecciona el formulario de contacto.
const formulario = document.getElementById("formulario-contacto");
// Selecciona el campo del nombre.
const nombre = document.getElementById("nombre");
// Selecciona el campo del correo electrónico.
const correo = document.getElementById("correo");
// Selecciona el área del mensaje.
const mensaje = document.getElementById("mensaje");
// Selecciona el espacio de confirmaciones y avisos del formulario.
const estadoFormulario = document.getElementById("estado-formulario");
// Define la clave para guardar un único mensaje de demostración local.
const claveMensaje = "refugio-mensaje-prueba";
// Permite mostrar los mensajes de validación propios mediante JavaScript.
formulario.noValidate = true;
// Muestra el botón de guardar cuando el código está listo.
document.getElementById("guardar-mensaje").hidden = false;
// Muestra el botón que elimina los datos locales del formulario.
document.getElementById("borrar-mensaje").hidden = false;

// Declara una función que muestra o limpia el error de un campo.
function indicarError(campo, texto) {
    // Escribe el mensaje en el elemento asociado al campo.
    document.getElementById("error-" + campo.id).textContent = texto;
    // Indica si el campo contiene un valor inválido.
    campo.setAttribute("aria-invalid", String(texto !== ""));
// Termina la función de errores.
}

// Intenta recuperar un mensaje guardado anteriormente.
try {
    // Convierte el texto almacenado en un objeto, o usa null si no existe.
    const guardado = JSON.parse(localStorage.getItem(claveMensaje) || "null");
    // Comprueba que el objeto tenga los tres textos esperados.
    if (guardado && typeof guardado.nombre === "string" && typeof guardado.correo === "string" && typeof guardado.mensaje === "string") {
        // Recupera el nombre respetando su longitud máxima.
        nombre.value = guardado.nombre.slice(0, 80);
        // Recupera el correo respetando su longitud máxima.
        correo.value = guardado.correo.slice(0, 120);
        // Recupera el mensaje respetando su longitud máxima.
        mensaje.value = guardado.mensaje.slice(0, 1000);
        // Informa que los campos proceden del almacenamiento local.
        estadoFormulario.textContent = "Recuperamos tu mensaje de prueba guardado en este navegador.";
    // Termina la comprobación de los datos guardados.
    }
// Maneja datos locales dañados o acceso bloqueado al almacenamiento.
} catch (error) {
    // Permite continuar explicando el problema de recuperación.
    estadoFormulario.textContent = "No se pudo recuperar un mensaje guardado. Puedes completar uno nuevo.";
// Termina el intento de recuperar el mensaje.
}

// Escucha el intento de enviar el formulario.
formulario.addEventListener("submit", function (evento) {
    // Evita recargar la página o enviar datos a un servidor inexistente.
    evento.preventDefault();
    // Elimina los espacios al comienzo y al final del nombre.
    nombre.value = nombre.value.trim();
    // Elimina los espacios sobrantes del correo.
    correo.value = correo.value.trim();
    // Elimina los espacios sobrantes del mensaje.
    mensaje.value = mensaje.value.trim();
    // Comprueba la longitud permitida para el nombre.
    const nombreValido = nombre.value.length >= 2 && nombre.value.length <= 80;
    // Usa la validación del campo email y exige un valor no vacío.
    const correoValido = correo.value !== "" && correo.validity.valid;
    // Comprueba que el mensaje tenga entre 10 y 1000 caracteres.
    const mensajeValido = mensaje.value.length >= 10 && mensaje.value.length <= 1000;
    // Muestra el error del nombre solo cuando corresponde.
    indicarError(nombre, nombreValido ? "" : "Escribe un nombre de entre 2 y 80 caracteres.");
    // Muestra el error del correo solo cuando corresponde.
    indicarError(correo, correoValido ? "" : "Escribe un correo válido, por ejemplo nombre@correo.com.");
    // Muestra el error del mensaje solo cuando corresponde.
    indicarError(mensaje, mensajeValido ? "" : "Escribe un mensaje de entre 10 y 1000 caracteres.");
    // Detecta si al menos uno de los campos es incorrecto.
    if (!nombreValido || !correoValido || !mensajeValido) {
        // Lleva el foco al primer campo que necesita corrección.
        formulario.querySelector('[aria-invalid="true"]').focus();
        // Explica por qué no se realizó el guardado.
        estadoFormulario.textContent = "Revisa los campos marcados antes de guardar.";
        // Detiene el evento para no guardar datos inválidos.
        return;
    // Termina la comprobación de los errores.
    }
    // Crea el objeto que reúne los tres datos válidos.
    const datos = { nombre: nombre.value, correo: correo.value, mensaje: mensaje.value };
    // Intenta guardar el mensaje en el navegador.
    try {
        // Guarda un mensaje local y reemplaza el anterior, si existía.
        localStorage.setItem(claveMensaje, JSON.stringify(datos));
        // Confirma el resultado real sin simular un envío externo.
        estadoFormulario.textContent = "Mensaje de prueba guardado en este navegador. No se ha enviado por correo.";
    // Maneja falta de espacio o bloqueo del almacenamiento.
    } catch (error) {
        // Explica el fallo y conserva lo escrito en pantalla.
        estadoFormulario.textContent = "No se pudo guardar. El navegador bloqueó el almacenamiento; tu texto permanece en el formulario.";
    // Termina el intento de guardado.
    }
// Termina el evento de envío del formulario.
});

// Escucha el botón para borrar únicamente el mensaje de prueba.
document.getElementById("borrar-mensaje").addEventListener("click", function () {
    // Intenta eliminar los datos del almacenamiento local.
    try {
        // Elimina solo esta clave, sin borrar los favoritos ni otros datos.
        localStorage.removeItem(claveMensaje);
        // Restablece los campos a sus valores iniciales vacíos.
        formulario.reset();
        // Recorre los tres campos para limpiar sus errores.
        [nombre, correo, mensaje].forEach(function (campo) {
            // Quita el mensaje de error del campo actual.
            indicarError(campo, "");
        // Termina la limpieza de errores.
        });
        // Confirma que se eliminaron los datos locales.
        estadoFormulario.textContent = "Datos de prueba borrados de este navegador.";
        // Deja el cursor en el nombre para comenzar un mensaje nuevo.
        nombre.focus();
    // Maneja un bloqueo al intentar borrar los datos.
    } catch (error) {
        // Informa el fallo sin afirmar que los datos fueron eliminados.
        estadoFormulario.textContent = "El navegador no permitió borrar los datos guardados.";
    // Termina el intento de eliminación.
    }
// Termina el evento del botón para borrar.
});
