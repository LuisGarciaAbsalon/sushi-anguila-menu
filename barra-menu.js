
document.addEventListener("DOMContentLoaded", () => {

    const bloqueInicio = document.querySelector(
        "main .categorias"
    );

    const barra = bloqueInicio?.querySelector(
        ".lista-categorias"
    );

    
const secciones = [
    ...document.querySelectorAll(
        "main section.menu[id], " +
        "#sushi > section.menu-subgrupo[id], " +
        "#rollos > section.grupo-rollos[id]"
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
    sashimis: "Sashimis",
    temakis: "Temakis",
    batera: "Batera",
    niguiris: "Niguiris",

    "rollos-tradicionales": "Tradicionales",
    "rollos-clasicos": "Clásicos",
    "especialidades-rollos": "Especialidades",
    "empanizados-rollos": "Empanizados",
"capeados-rollos": "Capeados",
    "sushi-balls-rollos": "Sushi Balls",

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

            // No mostrar el enlace general de Rollos
    if (
    seccion.id === "rollos" ||
    seccion.id === "capeados-rollos"
) {
    return;
}

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
    // ACTIVAR LA BARRA FIJA
    // =====================================

    barra.classList.add("barra-menu-fija");

    barra.setAttribute(
        "aria-label",
        "Categorías del menú"
    );

    barra.replaceChildren(enlaces);

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

    let id = decodeURIComponent(
        window.location.hash.slice(1)
    ) || "entradas";

    if (id === "capeados-rollos") {
    id = "empanizados-rollos";
}

    // Comprobar si la categoría existe en la barra
    const existe = links.some(link =>
        link.getAttribute("href") === `#${id}`
    );

    // Si es una subcategoría, localizar su categoría principal
    if (!existe) {

        const elemento = document.getElementById(id);

        const principal = elemento?.closest(
            "section.menu[id]"
        );

        id = principal?.id || "entradas";
    }

    // Rollos no tiene pestaña general en la barra
    if (id === "rollos") {
        id = "rollos-tradicionales";
    }

    marcarCategoria(id);
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

    
// ACTUALIZAR AL SELECCIONAR OTRA CATEGORÍA

enlaces.addEventListener("click", () => {

    requestAnimationFrame(actualizar);

});


    // ACTIVACIÓN INICIAL

    actualizar();

});
