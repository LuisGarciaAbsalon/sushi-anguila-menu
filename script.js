// ======================================================
// ANGUILA SUSHI - SCRIPT PRINCIPAL
// ======================================================


// ======================================================
// VARIABLES GENERALES
// ======================================================

let cantidadCarrito = 0;
let totalCarrito = 0;
const pedido = {};

let servicioSeleccionado = "";

let latitudCliente = null;
let longitudCliente = null;
let usoUbicacionActual = false;
let direccionValidaCoacalco = false;

let direccionUbicacionActual = "";


// ======================================================
// ELEMENTOS DEL CARRITO
// ======================================================

const botonesAgregar =
    document.querySelectorAll(".agregar");

const contador =
    document.getElementById("cantidad-carrito");

const total =
    document.getElementById("total-carrito");

const detallePedido =
    document.getElementById("detalle-pedido");

const totalModal =
    document.getElementById("total-modal");

const botonVerPedido =
    document.querySelector(".ver-pedido");

const modalPedido =
    document.getElementById("modal-pedido");

const cerrarPedido =
    document.getElementById("cerrar-pedido");

const resumenCantidad =
    document.getElementById("resumen-cantidad");

const resumenTotal =
    document.getElementById("resumen-total");

const abrirResumen =
    document.getElementById("abrir-resumen");

const modalResumen =
    document.getElementById("modal-resumen");

const cerrarResumen =
    document.getElementById("cerrar-resumen");

const productosResumen =
    document.getElementById("productos-resumen");

const cantidadResumenDetalle =
    document.getElementById(
        "cantidad-resumen-detalle"
    );

const subtotalResumen =
    document.getElementById("subtotal-resumen");

const entregaResumen =
    document.getElementById("entrega-resumen");

const totalCuentaResumen =
    document.getElementById(
        "total-cuenta-resumen"
    );


// ======================================================
// ELEMENTOS DE INFORMACIÓN
// ======================================================

const modalInformacion =
    document.getElementById(
        "modal-informacion"
    );

const volverInfo =
    document.getElementById(
        "volver-info"
    );

const continuarInfo =
    document.getElementById(
        "continuar-info"
    );

const textoServicio =
    document.getElementById(
        "servicio-seleccionado"
    );

const metodoPagoSelect =
    document.getElementById(
        "metodo-pago"
    );

const tipoSoya =
    document.getElementById(
        "tipo-soya"
    );

const datosEfectivo =
    document.getElementById(
        "datos-efectivo"
    );

const pagaConInput =
    document.getElementById(
        "paga-con"
    );


// ======================================================
// ELEMENTOS DE DIRECCIÓN
// ======================================================

const modalDireccion =
    document.getElementById(
        "modal-direccion"
    );

const volverDireccion =
    document.getElementById(
        "volver-direccion"
    );

const continuarDireccion =
    document.getElementById(
        "continuar-direccion"
    );

const calleInput =
    document.getElementById(
        "calle"
    );

const botonUbicacionActual =
    document.getElementById(
        "ubicacion-actual"
    );

const estadoUbicacion =
    document.getElementById(
        "estado-ubicacion"
    );

const botonBuscarDireccion =
    document.getElementById(
        "buscar-direccion"
    );

const resultadosDireccion =
    document.getElementById(
        "resultados-direccion"
    );


// ======================================================
// NUEVOS ELEMENTOS - DIRECCIÓN SELECCIONADA
// ======================================================

const direccionSeleccionada =
    document.getElementById(
        "direccion-seleccionada"
    );

const textoDireccionSeleccionada =
    document.getElementById(
        "texto-direccion-seleccionada"
    );

const cambiarDireccion =
    document.getElementById(
        "cambiar-direccion"
    );


const botonesServicio =
    document.querySelectorAll(
        ".servicio-btn"
    );


// ======================================================
// COSTO DE ENTREGA
// ======================================================

function obtenerCostoEntrega() {

    return (
        servicioSeleccionado === "domicilio"
            ? 30
            : 0
    );

}


// ======================================================
// ESTADO DEL BOTÓN CONTINUAR DIRECCIÓN
// ======================================================

function actualizarBotonContinuarDireccion() {

    if (!continuarDireccion) {
        return;
    }

    const direccionLista =
        direccionValidaCoacalco === true;

    continuarDireccion.disabled =
        !direccionLista;

}


// ======================================================
// MOSTRAR DIRECCIÓN SELECCIONADA
// ======================================================

