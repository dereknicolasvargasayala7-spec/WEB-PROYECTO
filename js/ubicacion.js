function mostrarEnlace(id, destino, texto) {
    const enlace = document.getElementById(id);
    if (enlace) {
        enlace.href = destino;
        enlace.textContent = texto;
        enlace.hidden = false;
    }
}

const telefonoPendiente = document.getElementById("telefono-pendiente");
if (telefonoPendiente && /^\d{8,15}$/.test(configuracion.telefono)) {
    mostrarEnlace("enlace-whatsapp", "https://wa.me/" + configuracion.telefono, "+" + configuracion.telefono);
    telefonoPendiente.hidden = true;
}

const correoPendiente = document.getElementById("correo-pendiente");
if (correoPendiente && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuracion.correo)) {
    mostrarEnlace("enlace-correo", "mailto:" + configuracion.correo, configuracion.correo);
    correoPendiente.hidden = true;
}

["instagram", "facebook"].forEach(function (red) {
    if (configuracion[red].startsWith("https://")) {
        const nombreRed = red === "instagram" ? "Instagram" : "Facebook";
        mostrarEnlace("enlace-" + red, configuracion[red], nombreRed);
        const aviso = document.getElementById("redes-pendientes");
        if (aviso) {
            aviso.hidden = true;
        }
    }
});

const direccion = document.getElementById("direccion");
if (direccion && configuracion.direccion.trim() !== "") {
    direccion.textContent = configuracion.direccion;
    document.getElementById("titulo-mapa").textContent = "Encuentra nuestro refugio";
    document.getElementById("texto-mapa").textContent = configuracion.direccion;
    const destino = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(configuracion.direccion);
    mostrarEnlace("enlace-mapa", destino, "Abrir en Google Maps");
    document.getElementById("mapa-pendiente").hidden = true;
}
