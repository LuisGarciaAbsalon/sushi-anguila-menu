
// ==============================================
// ANGUILA SUSHI - BUSCADOR GENERAL
// ==============================================

document.addEventListener("DOMContentLoaded", function () {

    const fondo = document.getElementById(
        "buscador-menu-fondo"
    );

    const entrada = document.getElementById(
        "entrada-buscador-menu"
    );

    const resultados = document.getElementById(
        "resultados-buscador-menu"
    );

    const cerrarBoton = document.getElementById(
        "cerrar-buscador-menu"
    );

    const botonesLupa = document.querySelectorAll(
        ".boton-buscar-platillo"
    );

    if (!fondo || !entrada || !resultados || !cerrarBoton) {
        return;
    }

    let botonAnterior = null;

    // Normalizar acentos y mayúsculas

    function normalizar(texto) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    // Buscar tarjetas existentes en el menú

    function obtenerPlatillos() {

        const tarjetas = document.querySelectorAll(
            "section.menu article.producto"
        );

        return Array.from(tarjetas).map(function (tarjeta) {

            const titulo = tarjeta.querySelector(
                ".producto-info h3"
            );

            const descripcion = tarjeta.querySelector(
                ".producto-info p"
            );

            const precio = tarjeta.querySelector(
                ".precio-producto"
            );

            const grupo = tarjeta.closest(
                ".menu-subgrupo, .grupo-rollos"
            );

            const seccion = tarjeta.closest(
                "section.menu"
            );

            const nombreGrupo = grupo?.querySelector(
                ".encabezado-grupo-rollos h3"
            );

            const nombreSeccion = seccion?.querySelector(
                ".titulo-seccion h2"
            );

            return {
                tarjeta: tarjeta,
                nombre: titulo?.textContent.trim() || "",
                descripcion: descripcion?.textContent.trim() || "",
                precio: precio?.textContent.trim() || "",
                categoria:
                    nombreGrupo?.textContent.trim() ||
                    nombreSeccion?.textContent.trim() ||
                    "Menú"
            };

        }).filter(function (producto) {
            return producto.nombre !== "";
        });
    }

    function cerrarBuscador() {

        fondo.hidden = true;

        document.body.classList.remove(
            "buscador-menu-abierto"
        );

        botonAnterior?.focus();
    }

    function abrirBuscador(boton) {

        botonAnterior = boton;

        fondo.hidden = false;
        entrada.value = "";

        document.body.classList.add(
            "buscador-menu-abierto"
        );

        mostrarResultados("");

        entrada.focus();
    }

    // Pintar coincidencias

    function mostrarResultados(texto) {

        resultados.replaceChildren();

        const consulta = normalizar(texto);

        if (!consulta) {

            const mensaje = document.createElement("p");
            mensaje.className = "mensaje-buscador-menu";
            mensaje.textContent =
                "Escribe el nombre de un platillo para buscarlo.";

            resultados.appendChild(mensaje);
            return;
        }

        const coincidencias = obtenerPlatillos()
            .filter(function (producto) {

                const contenido = normalizar(
                    producto.nombre + " " +
                    producto.descripcion
                );

                return contenido.includes(consulta);
            })
            .slice(0, 40);

        if (coincidencias.length === 0) {

            const mensaje = document.createElement("p");
            mensaje.className = "mensaje-buscador-menu";
            mensaje.textContent =
                "No encontramos platillos con ese nombre.";

            resultados.appendChild(mensaje);
            return;
        }

        coincidencias.forEach(function (producto) {

            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "resultado-platillo";

            const info = document.createElement("span");
            info.className = "resultado-platillo-info";

            const nombre = document.createElement("strong");
            nombre.textContent = producto.nombre;

            const categoria = document.createElement("small");
            categoria.textContent = producto.categoria;

            info.append(nombre, categoria);

            const precio = document.createElement("span");
            precio.className = "resultado-platillo-precio";
            precio.textContent = producto.precio;

            boton.append(info, precio);

            boton.addEventListener("click", function () {

                cerrarBuscador();

                producto.tarjeta.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                producto.tarjeta.classList.add(
                    "producto-encontrado"
                );

                setTimeout(function () {
                    producto.tarjeta.classList.remove(
                        "producto-encontrado"
                    );
                }, 2500);

            });

            resultados.appendChild(boton);
        });
    }

    // Las dos lupas abren el mismo buscador

    botonesLupa.forEach(function (boton) {

        boton.addEventListener("click", function () {
            abrirBuscador(boton);
        });

    });

    entrada.addEventListener("input", function () {
        mostrarResultados(entrada.value);
    });

    cerrarBoton.addEventListener(
        "click",
        cerrarBuscador
    );

    // Cerrar al tocar fuera de la ventana

    fondo.addEventListener("click", function (evento) {

        if (evento.target === fondo) {
            cerrarBuscador();
        }

    });

    // Cerrar con Escape

    document.addEventListener("keydown", function (evento) {

        if (evento.key === "Escape" && !fondo.hidden) {
            cerrarBuscador();
        }

    });

});
