const listaProductos = document.getElementById("lista-productos");
const tarjetas = Array.from(listaProductos.querySelectorAll(".tarjeta"));
const buscar = document.getElementById("buscar");
const ordenar = document.getElementById("ordenar");
const soloFavoritos = document.getElementById("solo-favoritos");
const estadoCatalogo = document.getElementById("estado-catalogo");
const estadoFavoritos = document.getElementById("estado-favoritos");
const sinResultados = document.getElementById("sin-resultados");
const claveFavoritos = "refugio-favoritos";
let favoritos = [];

try {
    const guardados = JSON.parse(localStorage.getItem(claveFavoritos) || "[]");
    if (Array.isArray(guardados)) {
        favoritos = guardados.filter(function (id) {
            return typeof id === "string";
        });
    }
} catch (error) {
    favoritos = [];
}

function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function actualizarCatalogo() {
    const foco = document.activeElement;
    const consulta = normalizar(buscar.value);
    const ordenadas = tarjetas.slice();
    ordenadas.sort(function (a, b) {
        if (ordenar.value === "menor") {
            return Number(a.dataset.precio) - Number(b.dataset.precio);
        }
        if (ordenar.value === "mayor") {
            return Number(b.dataset.precio) - Number(a.dataset.precio);
        }
        if (ordenar.value === "nombre") {
            return a.dataset.nombre.localeCompare(b.dataset.nombre, "es");
        }
        return tarjetas.indexOf(a) - tarjetas.indexOf(b);
    });
    let cantidad = 0;
    ordenadas.forEach(function (tarjeta) {
        const coincide = normalizar(tarjeta.dataset.nombre).includes(consulta);
        const esFavorito = favoritos.includes(tarjeta.dataset.producto);
        const mostrar = coincide && (!soloFavoritos.checked || esFavorito);
        tarjeta.hidden = !mostrar;
        if (mostrar) {
            cantidad++;
        }
        listaProductos.appendChild(tarjeta);
    });
    estadoCatalogo.textContent = cantidad + (cantidad === 1 ? " producto disponible" : " productos disponibles");
    sinResultados.hidden = cantidad !== 0;
    if (foco && listaProductos.contains(foco)) {
        if (foco.closest(".tarjeta").hidden) {
            soloFavoritos.focus();
        } else {
            foco.focus();
        }
    }
}

function actualizarBoton(tarjeta) {
    const boton = tarjeta.querySelector(".tarjeta__favorito");
    const guardado = favoritos.includes(tarjeta.dataset.producto);
    boton.hidden = false;
    boton.classList.toggle("tarjeta__favorito--activo", guardado);
    boton.setAttribute("aria-pressed", String(guardado));
    boton.setAttribute("aria-label", (guardado ? "Quitar " : "Guardar ") + tarjeta.dataset.nombre + " en favoritos");
    boton.textContent = guardado ? "♥ Guardado" : "♡ Guardar favorito";
}

tarjetas.forEach(function (tarjeta) {
    actualizarBoton(tarjeta);
    tarjeta.querySelector(".tarjeta__favorito").addEventListener("click", function () {
        const id = tarjeta.dataset.producto;
        if (favoritos.includes(id)) {
            favoritos = favoritos.filter(function (favorito) {
                return favorito !== id;
            });
        } else {
            favoritos.push(id);
        }
        try {
            localStorage.setItem(claveFavoritos, JSON.stringify(favoritos));
            estadoFavoritos.textContent = "Favoritos actualizados en este navegador.";
        } catch (error) {
            estadoFavoritos.textContent = "Favoritos disponibles solo hasta cerrar esta página; el navegador bloqueó el guardado.";
        }
        actualizarBoton(tarjeta);
        actualizarCatalogo();
    });
});

buscar.addEventListener("input", actualizarCatalogo);
ordenar.addEventListener("change", actualizarCatalogo);
soloFavoritos.addEventListener("change", actualizarCatalogo);
document.querySelector(".catalogo__herramientas").hidden = false;
actualizarCatalogo();