function mostrarDireccionSeleccionada(
    direccion
) {

    if (
        direccionSeleccionada &&
        textoDireccionSeleccionada
    ) {

        textoDireccionSeleccionada.textContent =
            direccion;

        direccionSeleccionada.style.display =
            "block";

    }


    if (resultadosDireccion) {

        resultadosDireccion.innerHTML =
            "";

    }


    if (estadoUbicacion) {

        estadoUbicacion.textContent =
            "";

    }


    actualizarBotonContinuarDireccion();

}


// ======================================================
// OCULTAR DIRECCIÓN SELECCIONADA
// ======================================================

function ocultarDireccionSeleccionada() {

    if (direccionSeleccionada) {

        direccionSeleccionada.style.display =
            "none";

    }


    if (textoDireccionSeleccionada) {

        textoDireccionSeleccionada.textContent =
            "";

    }


    actualizarBotonContinuarDireccion();

}


// ======================================================
// AGREGAR PRODUCTOS
// ======================================================

botonesAgregar.forEach(
    function(boton) {

        boton.addEventListener(
            "click",
            function() {

                const nombre =
                    boton.dataset.nombre;

                const precio =
                    Number(
                        boton.dataset.precio
                    );


                cantidadCarrito++;

                totalCarrito +=
                    precio;


                if (pedido[nombre]) {

                    pedido[nombre]
                        .cantidad++;

                } else {

                    pedido[nombre] = {

                        precio: precio,

                        cantidad: 1

                    };

                }


                actualizarPedido();

            }
        );

    }
);


// ======================================================
// ACTUALIZAR CARRITO
// ======================================================

function actualizarPedido() {

    contador.textContent =
        cantidadCarrito;

    total.textContent =
        totalCarrito;

    totalModal.textContent =
        totalCarrito;

    resumenCantidad.textContent =
        cantidadCarrito;

    resumenTotal.textContent =
        totalCarrito +
        obtenerCostoEntrega();


    if (
        cantidadCarrito === 0
    ) {

        detallePedido.innerHTML =
            "<p>Tu carrito está vacío.</p>";

        return;

    }


    detallePedido.innerHTML =
        "";


    for (
        let nombre in pedido
    ) {

        const producto =
            pedido[nombre];

        const subtotal =
            producto.precio *
            producto.cantidad;


        detallePedido.innerHTML +=
            `

            <div class="item-pedido">

                <div>

                    <strong>
                        ${nombre}
                    </strong>

                    <div class="controles-cantidad">

                        <button
                            class="restar"
                            data-nombre="${nombre}">
                            −
                        </button>

                        <span>
                            ${producto.cantidad}
                        </span>

                        <button
                            class="sumar"
                            data-nombre="${nombre}">
                            +
                        </button>

                    </div>

                </div>


                <strong>
                    $${subtotal}
                </strong>

            </div>

        `;

    }


    activarControles();

}


// ======================================================
// BOTONES + Y - DEL CARRITO
// ======================================================

function activarControles() {

    document
        .querySelectorAll(".sumar")
        .forEach(
            function(boton) {

                boton.addEventListener(
                    "click",
                    function() {

                        const nombre =
                            boton.dataset.nombre;


                        pedido[nombre]
                            .cantidad++;

                        cantidadCarrito++;

                        totalCarrito +=
                            pedido[nombre]
                                .precio;


                        actualizarPedido();

                    }
                );

            }
        );


    document
        .querySelectorAll(".restar")
        .forEach(
            function(boton) {

                boton.addEventListener(
                    "click",
                    function() {

                        const nombre =
                            boton.dataset.nombre;


                        pedido[nombre]
                            .cantidad--;

                        cantidadCarrito--;

                        totalCarrito -=
                            pedido[nombre]
                                .precio;


                        if (
                            pedido[nombre]
                                .cantidad === 0
                        ) {

                            delete pedido[nombre];

                        }


                        actualizarPedido();

                    }
                );

            }
        );

}


// ======================================================
// RESUMEN DE CUENTA
// ======================================================

function actualizarResumenCuenta() {

    productosResumen.innerHTML =
        "";


    cantidadResumenDetalle
        .textContent =
        cantidadCarrito;


    for (
        let nombre in pedido
    ) {

        const producto =
            pedido[nombre];

        const subtotal =
            producto.precio *
            producto.cantidad;


        productosResumen.innerHTML +=
            `

            <div class="producto-resumen">

                <span>
                    ${nombre}
                    x${producto.cantidad}
                </span>

                <strong>
                    $${subtotal}
                </strong>

            </div>

        `;

    }


    const costoEntrega =
        obtenerCostoEntrega();


    subtotalResumen.textContent =
        totalCarrito;


    entregaResumen.textContent =
        costoEntrega;


    totalCuentaResumen.textContent =
        totalCarrito +
        costoEntrega;

}


