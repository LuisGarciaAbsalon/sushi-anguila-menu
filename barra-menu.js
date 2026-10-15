
document.addEventListener("DOMContentLoaded", () => {

    const bloqueInicio = document.querySelector(
        "main .categorias"
    );

    const barra = bloqueInicio?.querySelector(
        ".lista-categorias"
    );

    const secciones = [
        ...document.querySelectorAll(
            "main section.menu[id]"
        )
    ];

    if (!bloqueInicio || !barra || !secciones.length) {
        return;
    }

    // NOMBRES DE LAS CATEGORÍAS

    const nombres = {
        entradas: "Entradas",
        sopas: "Sopas",
        ensaladas: "Ensaladas",
        arroces: "Arroces",
        cocina: "Cocina",
        infantil: "Menú Infantil",
        sushi: "Sushi",
        rollos: "Rollos",
        postres: "Postres",
        "orden-extra": "Extras"
    };

    // RECUPERAR LOS ENLACES EXISTENTES

    const enlacesExistentes = new Map(
        [...barra.querySelectorAll('a[href^="#"]')]
            .map(enlace => [
                enlace.getAttribute("href"),
                enlace
            ])
    );

    // CREAR CONTENEDOR HORIZONTAL

    const enlaces = document.createElement("div");
    enlaces.className = "barra-menu-enlaces";

    secciones.forEach(seccion => {

        const ancla = `#${seccion.id}`;

        const enlace =
            enlacesExistentes.get(ancla) ||
            document.createElement("a");

        enlace.href = ancla;

        enlace.classList.add("categoria-btn");

        enlace.textContent =
            nombres[seccion.id] ||
            seccion.querySelector(
                ".titulo-seccion h2"
            )?.textContent.trim() ||
            seccion.id;

        enlaces.appendChild(enlace);

    });

    // =====================================
    // LUPA DEL BUSCADOR GENERAL
    // =====================================

    const lupa = document.createElement("button");

    lupa.type = "button";

    lupa.className = "barra-menu-lupa";

    lupa.setAttribute(
        "aria-label",
        "Buscar platillos"
    );

    lupa.innerHTML =
        '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>';

    lupa.addEventListener("click", () => {

        const buscador =
            document.querySelector(
                ".boton-buscar-inicio"
            ) ||
            document.querySelector(
                ".boton-buscar-platillo"
            );

        buscador?.click();

    });

    // =====================================
    // ACTIVAR LA BARRA FIJA
    // =====================================

    barra.classList.add("barra-menu-fija");

    barra.setAttribute(
        "aria-label",
        "Categorías del menú"
    );

    barra.replaceChildren(lupa, enlaces);

    bloqueInicio.insertAdjacentElement(
        "afterend",
        barra
    );

    const links = [
        ...enlaces.querySelectorAll('a[href^="#"]')
    ];

    let categoriaActual = "";

    // =====================================
    // MARCAR CATEGORÍA ACTIVA
    // =====================================

    function marcarCategoria(id) {

        if (id === categoriaActual) {
            return;
        }

        categoriaActual = id;

        links.forEach(link => {

            const activa =
                link.getAttribute("href") ===
                `#${id}`;

            link.classList.toggle(
                "active",
                activa
            );

            if (activa) {

                link.setAttribute(
                    "aria-current",
                    "location"
                );

                // CENTRAR LA PESTAÑA ACTIVA

                const destino =
                    enlaces.scrollLeft +
                    link.getBoundingClientRect().left -
                    enlaces.getBoundingClientRect().left -
                    (
                        enlaces.clientWidth -
                        link.offsetWidth
                    ) / 2;

                enlaces.scrollTo({
                    left: Math.max(0, destino),
                    behavior: "smooth"
                });

            } else {

                link.removeAttribute(
                    "aria-current"
                );

            }

        });

    }

    // =====================================
    // DETECTAR SECCIÓN AL DESPLAZARSE
    // =====================================

    let pendiente = false;

    function actualizar() {

        pendiente = false;

        const limite =
            barra.getBoundingClientRect().bottom + 24;

        let seccionActual = secciones[0];

        for (const seccion of secciones) {

            if (
                seccion.getBoundingClientRect().top <=
                limite
            ) {

                seccionActual = seccion;

            } else {

                break;

            }

        }

        marcarCategoria(seccionActual.id);

    }

    // =====================================
    // ACTUALIZAR DURANTE EL SCROLL
    // =====================================

    function programarActualizacion() {

        if (!pendiente) {

            pendiente = true;

            requestAnimationFrame(actualizar);

        }

    }

    window.addEventListener(
        "scroll",
        programarActualizacion,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        programarActualizacion
    );

    window.addEventListener(
        "hashchange",
        programarActualizacion
    );

    // ACTIVACIÓN INICIAL

    actualizar();

});
