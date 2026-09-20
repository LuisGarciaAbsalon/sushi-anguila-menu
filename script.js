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
    document.getElementById("cantidad-resumen-detalle");

const subtotalResumen =
    document.getElementById("subtotal-resumen");

const entregaResumen =
    document.getElementById("entrega-resumen");

const totalCuentaResumen =
    document.getElementById("total-cuenta-resumen");


// ======================================================
// ELEMENTOS DE INFORMACIÓN
// ======================================================

const modalInformacion =
    document.getElementById("modal-informacion");

const volverInfo =
    document.getElementById("volver-info");

const continuarInfo =
    document.getElementById("continuar-info");

const textoServicio =
    document.getElementById("servicio-seleccionado");

const metodoPagoSelect =
    document.getElementById("metodo-pago");

    const tipoSoya =
    document.getElementById("tipo-soya");

const datosEfectivo =
    document.getElementById("datos-efectivo");

const pagaConInput =
    document.getElementById("paga-con");


// ======================================================
// ELEMENTOS DE DIRECCIÓN
// ======================================================

const modalDireccion =
    document.getElementById("modal-direccion");

const volverDireccion =
    document.getElementById("volver-direccion");

const continuarDireccion =
    document.getElementById("continuar-direccion");

const calleInput =
    document.getElementById("calle");

const botonUbicacionActual =
    document.getElementById("ubicacion-actual");

const estadoUbicacion =
    document.getElementById("estado-ubicacion");

const botonBuscarDireccion =
    document.getElementById("buscar-direccion");

const resultadosDireccion =
    document.getElementById("resultados-direccion");


// ======================================================
// BOTONES DEL TIPO DE SERVICIO
// ======================================================

const botonesServicio =
    document.querySelectorAll(".servicio-btn");


// ======================================================
// AGREGAR PRODUCTOS
// ======================================================

botonesAgregar.forEach(function(boton) {

    boton.addEventListener("click", function() {

        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);

        cantidadCarrito++;
        totalCarrito += precio;


        if (pedido[nombre]) {

            pedido[nombre].cantidad++;

        } else {

            pedido[nombre] = {
                precio: precio,
                cantidad: 1
            };

        }


        actualizarPedido();

    });

});


// ======================================================
// ACTUALIZAR RESUMEN DE CUENTA
// ======================================================
function obtenerCostoEntrega() {

    if (servicioSeleccionado === "domicilio") {
        return 30;
    }

    return 0;
}