// ======================================================
// ABRIR / CERRAR CARRITO
// ======================================================

if (botonVerPedido) {

    botonVerPedido
        .addEventListener(
            "click",
            function() {

                modalPedido.style.display =
                    "flex";

            }
        );

}


if (cerrarPedido) {

    cerrarPedido
        .addEventListener(
            "click",
            function() {

                modalPedido.style.display =
                    "none";

            }
        );

}


// ======================================================
// SELECCIONAR TIPO DE SERVICIO
// ======================================================

botonesServicio.forEach(
    function(boton) {

        boton.addEventListener(
            "click",
            function() {

                servicioSeleccionado =
                    boton.dataset.servicio;


                actualizarPedido();


                metodoPagoSelect.innerHTML =
                    '<option value="">Selecciona un método</option>';


                // ==========================
                // PARA LLEVAR
                // ==========================

                if (
                    servicioSeleccionado ===
                    "llevar"
                ) {

                    metodoPagoSelect
                        .innerHTML +=
                        `

                        <option value="Efectivo">
                            Efectivo
                        </option>

                        <option value="Transferencia">
                            Transferencia
                        </option>

                        <option value="Tarjeta">
                            Tarjeta
                        </option>

                    `;


                    textoServicio.textContent =
                        "🛍 Para llevar";

                }


                // ==========================
                // A DOMICILIO
                // ==========================

                if (
                    servicioSeleccionado ===
                    "domicilio"
                ) {

                    metodoPagoSelect
                        .innerHTML +=
                        `

                        <option value="Efectivo">
                            Efectivo
                        </option>

                        <option value="Transferencia">
                            Transferencia
                        </option>

                    `;


                    textoServicio.textContent =
                        "🛵 A domicilio";

                }


                actualizarDatosEfectivo();


                modalInformacion.style.display =
                    "flex";

            }
        );

    }
);


// ======================================================
// REGRESAR DESDE INFORMACIÓN
// ======================================================

if (volverInfo) {

    volverInfo.addEventListener(
        "click",
        function() {

            modalInformacion.style.display =
                "none";

        }
    );

}


// ======================================================
// MÉTODO DE PAGO / EFECTIVO
// ======================================================

if (metodoPagoSelect) {

    metodoPagoSelect.addEventListener(
        "change",
        actualizarDatosEfectivo
    );

}


function actualizarDatosEfectivo() {

    if (!datosEfectivo) {

        return;

    }


    if (
        servicioSeleccionado ===
            "domicilio" &&
        metodoPagoSelect.value ===
            "Efectivo"
    ) {

        datosEfectivo.style.display =
            "block";

    } else {

        datosEfectivo.style.display =
            "none";


        if (pagaConInput) {

            pagaConInput.value =
                "";

        }

    }

}


// ======================================================
// CONTINUAR DESDE INFORMACIÓN
// ======================================================

if (continuarInfo) {

    continuarInfo.addEventListener(
        "click",
        function() {

            const nombre =
                document
                    .getElementById(
                        "nombre-cliente"
                    )
                    .value
                    .trim();


            const telefono =
                document
                    .getElementById(
                        "telefono-cliente"
                    )
                    .value
                    .trim();


            const metodoPago =
                metodoPagoSelect.value;


            // ==========================
            // VALIDAR NOMBRE
            // ==========================

            if (
                nombre === ""
            ) {

                alert(
                    "Por favor escribe tu nombre."
                );

                return;

            }


            // ==========================
            // VALIDAR TELÉFONO
            // ==========================

            if (
                telefono === ""
            ) {

                alert(
                    "Por favor escribe tu teléfono."
                );

                return;

            }


            // ==========================
            // VALIDAR MÉTODO DE PAGO
            // ==========================

            if (
                metodoPago === ""
            ) {

                alert(
                    "Selecciona un método de pago."
                );

                return;

            }


            // ==========================
            // DOMICILIO + EFECTIVO
            // ==========================

            if (
                servicioSeleccionado ===
                    "domicilio" &&
                metodoPago ===
                    "Efectivo"
            ) {

                const pagaCon =
                    pagaConInput.value;


                if (
                    pagaCon === ""
                ) {

                    alert(
                        "Indica con cuánto vas a pagar."
                    );

                    return;

                }


                const totalFinal =
                    totalCarrito +
                    obtenerCostoEntrega();


                if (
                    Number(pagaCon) <
                    totalFinal
                ) {

                    alert(
                        "El monto con el que pagarás no puede ser menor al total del pedido."
                    );

                    return;

                }

            }


            // ==========================
            // PARA LLEVAR
            // ==========================

            if (
                servicioSeleccionado ===
                "llevar"
            ) {

                enviarPedidoWhatsApp();

                return;

            }


            // ==========================
            // DOMICILIO
            // ==========================

            if (
                servicioSeleccionado ===
                "domicilio"
            ) {

                modalInformacion
                    .style.display =
                    "none";


                modalDireccion
                    .style.display =
                    "flex";


                actualizarBotonContinuarDireccion();

            }

        }
    );

}


