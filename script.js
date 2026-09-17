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
// ACTUALIZAR CARRITO
// ======================================================

function actualizarPedido() {

    contador.textContent = cantidadCarrito;
    total.textContent = totalCarrito;
    totalModal.textContent = totalCarrito;
    resumenCantidad.textContent = cantidadCarrito;
    resumenTotal.textContent = totalCarrito;


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


            if (
                Number(pagaCon) < totalCarrito
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
// BOTÓN DE BÚSQUEDA DE DIRECCIÓN
// POR AHORA CONFIRMA DIRECCIÓN MANUAL
// ======================================================

if (botonBuscarDireccion) {

    botonBuscarDireccion.addEventListener(
        "click",
        function() {

            const direccion =
                calleInput.value.trim();


            if (direccion === "") {

                alert(
                    "Escribe una dirección."
                );

                return;

            }


            usoUbicacionActual = false;

            latitudCliente = null;
            longitudCliente = null;


            estadoUbicacion.textContent =
                "✅ Dirección ingresada manualmente";

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

    const cubiertos =
        document
            .getElementById("cubiertos")
            .value;

    const metodoPago =
        metodoPagoSelect.value;

    const comentarios =
        document
            .getElementById("comentarios")
            .value
            .trim();


    let mensaje =
        "🍣 *PEDIDO SUSHI ANGUILA*\n\n";


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

        const cambio =
            pagaCon - totalCarrito;


        mensaje +=
            `💵 Pagará con: $${pagaCon}\n`;


        if (cambio === 0) {

            mensaje +=
                "✅ Pago exacto\n";

        } else {

            mensaje +=
                `🔄 Cambio aproximado: $${cambio}\n`;

        }

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


    // ==================================================
    // TOTAL
    // ==================================================

    mensaje +=
        `\n💰 *Total: $${totalCarrito}*`;


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
// INICIAR CARRITO
// ======================================================

actualizarPedido();


// ======================================================
// ASEGURAR QUE EFECTIVO EMPIECE OCULTO
// ======================================================

actualizarDatosEfectivo();