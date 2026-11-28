// Declara una función reutilizable para habilitar enlaces confirmados.
function mostrarEnlace(id, destino, texto) {
    // Busca el enlace por su identificador en la página actual.
    const enlace = document.getElementById(id);
    // Comprueba que ese enlace existe en esta página.
    if (enlace) {
        // Asigna la dirección que abrirá el enlace.
        enlace.href = destino;
        // Escribe el texto visible de forma segura, sin interpretar HTML.
        enlace.textContent = texto;
        // Muestra el enlace después de configurarlo.
        enlace.hidden = false;
    // Termina la comprobación de existencia.
    }
// Termina la función para mostrar enlaces.
}

// Busca el aviso del número pendiente en la página de contacto.
const telefonoPendiente = document.getElementById("telefono-pendiente");
// Comprueba que exista el aviso y que el teléfono tenga entre 8 y 15 dígitos.
if (telefonoPendiente && /^\d{8,15}$/.test(configuracion.telefono)) {
    // Prepara el enlace a WhatsApp con el número confirmado.
    mostrarEnlace("enlace-whatsapp", "https://wa.me/" + configuracion.telefono, "+" + configuracion.telefono);
    // Oculta el aviso de número por confirmar.
    telefonoPendiente.hidden = true;
// Termina la configuración de WhatsApp.
}

// Busca el aviso de correo pendiente.
const correoPendiente = document.getElementById("correo-pendiente");
// Comprueba que el correo configurado tenga una estructura básica válida.
if (correoPendiente && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuracion.correo)) {
    // Prepara un enlace que abre la aplicación de correo del visitante.
    mostrarEnlace("enlace-correo", "mailto:" + configuracion.correo, configuracion.correo);
    // Oculta el aviso de correo por confirmar.
    correoPendiente.hidden = true;
// Termina la configuración del correo.
}

// Recorre las dos redes sociales que admite la configuración.
["instagram", "facebook"].forEach(function (red) {
    // Acepta únicamente direcciones que empiecen por HTTPS.
    if (configuracion[red].startsWith("https://")) {
        // Elige el nombre visible de la red actual.
        const nombreRed = red === "instagram" ? "Instagram" : "Facebook";
        // Configura el enlace usando la dirección confirmada.
        mostrarEnlace("enlace-" + red, configuracion[red], nombreRed);
        // Busca el aviso de redes sociales pendientes.
        const aviso = document.getElementById("redes-pendientes");
        // Comprueba que el aviso exista en esta página.
        if (aviso) {
            // Oculta el aviso cuando ya hay al menos una red disponible.
            aviso.hidden = true;
        // Termina la comprobación del aviso.
        }
    // Termina la comprobación de la dirección HTTPS.
    }
// Termina el recorrido de redes sociales.
});

// Busca el texto de dirección en la página Visítanos.
const direccion = document.getElementById("direccion");
// Comprueba que se haya configurado una dirección real no vacía.
if (direccion && configuracion.direccion.trim() !== "") {
    // Muestra la dirección confirmada sin interpretar código HTML.
    direccion.textContent = configuracion.direccion;
    // Actualiza el título de la zona de ubicación.
    document.getElementById("titulo-mapa").textContent = "Encuentra nuestro refugio";
    // Repite la dirección en el panel de ubicación.
    document.getElementById("texto-mapa").textContent = configuracion.direccion;
    // Construye una búsqueda de Google Maps codificando los caracteres de la dirección.
    const destino = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(configuracion.direccion);
    // Habilita el botón que abre la ubicación en una nueva pestaña.
    mostrarEnlace("enlace-mapa", destino, "Abrir en Google Maps");
    // Oculta el aviso que indicaba que faltaba la dirección.
    document.getElementById("mapa-pendiente").hidden = true;
// Termina la configuración de la ubicación.
}