// ======================================================
// REGRESAR DESDE DIRECCIÓN
// ======================================================

if (volverDireccion) {

    volverDireccion.addEventListener(
        "click",
        function() {

            modalDireccion.style.display =
                "none";


            modalInformacion.style.display =
                "flex";

        }
    );

}


// ======================================================
// USAR UBICACIÓN ACTUAL
// SOLO PERMITIR COACALCO
// ======================================================

if (botonUbicacionActual) {

    botonUbicacionActual.addEventListener(
        "click",
        function() {

            if (!navigator.geolocation) {

                estadoUbicacion.textContent =
                    "❌ Tu navegador no permite obtener la ubicación.";

                return;

            }


            estadoUbicacion.textContent =
                "📍 Verificando tu ubicación...";


            navigator.geolocation
                .getCurrentPosition(

                    async function(posicion) {

                        const latitud =
                            posicion.coords.latitude;

                        const longitud =
                            posicion.coords.longitude;

                        const precision =
                            posicion.coords.accuracy;


                        try {

                            // ==============================
                            // CONVERTIR GPS A DIRECCIÓN
                            // ==============================

                            const url =
                                "https://nominatim.openstreetmap.org/reverse" +
                                "?format=jsonv2" +
                                "&lat=" +
                                latitud +
                                "&lon=" +
                                longitud +
                                "&zoom=18" +
                                "&addressdetails=1" +
                                "&accept-language=es";


                            const respuesta =
                                await fetch(url);


                            if (!respuesta.ok) {

                                throw new Error(
                                    "No se pudo verificar la ubicación."
                                );

                            }


                            const datos =
                                await respuesta.json();


                            const direccion =
                                datos.address || {};


                            // ==============================
                            // BUSCAR NOMBRE DE LA ZONA
                            // ==============================

                            const zona =
                                [
                                    direccion.city,
                                    direccion.town,
                                    direccion.village,
                                    direccion.municipality,
                                    direccion.county,
                                    direccion.city_district,
                                    direccion.suburb,
                                    direccion.state_district
                                ]
                                    .filter(Boolean)
                                    .join(" ")
                                    .normalize("NFD")
                                    .replace(
                                        /[\u0300-\u036f]/g,
                                        ""
                                    )
                                    .toLowerCase();


                            console.log(
                                "Zona GPS detectada:",
                                zona
                            );


                            // ==============================
                            // VERIFICAR COACALCO
                            // ==============================

                            if (
                                !zona.includes(
                                    "coacalco"
                                )
                            ) {

                                latitudCliente =
                                    null;

                                longitudCliente =
                                    null;

                                usoUbicacionActual =
                                    false;

                                direccionValidaCoacalco =
                                    false;

                                direccionUbicacionActual =
                                    "";


                                ocultarDireccionSeleccionada();


                                estadoUbicacion.textContent =
                                    "❌ Tu ubicación está fuera de nuestra zona de entrega. Solo entregamos en Coacalco.";


                                actualizarBotonContinuarDireccion();

                                return;

                            }


                            // ==============================
                            // UBICACIÓN VÁLIDA
                            // ==============================

                            latitudCliente =
                                latitud;

                            longitudCliente =
                                longitud;


                            usoUbicacionActual =
                                true;


                            direccionValidaCoacalco =
                                true;


                            direccionUbicacionActual =
                                datos.display_name || "";


                            if (calleInput) {

                                calleInput.value =
                                    "";

                            }


                            if (
                                resultadosDireccion
                            ) {

                                resultadosDireccion.innerHTML =
                                    "";

                            }


                            // MOSTRAMOS LA NUEVA TARJETA

                            mostrarDireccionSeleccionada(
                                direccionUbicacionActual ||
                                "Ubicación actual"
                            );


                            estadoUbicacion.textContent =
                                `✅ Ubicación válida dentro de Coacalco (precisión aproximada: ${Math.round(precision)} metros)`;


                            actualizarBotonContinuarDireccion();


                        } catch (error) {

                            console.error(
                                "Error verificando ubicación:",
                                error
                            );


                            latitudCliente =
                                null;

                            longitudCliente =
                                null;

                            usoUbicacionActual =
                                false;

                            direccionValidaCoacalco =
                                false;

                            direccionUbicacionActual =
                                "";


                            ocultarDireccionSeleccionada();


                            estadoUbicacion.textContent =
                                "❌ No pudimos verificar tu ubicación. Intenta escribir tu dirección.";


                            actualizarBotonContinuarDireccion();

                        }

                    },


                    function(error) {

                        console.error(error);


                        latitudCliente =
                            null;

                        longitudCliente =
                            null;

                        usoUbicacionActual =
                            false;

                        direccionValidaCoacalco =
                            false;

                        direccionUbicacionActual =
                            "";


                        ocultarDireccionSeleccionada();


                        estadoUbicacion.textContent =
                            "❌ No se pudo obtener tu ubicación.";


                        actualizarBotonContinuarDireccion();

                    },


                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 0
                    }

                );

        }
    );

}


