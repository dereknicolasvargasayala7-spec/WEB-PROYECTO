// Obtiene el contenedor de las tarjetas de productos.
const listaProductos = document.getElementById("lista-productos");
// Convierte las tarjetas en un arreglo que se puede filtrar y ordenar.
const tarjetas = Array.from(listaProductos.querySelectorAll(".tarjeta"));
// Obtiene el campo donde el usuario escribe la búsqueda.
const buscar = document.getElementById("buscar");
// Obtiene el selector del orden de los productos.
const ordenar = document.getElementById("ordenar");
// Obtiene la casilla para ver únicamente los favoritos.
const soloFavoritos = document.getElementById("solo-favoritos");
// Obtiene el texto que anuncia cuántos productos se muestran.
const estadoCatalogo = document.getElementById("estado-catalogo");
// Obtiene el texto que informa si se guardó un favorito.
const estadoFavoritos = document.getElementById("estado-favoritos");
// Obtiene el mensaje que aparece cuando no hay coincidencias.
const sinResultados = document.getElementById("sin-resultados");
// Define el nombre usado para guardar los favoritos en este navegador.
const claveFavoritos = "refugio-favoritos";
// Crea un arreglo vacío para los identificadores de productos favoritos.
let favoritos = [];

// Intenta leer los favoritos sin detener la página si el almacenamiento falla.
try {
    // Lee el texto guardado y lo transforma en un arreglo; usa uno vacío si no existe.
    const guardados = JSON.parse(localStorage.getItem(claveFavoritos) || "[]");
    // Verifica que el contenido recuperado sea un arreglo.
    if (Array.isArray(guardados)) {
        // Conserva únicamente identificadores válidos del arreglo recuperado.
        favoritos = guardados.filter(function (id) {
            // Acepta solo los elementos que son texto.
            return typeof id === "string";
        // Termina el filtrado de los datos recuperados.
        });
    // Termina la comprobación del arreglo.
    }
// Maneja datos dañados o almacenamiento bloqueado por el navegador.
} catch (error) {
    // Permite continuar usando el catálogo con una lista vacía.
    favoritos = [];
// Termina la lectura protegida de los favoritos.
}

// Declara una función que prepara texto para comparar búsquedas.
function normalizar(texto) {
    // Quita mayúsculas, tildes y espacios de los extremos para facilitar coincidencias.
    return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
// Termina la función de normalización.
}

// Declara la función que filtra, ordena y actualiza el catálogo.
function actualizarCatalogo() {
    // Recuerda el elemento enfocado antes de mover las tarjetas en el documento.
    const foco = document.activeElement;
    // Normaliza lo que escribió el usuario en el buscador.
    const consulta = normalizar(buscar.value);
    // Copia el arreglo para mantener disponible el orden original.
    const ordenadas = tarjetas.slice();
    // Ordena las tarjetas según la opción elegida.
    ordenadas.sort(function (a, b) {
        // Comprueba si se pidió ordenar del precio más bajo al más alto.
        if (ordenar.value === "menor") {
            // Compara los precios convertidos a números de menor a mayor.
            return Number(a.dataset.precio) - Number(b.dataset.precio);
        // Termina la condición del precio ascendente.
        }
        // Comprueba si se pidió ordenar del precio más alto al más bajo.
        if (ordenar.value === "mayor") {
            // Compara los precios de mayor a menor.
            return Number(b.dataset.precio) - Number(a.dataset.precio);
        // Termina la condición del precio descendente.
        }
        // Comprueba si se pidió ordenar alfabéticamente.
        if (ordenar.value === "nombre") {
            // Compara los nombres usando las reglas del idioma español.
            return a.dataset.nombre.localeCompare(b.dataset.nombre, "es");
        // Termina la condición del orden alfabético.
        }
        // Conserva las posiciones originales para la opción Orden del menú.
        return tarjetas.indexOf(a) - tarjetas.indexOf(b);
    // Termina la ordenación de las tarjetas.
    });
    // Inicia el contador de productos visibles.
    let cantidad = 0;
    // Recorre cada tarjeta en el orden que se acaba de calcular.
    ordenadas.forEach(function (tarjeta) {
        // Comprueba si el nombre contiene el texto de búsqueda.
        const coincide = normalizar(tarjeta.dataset.nombre).includes(consulta);
        // Comprueba si el identificador está en la lista de favoritos.
        const esFavorito = favoritos.includes(tarjeta.dataset.producto);
        // Combina la búsqueda con la casilla de favoritos.
        const mostrar = coincide && (!soloFavoritos.checked || esFavorito);
        // Oculta la tarjeta si no cumple los filtros.
        tarjeta.hidden = !mostrar;
        // Comprueba si este producto permanece visible.
        if (mostrar) {
            // Suma un producto al contador de resultados.
            cantidad++;
        // Termina la condición del contador.
        }
        // Coloca la tarjeta al final del contenedor para aplicar el orden calculado.
        listaProductos.appendChild(tarjeta);
    // Termina el recorrido de las tarjetas.
    });
    // Actualiza el número de resultados con singular o plural.
    estadoCatalogo.textContent = cantidad + (cantidad === 1 ? " producto disponible" : " productos disponibles");
    // Muestra el mensaje de búsqueda vacía solo si no hay resultados.
    sinResultados.hidden = cantidad !== 0;
    // Comprueba si el foco estaba en un control dentro de las tarjetas.
    if (foco && listaProductos.contains(foco)) {
        // Comprueba si el producto enfocado desapareció al aplicar los filtros.
        if (foco.closest(".tarjeta").hidden) {
            // Lleva el foco al filtro de favoritos si la tarjeta dejó de estar visible.
            soloFavoritos.focus();
        // Mantiene el foco en su posición anterior cuando el producto sigue visible.
        } else {
            // Devuelve el foco al control que estaba usando el visitante.
            foco.focus();
        // Termina la elección del destino del foco.
        }
    // Termina la restauración del foco después de ordenar.
    }
// Termina la función que actualiza el catálogo.
}