function actualizarResumenCuenta() {

    productosResumen.innerHTML = "";

    cantidadResumenDetalle.textContent =
        cantidadCarrito;


    for (let nombre in pedido) {

        const producto =
            pedido[nombre];

        const subtotal =
            producto.precio *
            producto.cantidad;


        productosResumen.innerHTML += `

            <div class="producto-resumen">

                <span>
                    ${nombre} x${producto.cantidad}
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
        totalCarrito + costoEntrega;

}

// ======================================================
// ACTUALIZAR CARRITO
// ======================================================

function actualizarPedido() {

    contador.textContent = cantidadCarrito;
    total.textContent = totalCarrito;
    totalModal.textContent = totalCarrito;
    resumenCantidad.textContent = cantidadCarrito;
    resumenTotal.textContent =
    totalCarrito + obtenerCostoEntrega();


    if (cantidadCarrito === 0) {

        detallePedido.innerHTML =
            "<p>Tu carrito está vacío.</p>";

        return;
    }


    detallePedido.innerHTML = "";


    for (let nombre in pedido) {

        const producto = pedido[nombre];

        const subtotal =
            producto.precio * producto.cantidad;


        detallePedido.innerHTML += `

            <div class="item-pedido">

                <div>

                    <strong>${nombre}</strong>

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

    const botonesSumar =
        document.querySelectorAll(".sumar");

    const botonesRestar =
        document.querySelectorAll(".restar");


    botonesSumar.forEach(function(boton) {

        boton.addEventListener("click", function() {

            const nombre = boton.dataset.nombre;

            pedido[nombre].cantidad++;

            cantidadCarrito++;

            totalCarrito +=
                pedido[nombre].precio;

            actualizarPedido();

        });

    });


    botonesRestar.forEach(function(boton) {

        boton.addEventListener("click", function() {

            const nombre = boton.dataset.nombre;

            pedido[nombre].cantidad--;

            cantidadCarrito--;

            totalCarrito -=
                pedido[nombre].precio;


            if (pedido[nombre].cantidad === 0) {

                delete pedido[nombre];

            }


            actualizarPedido();

        });

    });

}


// ======================================================
// ABRIR CARRITO
// ======================================================

if (botonVerPedido) {

    botonVerPedido.addEventListener("click", function() {

        modalPedido.style.display = "flex";

    });

}


// ======================================================
// CERRAR CARRITO
// ======================================================

if (cerrarPedido) {

    cerrarPedido.addEventListener("click", function() {

        modalPedido.style.display = "none";

    });

}


// ======================================================
// SELECCIONAR TIPO DE SERVICIO
// ======================================================

botonesServicio.forEach(function(boton) {

    boton.addEventListener("click", function() {

        servicioSeleccionado =
            boton.dataset.servicio;

         

actualizarPedido();

            


        // Reiniciar métodos de pago

        metodoPagoSelect.innerHTML =
            '<option value="">Selecciona un método</option>';


        // ==============================================
        // PARA LLEVAR
        // Efectivo / Transferencia / Tarjeta
        // ==============================================

        if (servicioSeleccionado === "llevar") {

            metodoPagoSelect.innerHTML += `

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


        // ==============================================
        // A DOMICILIO
        // Efectivo / Transferencia
        // ==============================================

        if (servicioSeleccionado === "domicilio") {

            metodoPagoSelect.innerHTML += `

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


        // Ocultar campo de efectivo al cambiar servicio

        actualizarDatosEfectivo();


        // Ambos pasan primero por Información del pedido

        modalInformacion.style.display = "flex";

    });

});


// ======================================================
// REGRESAR DESDE INFORMACIÓN
// ======================================================

if (volverInfo) {

    volverInfo.addEventListener("click", function() {

        modalInformacion.style.display = "none";

    });

}


// ======================================================
// CAMBIO DE MÉTODO DE PAGO
// ======================================================

if (metodoPagoSelect) {

    metodoPagoSelect.addEventListener(
        "change",
        function() {

            actualizarDatosEfectivo();

        }
    );

}


// ======================================================
// MOSTRAR "CON CUÁNTO VA A PAGAR"
// SOLO DOMICILIO + EFECTIVO
// ======================================================

function actualizarDatosEfectivo() {

    if (!datosEfectivo) {
        return;
    }


    if (
        servicioSeleccionado === "domicilio" &&
        metodoPagoSelect.value === "Efectivo"
    ) {

        datosEfectivo.style.display = "block";

    } else {

        datosEfectivo.style.display = "none";


        if (pagaConInput) {

            pagaConInput.value = "";

        }

    }

}


// ======================================================
// CONTINUAR DESDE INFORMACIÓN
// ======================================================

if (continuarInfo) {

    continuarInfo.addEventListener("click", function() {

        const nombre =
            document
                .getElementById("nombre-cliente")
                .value
                .trim();

        const telefono =
            document
                .getElementById("telefono-cliente")
                .value
                .trim();

        const metodoPago =
            metodoPagoSelect.value;


        // ==============================================
        // VALIDAR NOMBRE
        // ==============================================

        if (nombre === "") {

            alert(
                "Por favor escribe tu nombre."
            );

            return;

        }


        // ==============================================
        // VALIDAR TELÉFONO
        // ==============================================

        if (telefono === "") {

            alert(
                "Por favor escribe tu teléfono."
            );

            return;

        }


        // ==============================================
        // VALIDAR MÉTODO DE PAGO
        // ==============================================

        if (metodoPago === "") {

            alert(
                "Selecciona un método de pago."
            );

            return;

        }


        // ==============================================
        // DOMICILIO + EFECTIVO
        // ==============================================

        if (
            servicioSeleccionado === "domicilio" &&
            metodoPago === "Efectivo"
        ) {

            const pagaCon =
                pagaConInput.value;


            if (pagaCon === "") {

                alert(
                    "Indica con cuánto vas a pagar."
                );

                return;

            }

const totalFinal =
    totalCarrito + obtenerCostoEntrega();

if (
    Number(pagaCon) < totalFinal
) {

    alert(
        "El monto con el que pagarás no puede ser menor al total del pedido."
    );

    return;

}

        }


        // ==============================================
        // PARA LLEVAR
        // VA DIRECTO A WHATSAPP
        // ==============================================

        if (
            servicioSeleccionado === "llevar"
        ) {

            enviarPedidoWhatsApp();

            return;

        }


        // ==============================================
        // DOMICILIO
        // VA A DIRECCIÓN
        // ==============================================

        if (
            servicioSeleccionado === "domicilio"
        ) {

            modalInformacion.style.display =
                "none";

            modalDireccion.style.display =
                "flex";

        }

    });

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
                "Obteniendo tu ubicación...";


            navigator.geolocation.getCurrentPosition(

                function(posicion) {

                    latitudCliente =
                        posicion.coords.latitude;

                    longitudCliente =
                        posicion.coords.longitude;

                    usoUbicacionActual = true;

                    const precision =
                        posicion.coords.accuracy;

                    if (calleInput) {
                        calleInput.value = "";
                    }

                    estadoUbicacion.textContent =
                        `✅ Ubicación obtenida (precisión aproximada: ${Math.round(precision)} metros)`;
                },

                function(error) {

                    usoUbicacionActual = false;

                    estadoUbicacion.textContent =
                        "❌ No se pudo obtener tu ubicación";

                    console.log(error);
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
// SI ESCRIBE UNA DIRECCIÓN MANUAL,
// DEJAMOS DE USAR GPS
// ======================================================

if (calleInput) {

    calleInput.addEventListener(
        "input",
        function() {

            if (
                calleInput.value.trim() !== ""
            ) {

                usoUbicacionActual = false;

                latitudCliente = null;
                longitudCliente = null;

                estadoUbicacion.textContent = "";

            }

        }
    );

}

// ======================================================
// BUSCAR DIRECCIÓN
// ======================================================

if (botonBuscarDireccion) {

    botonBuscarDireccion.addEventListener(
        "click",
        async function() {

            const direccion =
                calleInput.value.trim();


            // Si está vacío

            if (direccion === "") {

                alert(
                    "Escribe una dirección para buscar."
                );

                return;

            }


            // Mostrar que está buscando

            resultadosDireccion.innerHTML =
                '<p class="mensaje-direccion">🔍 Buscando dirección...</p>';


            botonBuscarDireccion.disabled = true;


            try {

                const url =
                    "https://nominatim.openstreetmap.org/search" +
                    "?format=jsonv2" +
                    "&addressdetails=1" +
                    "&countrycodes=mx" +
                    "&limit=5" +
                    "&accept-language=es" +
                    "&q=" +
                    encodeURIComponent(direccion);


                const respuesta =
                    await fetch(url);


                if (!respuesta.ok) {

                    throw new Error(
                        "No se pudo realizar la búsqueda."
                    );

                }


                const resultados =
                    await respuesta.json();


                resultadosDireccion.innerHTML = "";


                // No encontró nada

                if (resultados.length === 0) {

                    resultadosDireccion.innerHTML =
                        '<p class="mensaje-direccion">❌ No encontramos esa dirección. Intenta escribir más datos.</p>';

                    return;

                }


                // Mostrar resultados

                resultados.forEach(function(resultado) {

                    const botonResultado =
                        document.createElement("button");


                    botonResultado.type =
                        "button";


                    botonResultado.className =
                        "resultado-direccion";


                    botonResultado.textContent =
                        "📍 " + resultado.display_name;


                    botonResultado.addEventListener(
                        "click",
                        function() {

                            // Poner dirección en el input

                            calleInput.value =
                                resultado.display_name;


                            // Guardar coordenadas

                            latitudCliente =
                                Number(resultado.lat);

                            longitudCliente =
                                Number(resultado.lon);


                            // No fue GPS del teléfono

                            usoUbicacionActual =
                                false;


                            // Vaciar resultados

                            resultadosDireccion.innerHTML =
                                "";


                            estadoUbicacion.textContent =
                                "✅ Dirección seleccionada";

                        }
                    );


                    resultadosDireccion.appendChild(
                        botonResultado
                    );

                });


            } catch (error) {

                console.error(error);


                resultadosDireccion.innerHTML =
                    '<p class="mensaje-direccion">❌ No pudimos buscar la dirección. Intenta nuevamente.</p>';

            } finally {

                botonBuscarDireccion.disabled =
                    false;

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


            if (
                direccionManual === "" &&
                usoUbicacionActual === false
            ) {

                alert(
                    "Escribe tu dirección o comparte tu ubicación actual."
                );

                return;

            }


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
            .getElementById("nombre-cliente")
            .value
            .trim();

    const telefono =
        document
            .getElementById("telefono-cliente")
            .value
            .trim();
    
            const soya =
           tipoSoya.value;

    const cubiertos =
        document
            .getElementById("cubiertos")
            .value;

    const metodoPago =
        metodoPagoSelect.value;

        const costoEntrega =
    obtenerCostoEntrega();

const totalFinal =
    totalCarrito + costoEntrega;

    const comentarios =
        document
            .getElementById("comentarios")
            .value
            .trim();


    let mensaje =
        "🍣 *PEDIDO ANGUILA Sushi*\n\n";


    mensaje +=
        `👤 Nombre: ${nombre}\n`;

    mensaje +=
        `📱 Teléfono: ${telefono}\n`;


    // ==================================================
    // PARA LLEVAR
    // ==================================================

    if (
        servicioSeleccionado === "llevar"
    ) {

        mensaje +=
            "🛍 Servicio: Para llevar\n";

    }


    // ==================================================
    // A DOMICILIO
    // ==================================================

    if (
        servicioSeleccionado === "domicilio"
    ) {

        mensaje +=
            "🛵 Servicio: A domicilio\n";


        // UBICACIÓN GPS

        if (
            usoUbicacionActual &&
            latitudCliente !== null &&
            longitudCliente !== null
        ) {

            mensaje +=
                `📍 Ubicación: https://www.google.com/maps?q=${latitudCliente},${longitudCliente}\n`;

        }


        // DIRECCIÓN MANUAL

        else {

            const direccionManual =
                calleInput.value.trim();

            mensaje +=
                `📍 Dirección: ${direccionManual}\n`;

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
        `🥢 Cubiertos: ${cubiertos}\n`;
        
        


    // ==================================================
    // MÉTODO DE PAGO
    // ==================================================

    mensaje +=
        `💳 Método de pago: ${metodoPago}\n`;


    // ==================================================
    // DOMICILIO + EFECTIVO
    // ==================================================

    if (
        servicioSeleccionado === "domicilio" &&
        metodoPago === "Efectivo"
    ) {

        const pagaCon =
            Number(pagaConInput.value);

        mensaje +=
    `💵 Pagará con: $${pagaCon}\n`;
}

    // ==================================================
    // COMENTARIOS
    // ==================================================

    if (comentarios !== "") {

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
    if (servicioSeleccionado === "domicilio") {

    mensaje +=
        `Envío: $${costoEntrega}\n`;

}


    // ==================================================
    // TOTAL
    // ==================================================

    mensaje +=
    `\n💰 *Total: $${totalFinal}*`;


    // ==================================================
    // WHATSAPP DEL RESTAURANTE
    // ==================================================

    const numeroWhatsApp =
        "525532727920";


    const url =
        "https://wa.me/" +
        numeroWhatsApp +
        "?text=" +
        encodeURIComponent(mensaje);


    window.open(
        url,
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

            modalResumen.style.display = "flex";

        }
    );

}


// ======================================================
// CERRAR RESUMEN DE CUENTA
// ======================================================

if (cerrarResumen) {

    cerrarResumen.addEventListener(
        "click",
        function() {

            modalResumen.style.display = "none";

        }
    );

}

// ======================================================
// CERRAR RESUMEN AL TOCAR FUERA
// ======================================================

if (modalResumen) {

    modalResumen.addEventListener("click", function(evento) {

        if (evento.target === modalResumen) {

            modalResumen.style.display = "none";

        }

    });

}
// ======================================================
// INICIAR CARRITO
// ======================================================

actualizarPedido();


// ======================================================
// ASEGURAR QUE EFECTIVO EMPIECE OCULTO
// ======================================================

actualizarDatosEfectivo();