// ======================================================
// AQUÍ TERMINA LA PARTE 1 DE 2
// ======================================================

// ======================================================
// PARTE 2
// ANGUILA SUSHI
// GOOGLE PLACES + WHATSAPP
// ======================================================


// ======================================================
// AUTOCOMPLETADO DE DIRECCIÓN CON GOOGLE PLACES
// ======================================================

let temporizadorDireccion = null;

let AutocompleteSuggestionGoogle = null;
let AutocompleteSessionTokenGoogle = null;
let tokenGoogle = null;


// ======================================================
// LÍMITES APROXIMADOS DE COACALCO
// ======================================================

const limitesCoacalco = {

    north: 19.667,
    south: 19.583,
    west: -99.134,
    east: -99.066

};


// ======================================================
// INICIALIZAR GOOGLE PLACES
// ======================================================

async function inicializarGooglePlaces() {

    if (
        AutocompleteSuggestionGoogle &&
        AutocompleteSessionTokenGoogle
    ) {

        return;

    }


    const libreriaPlaces =
        await google.maps.importLibrary(
            "places"
        );


    AutocompleteSuggestionGoogle =
        libreriaPlaces.AutocompleteSuggestion;


    AutocompleteSessionTokenGoogle =
        libreriaPlaces.AutocompleteSessionToken;


    tokenGoogle =
        new AutocompleteSessionTokenGoogle();

}


// ======================================================
// CREAR NUEVO TOKEN DE GOOGLE
// ======================================================

function crearNuevoTokenGoogle() {

    if (
        AutocompleteSessionTokenGoogle
    ) {

        tokenGoogle =
            new AutocompleteSessionTokenGoogle();

    }

}


// ======================================================
// BUSCAR DIRECCIONES EN GOOGLE
// ======================================================