// Declara la función que refleja el estado favorito de una tarjeta.
function actualizarBoton(tarjeta) {
    // Selecciona el botón de favoritos de esta tarjeta.
    const boton = tarjeta.querySelector(".tarjeta__favorito");
    // Comprueba si el producto ya está guardado.
    const guardado = favoritos.includes(tarjeta.dataset.producto);
    // Habilita el botón después de que JavaScript esté preparado.
    boton.hidden = false;
    // Aplica el modificador BEM que pinta el favorito seleccionado.
    boton.classList.toggle("tarjeta__favorito--activo", guardado);
    // Informa el estado del botón a los lectores de pantalla.
    boton.setAttribute("aria-pressed", String(guardado));
    // Da al botón un nombre accesible que incluye el producto.
    boton.setAttribute("aria-label", (guardado ? "Quitar " : "Guardar ") + tarjeta.dataset.nombre + " en favoritos");
    // Cambia el texto del botón según su estado.
    boton.textContent = guardado ? "♥ Guardado" : "♡ Guardar favorito";
// Termina la función que actualiza un botón.
}

// Recorre todas las tarjetas para preparar sus botones.
tarjetas.forEach(function (tarjeta) {
    // Refleja los favoritos recuperados al iniciar la página.
    actualizarBoton(tarjeta);
    // Escucha el clic en el botón de esta tarjeta.
    tarjeta.querySelector(".tarjeta__favorito").addEventListener("click", function () {
        // Obtiene el identificador único del producto.
        const id = tarjeta.dataset.producto;
        // Comprueba si el producto ya estaba guardado.
        if (favoritos.includes(id)) {
            // Crea una lista que excluye el producto seleccionado.
            favoritos = favoritos.filter(function (favorito) {
                // Conserva todos los identificadores diferentes del que se quiere quitar.
                return favorito !== id;
            // Termina la eliminación del favorito.
            });
        // Ejecuta esta alternativa cuando el producto todavía no estaba guardado.
        } else {
            // Agrega el identificador a la lista de favoritos.
            favoritos.push(id);
        // Termina la elección entre agregar y quitar.
        }
        // Intenta guardar los cambios de forma persistente en el navegador.
        try {
            // Convierte la lista en texto y la guarda con su clave.
            localStorage.setItem(claveFavoritos, JSON.stringify(favoritos));
            // Confirma que se guardó la lista localmente.
            estadoFavoritos.textContent = "Favoritos actualizados en este navegador.";
        // Maneja el caso en que el navegador no permite guardar datos.
        } catch (error) {
            // Explica que el cambio existe en memoria pero no persistirá.
            estadoFavoritos.textContent = "Favoritos disponibles solo hasta cerrar esta página; el navegador bloqueó el guardado.";
        // Termina el intento de guardado.
        }
        // Actualiza el aspecto y el texto del botón pulsado.
        actualizarBoton(tarjeta);
        // Reaplica los filtros por si está activa la vista de favoritos.
        actualizarCatalogo();
    // Termina el evento del botón de esta tarjeta.
    });
// Termina la preparación de todas las tarjetas.
});

// Actualiza resultados mientras el usuario escribe o borra la búsqueda.
buscar.addEventListener("input", actualizarCatalogo);
// Reordena las tarjetas cuando cambia el selector.
ordenar.addEventListener("change", actualizarCatalogo);
// Aplica o retira el filtro de favoritos.
soloFavoritos.addEventListener("change", actualizarCatalogo);
// Muestra los controles cuando ya tienen sus eventos preparados.
document.querySelector(".catalogo__herramientas").hidden = false;
// Calcula los resultados iniciales al cargar la página.
actualizarCatalogo();