async function buscarDirecciones(
    texto
) {

    if (!resultadosDireccion) {

        return;

    }


    resultadosDireccion.innerHTML =
        `
        <p class="mensaje-direccion">
            🔍 Buscando en Coacalco...
        </p>
        `;


    try {

        await inicializarGooglePlaces();


        if (!tokenGoogle) {

            crearNuevoTokenGoogle();

        }


        // ==============================================
        // PETICIÓN DE AUTOCOMPLETADO
        // ==============================================

        const solicitud = {

            input:
                texto +
                ", Coacalco, Estado de México",

            locationRestriction:
                limitesCoacalco,

            includedRegionCodes:
                ["mx"],

            language:
                "es-MX",

            region:
                "mx",

            sessionToken:
                tokenGoogle

        };


        const respuesta =
            await AutocompleteSuggestionGoogle
                .fetchAutocompleteSuggestions(
                    solicitud
                );


        const sugerencias =
            respuesta.suggestions || [];


        resultadosDireccion.innerHTML =
            "";


        // ==============================================
        // SIN RESULTADOS
        // ==============================================

        if (
            sugerencias.length === 0
        ) {

            resultadosDireccion.innerHTML =
                `
                <p class="mensaje-direccion">
                    ❌ No encontramos esa dirección en Coacalco.
                </p>
                `;

            return;

        }


        // ==============================================
        // MOSTRAR MÁXIMO 5 RESULTADOS
        // ==============================================

        sugerencias
            .slice(0, 5)
            .forEach(
                function(sugerencia) {

                    const prediccion =
                        sugerencia.placePrediction;


                    if (!prediccion) {

                        return;

                    }


                    const botonResultado =
                        document.createElement(
                            "button"
                        );


                    botonResultado.type =
                        "button";


                    botonResultado.className =
                        "resultado-direccion";


                    botonResultado.textContent =
                        "📍 " +
                        prediccion.text.toString();


                    // ==================================
                    // SELECCIONAR DIRECCIÓN
                    // ==================================

                    botonResultado
                        .addEventListener(
                            "click",
                            async function() {

                                resultadosDireccion.innerHTML =
                                    `
                                    <p class="mensaje-direccion">
                                        📍 Verificando dirección...
                                    </p>
                                    `;


                                try {

                                    const lugar =
                                        prediccion.toPlace();


                                    await lugar.fetchFields({

                                        fields: [

                                            "formattedAddress",
                                            "location"

                                        ]

                                    });


                                    if (
                                        !lugar.location
                                    ) {

                                        throw new Error(
                                            "La dirección no tiene coordenadas."
                                        );

                                    }


                                    const direccionCompleta =
                                        lugar.formattedAddress ||
                                        prediccion.text.toString();


                                    // ==========================
                                    // COMPROBAR COACALCO
                                    // ==========================

                                    const direccionNormalizada =
                                        direccionCompleta
                                            .normalize(
                                                "NFD"
                                            )
                                            .replace(
                                                /[\u0300-\u036f]/g,
                                                ""
                                            )
                                            .toLowerCase();


                                    if (
                                        !direccionNormalizada
                                            .includes(
                                                "coacalco"
                                            )
                                    ) {

                                        calleInput.value =
                                            "";


                                        latitudCliente =
                                            null;


                                        longitudCliente =
                                            null;


                                        usoUbicacionActual =
                                            false;


                                        direccionValidaCoacalco =
                                            false;


                                        direccionUbicacionActual =
                                            "";


                                        resultadosDireccion.innerHTML =
                                            "";


                                        ocultarDireccionSeleccionada();


                                        estadoUbicacion.textContent =
                                            "❌ Esa dirección está fuera de Coacalco.";


                                        actualizarBotonContinuarDireccion();


                                        return;

                                    }


                                    // ==========================
                                    // GUARDAR DIRECCIÓN
                                    // ==========================

                                    calleInput.value =
                                        direccionCompleta;


                                    latitudCliente =
                                        lugar.location.lat();


                                    longitudCliente =
                                        lugar.location.lng();


                                    usoUbicacionActual =
                                        false;


                                    direccionValidaCoacalco =
                                        true;


                                    direccionUbicacionActual =
                                        "";


                                    resultadosDireccion.innerHTML =
                                        "";


                                    // ==========================
                                    // MOSTRAR TARJETA
                                    // ==========================

                                    mostrarDireccionSeleccionada(
                                        direccionCompleta
                                    );


                                    estadoUbicacion.textContent =
                                        "";


                                    actualizarBotonContinuarDireccion();


                                    // Terminó esta búsqueda.
                                    // Creamos token para
                                    // una futura búsqueda.

                                    crearNuevoTokenGoogle();


                                } catch (error) {

                                    console.error(
                                        "Error al seleccionar dirección:",
                                        error
                                    );


                                    resultadosDireccion.innerHTML =
                                        "";


                                    direccionValidaCoacalco =
                                        false;


                                    latitudCliente =
                                        null;


                                    longitudCliente =
                                        null;


                                    ocultarDireccionSeleccionada();


                                    estadoUbicacion.textContent =
                                        "❌ No pudimos verificar esa dirección.";


                                    actualizarBotonContinuarDireccion();

                                }

                            }
                        );


                    resultadosDireccion
                        .appendChild(
                            botonResultado
                        );

                }
            );


    } catch (error) {

        console.error(
            "Error Google Places:",
            error
        );


        resultadosDireccion.innerHTML =
            `
            <p class="mensaje-direccion">
                ❌ No se pudo buscar la dirección.
            </p>
            `;

    }

}


// ======================================================
// BUSCAR AUTOMÁTICAMENTE MIENTRAS ESCRIBE
// ======================================================

if (calleInput) {

    calleInput.addEventListener(
        "input",
        function() {

            const direccion =
                calleInput.value.trim();


            // ==========================================
            // AL MODIFICAR EL TEXTO,
            // LA DIRECCIÓN ANTERIOR YA NO ES VÁLIDA
            // ==========================================

            direccionValidaCoacalco =
                false;


            usoUbicacionActual =
                false;


            direccionUbicacionActual =
                "";


            latitudCliente =
                null;


            longitudCliente =
                null;


            estadoUbicacion.textContent =
                "";


            ocultarDireccionSeleccionada();


            actualizarBotonContinuarDireccion();


            clearTimeout(
                temporizadorDireccion
            );


            // ==========================================
            // MÍNIMO 3 CARACTERES
            // ==========================================

            if (
                direccion.length < 3
            ) {

                resultadosDireccion.innerHTML =
                    "";

                return;

            }


            // ==========================================
            // ESPERAMOS MEDIO SEGUNDO
            // DESPUÉS DE ESCRIBIR
            // ==========================================

            temporizadorDireccion =
                setTimeout(
                    function() {

                        buscarDirecciones(
                            direccion
                        );

                    },
                    500
                );

        }
    );

}


// ======================================================
// BUSCAR TAMBIÉN CON LA LUPA
// ======================================================

if (botonBuscarDireccion) {

    botonBuscarDireccion.addEventListener(
        "click",
        function() {

            const direccion =
                calleInput.value.trim();


            if (
                direccion.length < 3
            ) {

                alert(
                    "Escribe al menos 3 caracteres."
                );

                return;

            }


            // La dirección escrita todavía
            // no cuenta como seleccionada.

            direccionValidaCoacalco =
                false;


            usoUbicacionActual =
                false;


            direccionUbicacionActual =
                "";


            latitudCliente =
                null;


            longitudCliente =
                null;


            ocultarDireccionSeleccionada();


            actualizarBotonContinuarDireccion();


            clearTimeout(
                temporizadorDireccion
            );


            buscarDirecciones(
                direccion
            );

        }
    );

}


// ======================================================
// CAMBIAR DIRECCIÓN SELECCIONADA
// ======================================================

if (cambiarDireccion) {

    cambiarDireccion.addEventListener(
        "click",
        function() {

            // ==========================================
            // BORRAR DIRECCIÓN ANTERIOR
            // ==========================================

            direccionValidaCoacalco =
                false;


            usoUbicacionActual =
                false;


            direccionUbicacionActual =
                "";


            latitudCliente =
                null;


            longitudCliente =
                null;


            if (calleInput) {

                calleInput.value =
                    "";

            }


            if (resultadosDireccion) {

                resultadosDireccion.innerHTML =
                    "";

            }


            if (estadoUbicacion) {

                estadoUbicacion.textContent =
                    "";

            }


            ocultarDireccionSeleccionada();


            actualizarBotonContinuarDireccion();


            // ==========================================
            // VOLVER AL BUSCADOR
            // ==========================================

            if (calleInput) {

                calleInput.focus();

            }

        }
    );

}


// ======================================================
// CONTINUAR DESDE DIRECCIÓN
// ======================================================

if (continuarDireccion) {

    continuarDireccion.addEventListener(
        "click",
        function() {

            const direccionManual =
                calleInput.value.trim();


            // ==========================================
            // NO ESCRIBIÓ NI COMPARTIÓ GPS
            // ==========================================

            if (
                direccionManual === "" &&
                usoUbicacionActual === false
            ) {

                alert(
                    "Escribe tu dirección o comparte tu ubicación actual."
                );

                return;

            }


            // ==========================================
            // ESCRIBIÓ ALGO PERO
            // NO SELECCIONÓ UNA DIRECCIÓN VÁLIDA
            // ==========================================

            if (
                usoUbicacionActual ===
                    false &&
                direccionValidaCoacalco ===
                    false
            ) {

                alert(
                    "Selecciona una dirección válida dentro de Coacalco."
                );

                return;

            }


            // ==========================================
            // TODO CORRECTO
            // ==========================================

            enviarPedidoWhatsApp();

        }
    );

}


// ======================================================
// ENVIAR PEDIDO A WHATSAPP
// ======================================================

function enviarPedidoWhatsApp() {

    const nombre =
        document
            .getElementById(
                "nombre-cliente"
            )
            .value
            .trim();


    const telefono =
        document
            .getElementById(
                "telefono-cliente"
            )
            .value
            .trim();


    const soya =
        tipoSoya.value;


    const cubiertos =
        document
            .getElementById(
                "cubiertos"
            )
            .value;


    const metodoPago =
        metodoPagoSelect.value;


    const comentarios =
        document
            .getElementById(
                "comentarios"
            )
            .value
            .trim();


    const costoEntrega =
        obtenerCostoEntrega();


    const totalFinal =
        totalCarrito +
        costoEntrega;


    // ==================================================
    // ENCABEZADO
    // ==================================================

    let mensaje =
        "🍣 *PEDIDO ANGUILA SUSHI*\n\n";


    mensaje +=
        `👤 Nombre: ${nombre}\n`;


    mensaje +=
        `📱 Teléfono: ${telefono}\n`;


    // ==================================================
    // PARA LLEVAR
    // ==================================================

    if (
        servicioSeleccionado ===
        "llevar"
    ) {

        mensaje +=
            "🛍 Servicio: Para llevar\n";

    }


    // ==================================================
    // A DOMICILIO
    // ==================================================

    if (
        servicioSeleccionado ===
        "domicilio"
    ) {

        mensaje +=
            "🛵 Servicio: A domicilio\n";


        // ==============================================
        // UBICACIÓN OBTENIDA POR GPS
        // ==============================================

        if (
            usoUbicacionActual
        ) {

            if (
                direccionUbicacionActual !==
                ""
            ) {

                mensaje +=
                    `📍 Dirección: ${direccionUbicacionActual}\n`;

            }


            if (
                latitudCliente !== null &&
                longitudCliente !== null
            ) {

                mensaje +=
                    `🗺️ Ubicación: https://www.google.com/maps?q=${latitudCliente},${longitudCliente}\n`;

            }

        }


        // ==============================================
        // DIRECCIÓN SELECCIONADA EN GOOGLE PLACES
        // ==============================================

        else {

            const direccionManual =
                calleInput.value.trim();


            mensaje +=
                `📍 Dirección: ${direccionManual}\n`;


            // ==========================================
            // TAMBIÉN MANDAMOS
            // EL ENLACE DE GOOGLE MAPS
            // ==========================================

            if (
                latitudCliente !== null &&
                longitudCliente !== null
            ) {

                mensaje +=
                    `🗺️ Ubicación: https://www.google.com/maps?q=${latitudCliente},${longitudCliente}\n`;

            }

        }

    }


    // ==================================================
    // SOYA
    // ==================================================

    mensaje +=
        `🥢 Soya: ${soya}\n`;


    // ==================================================
    // CUBIERTOS
    // ==================================================

    mensaje +=
        `🍴 Cubiertos: ${cubiertos}\n`;


    // ==================================================
    // MÉTODO DE PAGO
    // ==================================================

    mensaje +=
        `💳 Método de pago: ${metodoPago}\n`;


    // ==================================================
    // EFECTIVO
    // ==================================================

    if (
        servicioSeleccionado ===
            "domicilio" &&
        metodoPago ===
            "Efectivo"
    ) {

        const pagaCon =
            Number(
                pagaConInput.value
            );


        mensaje +=
            `💵 Pagará con: $${pagaCon}\n`;

    }


    // ==================================================
    // COMENTARIOS
    // ==================================================

    if (
        comentarios !== ""
    ) {

        mensaje +=
            `📝 Comentarios: ${comentarios}\n`;

    }


    // ==================================================
    // PRODUCTOS
    // ==================================================

    mensaje +=
        "\n🛒 *PEDIDO*\n\n";


    for (
        let nombreProducto in pedido
    ) {

        const producto =
            pedido[nombreProducto];


        const subtotal =
            producto.precio *
            producto.cantidad;


        mensaje +=
            `${nombreProducto} x${producto.cantidad} - $${subtotal}\n`;

    }


    // ==================================================
    // COSTO DE ENVÍO
    // ==================================================

    if (
        servicioSeleccionado ===
        "domicilio"
    ) {

        mensaje +=
            `Envío: $${costoEntrega}\n`;

    }


    // ==================================================
    // TOTAL
    // ==================================================

    mensaje +=
        `\n💰 *Total: $${totalFinal}*`;


    // ==================================================
    // NÚMERO DE WHATSAPP
    // ==================================================

    const numeroWhatsApp =
        "525532727920";


    const urlWhatsApp =
        "https://wa.me/" +
        numeroWhatsApp +
        "?text=" +
        encodeURIComponent(
            mensaje
        );


    window.open(
        urlWhatsApp,
        "_blank"
    );

}


// ======================================================
// ABRIR RESUMEN DE CUENTA
// ======================================================

if (abrirResumen) {

    abrirResumen.addEventListener(
        "click",
        function() {

            actualizarResumenCuenta();


            modalResumen.style.display =
                "flex";

        }
    );

}


// ======================================================
// CERRAR RESUMEN
// ======================================================

if (cerrarResumen) {

    cerrarResumen.addEventListener(
        "click",
        function() {

            modalResumen.style.display =
                "none";

        }
    );

}


// ======================================================
// CERRAR RESUMEN AL TOCAR AFUERA
// ======================================================

if (modalResumen) {

    modalResumen.addEventListener(
        "click",
        function(evento) {

            if (
                evento.target ===
                modalResumen
            ) {

                modalResumen.style.display =
                    "none";

            }

        }
    );

}


// ======================================================
// INICIAR PÁGINA
// ======================================================

actualizarPedido();

actualizarDatosEfectivo();

actualizarBotonContinuarDireccion();