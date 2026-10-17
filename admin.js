// ======================================================
// ANGUILA SUSHI - PANEL ADMINISTRADOR
// ======================================================


// ======================================================
// ELEMENTOS
// ======================================================

const loginAdmin =
    document.getElementById(
        "login-admin"
    );


const panelAdmin =
    document.getElementById(
        "panel-admin"
    );


const emailAdmin =
    document.getElementById(
        "admin-email"
    );


const passwordAdmin =
    document.getElementById(
        "admin-password"
    );


const iniciarSesion =
    document.getElementById(
        "iniciar-sesion"
    );


const cerrarSesion =
    document.getElementById(
        "cerrar-sesion"
    );


const mensajeLogin =
    document.getElementById(
        "mensaje-login"
    );


const estadoTiendaAdmin =
    document.getElementById(
        "estado-tienda-admin"
    );


const estadoPromoAdmin =
    document.getElementById(
        "estado-promo-admin"
    );


const estadoPromoCharolaAdmin =
    document.getElementById(
        "estado-promo-charola-admin"
    );


const botonEstadoTienda =
    document.getElementById(
        "cambiar-estado-tienda"
    );


const botonPromo =
    document.getElementById(
        "cambiar-promo"
    );


const botonPromoCharola =
    document.getElementById(
        "cambiar-promo-charola"
    );


const mensajeAdmin =
    document.getElementById(
        "mensaje-admin"
    );


// ======================================================
// ESTADO ACTUAL
// ======================================================

let tiendaAbiertaAdmin = false;

let promo2x1Admin = false;

let promoCharolaAdmin = false;

// ======================================================
// CONFIGURACIÓN DE MÉTODOS DE PAGO
// ======================================================

let metodosPagoAdmin = null;


// ======================================================
// MOSTRAR LOGIN
// ======================================================

function mostrarLogin() {

    loginAdmin.style.display =
        "flex";


    panelAdmin.style.display =
        "none";

}


// ======================================================
// MOSTRAR PANEL
// ======================================================

function mostrarPanel() {

    loginAdmin.style.display =
        "none";


    panelAdmin.style.display =
        "block";

}


// ======================================================
// CARGAR CONFIGURACIÓN
// ======================================================

async function cargarConfiguracionAdmin() {

    mensajeAdmin.textContent =
        "Cargando configuración...";


    const { data, error } =
        await supabaseClient
            .from(
                "configuracion_tienda"
            )
            .select(
    "tienda_abierta, promo_2x1, promo_charola, metodos_pago"
)
            .eq(
                "id",
                1
            )
            .single();


    if (error) {

        console.error(
            error
        );


        mensajeAdmin.textContent =
            "No se pudo cargar la configuración.";


        return;

    }


    tiendaAbiertaAdmin =
        data.tienda_abierta;


    promo2x1Admin =
        data.promo_2x1;


    promoCharolaAdmin =
        data.promo_charola;

    metodosPagoAdmin =
    data.metodos_pago;


    actualizarPanel();


    mensajeAdmin.textContent =
        "";

}


// ======================================================
// ACTUALIZAR INTERFAZ
// ======================================================

function actualizarPanel() {


    // ==================================================
    // TIENDA
    // ==================================================

    if (
        tiendaAbiertaAdmin
    ) {

        estadoTiendaAdmin.textContent =
            "🟢 ABIERTA";


        estadoTiendaAdmin.className =
            "estado-admin activo";


        botonEstadoTienda.textContent =
            "Cerrar tienda";


        botonEstadoTienda.className =
            "boton-control boton-rojo";

    } else {

        estadoTiendaAdmin.textContent =
            "🔴 CERRADA";


        estadoTiendaAdmin.className =
            "estado-admin inactivo";


        botonEstadoTienda.textContent =
            "Abrir tienda";


        botonEstadoTienda.className =
            "boton-control boton-verde";

    }


    // ==================================================
    // PROMOCIÓN 2X1
    // ==================================================

    if (
        promo2x1Admin
    ) {

        estadoPromoAdmin.textContent =
            "🔥 ACTIVA";


        estadoPromoAdmin.className =
            "estado-admin activo";


        botonPromo.textContent =
            "Desactivar 2x1";


        botonPromo.className =
            "boton-control boton-rojo";

    } else {

        estadoPromoAdmin.textContent =
            "⚫ DESACTIVADA";


        estadoPromoAdmin.className =
            "estado-admin inactivo";


        botonPromo.textContent =
            "Activar 2x1";


        botonPromo.className =
            "boton-control boton-verde";

    }


    // ==================================================
    // PROMOCIÓN CHAROLA
    // ==================================================

    if (
        promoCharolaAdmin
    ) {

        estadoPromoCharolaAdmin.textContent =
            "🍱 ACTIVA";


        estadoPromoCharolaAdmin.className =
            "estado-admin activo";


        botonPromoCharola.textContent =
            "Desactivar promo charola";


        botonPromoCharola.className =
            "boton-control boton-rojo";

    } else {

        estadoPromoCharolaAdmin.textContent =
            "⚫ DESACTIVADA";


        estadoPromoCharolaAdmin.className =
            "estado-admin inactivo";


        botonPromoCharola.textContent =
            "Activar promo charola";


        botonPromoCharola.className =
            "boton-control boton-verde";

    }

}


// ======================================================
// INICIAR SESIÓN
// ======================================================

iniciarSesion.addEventListener(
    "click",
    async function() {

        const email =
            emailAdmin.value.trim();


        const password =
            passwordAdmin.value;


        if (
            email === "" ||
            password === ""
        ) {

            mensajeLogin.textContent =
                "Escribe tu correo y contraseña.";


            return;

        }


        mensajeLogin.textContent =
            "Iniciando sesión...";


        const { data, error } =
            await supabaseClient
                .auth
                .signInWithPassword({

                    email:
                        email,

                    password:
                        password

                });


        if (error) {

            console.error(
                error
            );


            mensajeLogin.textContent =
                "Correo o contraseña incorrectos.";


            return;

        }


        if (
            !data.session
        ) {

            mensajeLogin.textContent =
                "No se pudo iniciar sesión.";


            return;

        }


        mensajeLogin.textContent =
            "";


        mostrarPanel();


        await cargarConfiguracionAdmin();

    }
);


// ======================================================
// CERRAR SESIÓN
// ======================================================

cerrarSesion.addEventListener(
    "click",
    async function() {

        await supabaseClient
            .auth
            .signOut();


        emailAdmin.value =
            "";


        passwordAdmin.value =
            "";


        mostrarLogin();

    }
);


// ======================================================
// ABRIR / CERRAR TIENDA
// ======================================================

botonEstadoTienda.addEventListener(
    "click",
    async function() {

        botonEstadoTienda.disabled =
            true;


        mensajeAdmin.textContent =
            "Actualizando tienda...";


        const nuevoEstado =
            !tiendaAbiertaAdmin;


        const { error } =
            await supabaseClient
                .from(
                    "configuracion_tienda"
                )
                .update({

                    tienda_abierta:
                        nuevoEstado,

                    actualizado_en:
                        new Date()
                            .toISOString()

                })
                .eq(
                    "id",
                    1
                );


        if (error) {

            console.error(
                error
            );


            mensajeAdmin.textContent =
                "No tienes permiso para cambiar la tienda.";


            botonEstadoTienda.disabled =
                false;


            return;

        }


        tiendaAbiertaAdmin =
            nuevoEstado;


        actualizarPanel();


        mensajeAdmin.textContent =
            nuevoEstado
                ?
                "La tienda fue abierta correctamente."
                :
                "La tienda fue cerrada correctamente.";


        botonEstadoTienda.disabled =
            false;

    }
);


// ======================================================
// ACTIVAR / DESACTIVAR 2X1
// ======================================================

botonPromo.addEventListener(
    "click",
    async function() {

        botonPromo.disabled =
            true;


        botonPromoCharola.disabled =
            true;


        mensajeAdmin.textContent =
            "Actualizando promoción 2x1...";


        const nuevoEstado =
            !promo2x1Admin;


        const datosActualizar = {

            promo_2x1:
                nuevoEstado,

            actualizado_en:
                new Date()
                    .toISOString()

        };


        // Si activamos 2x1,
        // apagamos charola automáticamente

        if (
            nuevoEstado
        ) {

            datosActualizar.promo_charola =
                false;

        }


        const { error } =
            await supabaseClient
                .from(
                    "configuracion_tienda"
                )
                .update(
                    datosActualizar
                )
                .eq(
                    "id",
                    1
                );


        if (error) {

            console.error(
                error
            );


            mensajeAdmin.textContent =
                "No tienes permiso para cambiar la promoción.";


            botonPromo.disabled =
                false;


            botonPromoCharola.disabled =
                false;


            return;

        }


        promo2x1Admin =
            nuevoEstado;


        if (
            nuevoEstado
        ) {

            promoCharolaAdmin =
                false;

        }


        actualizarPanel();


        mensajeAdmin.textContent =
            nuevoEstado
                ?
                "Promoción 2x1 activada."
                :
                "Promoción 2x1 desactivada.";


        botonPromo.disabled =
            false;


        botonPromoCharola.disabled =
            false;

    }
);


// ======================================================
// ACTIVAR / DESACTIVAR PROMOCIÓN CHAROLA
// ======================================================

botonPromoCharola.addEventListener(
    "click",
    async function() {

        botonPromoCharola.disabled =
            true;


        botonPromo.disabled =
            true;


        mensajeAdmin.textContent =
            "Actualizando promoción de charola...";


        const nuevoEstado =
            !promoCharolaAdmin;


        const datosActualizar = {

            promo_charola:
                nuevoEstado,

            actualizado_en:
                new Date()
                    .toISOString()

        };


        // Si activamos promo charola,
        // apagamos 2x1 automáticamente

        if (
            nuevoEstado
        ) {

            datosActualizar.promo_2x1 =
                false;

        }


        const { error } =
            await supabaseClient
                .from(
                    "configuracion_tienda"
                )
                .update(
                    datosActualizar
                )
                .eq(
                    "id",
                    1
                );


        if (error) {

            console.error(
                error
            );


            mensajeAdmin.textContent =
                "No se pudo cambiar la promoción de charola.";


            botonPromoCharola.disabled =
                false;


            botonPromo.disabled =
                false;


            return;

        }


        promoCharolaAdmin =
            nuevoEstado;


        if (
            nuevoEstado
        ) {

            promo2x1Admin =
                false;

        }


        actualizarPanel();


        mensajeAdmin.textContent =
            nuevoEstado
                ?
                "Promoción de charola activada."
                :
                "Promoción de charola desactivada.";


        botonPromoCharola.disabled =
            false;


        botonPromo.disabled =
            false;

    }
);


/* ======================================================
   ANGUILA SUSHI - ADMINISTRAR MÉTODOS DE PAGO
   ====================================================== */

// ELEMENTOS DE LA VENTANA

const abrirModalPagos =
    document.getElementById("abrir-modal-pagos");

const modalMetodosPago =
    document.getElementById("modal-metodos-pago");

const cerrarModalPagos =
    document.getElementById("cerrar-modal-pagos");

const cancelarModalPagos =
    document.getElementById("cancelar-modal-pagos");

const guardarMetodosPago =
    document.getElementById("guardar-metodos-pago");

const mensajeMetodosPago =
    document.getElementById("mensaje-metodos-pago");


// ======================================================
// MÉTODOS DISPONIBLES
// ======================================================

const controlesMetodosPago = [

    {
        id: "pago-llevar-efectivo",
        servicio: "llevar",
        metodo: "efectivo"
    },

    {
        id: "pago-llevar-transferencia",
        servicio: "llevar",
        metodo: "transferencia"
    },

    {
        id: "pago-llevar-tarjeta",
        servicio: "llevar",
        metodo: "tarjeta"
    },

    {
        id: "pago-domicilio-efectivo",
        servicio: "domicilio",
        metodo: "efectivo"
    },

    {
        id: "pago-domicilio-transferencia",
        servicio: "domicilio",
        metodo: "transferencia"
    }

];


// ======================================================
// MOSTRAR VALORES GUARDADOS
// ======================================================

function mostrarMetodosPagoGuardados() {

    controlesMetodosPago.forEach(opcion => {

        const checkbox =
            document.getElementById(opcion.id);

        if (!checkbox) {
            return;
        }

        checkbox.checked =
            metodosPagoAdmin?.[opcion.servicio]?.[opcion.metodo]
            ?? true;

    });

}


// ======================================================
// ABRIR VENTANA
// ======================================================

abrirModalPagos.addEventListener("click", function() {

    if (!metodosPagoAdmin) {

        mensajeAdmin.textContent =
            "Primero debe cargarse la configuración.";

        return;
    }

    mostrarMetodosPagoGuardados();

    mensajeMetodosPago.textContent = "";

    modalMetodosPago.showModal();

});


// ======================================================
// CERRAR VENTANA
// ======================================================

cerrarModalPagos.addEventListener("click", function() {

    modalMetodosPago.close();

});


cancelarModalPagos.addEventListener("click", function() {

    modalMetodosPago.close();

});


// CERRAR AL TOCAR FUERA DE LA VENTANA

modalMetodosPago.addEventListener("click", function(evento) {

    if (evento.target === modalMetodosPago) {

        modalMetodosPago.close();

    }

});


// ======================================================
// GUARDAR MÉTODOS DE PAGO
// ======================================================

guardarMetodosPago.addEventListener("click", async function() {

    const estaMarcado = id => {

        return document.getElementById(id).checked;

    };


    const nuevosMetodos = {

        llevar: {

            efectivo:
                estaMarcado("pago-llevar-efectivo"),

            transferencia:
                estaMarcado("pago-llevar-transferencia"),

            tarjeta:
                estaMarcado("pago-llevar-tarjeta")

        },

        domicilio: {

            efectivo:
                estaMarcado("pago-domicilio-efectivo"),

            transferencia:
                estaMarcado("pago-domicilio-transferencia")

        }

    };


    // COMPROBAR QUE QUEDE AL MENOS UN MÉTODO
    // DISPONIBLE PARA CADA TIPO DE SERVICIO

    const llevarDisponible =
        Object.values(nuevosMetodos.llevar).some(Boolean);

    const domicilioDisponible =
        Object.values(nuevosMetodos.domicilio).some(Boolean);


    if (!llevarDisponible || !domicilioDisponible) {

        mensajeMetodosPago.textContent =
            "Debe quedar al menos un método activo " +
            "para cada tipo de servicio.";

        return;

    }


    // EVITAR GUARDAR DOS VECES

    guardarMetodosPago.disabled = true;

    mensajeMetodosPago.textContent =
        "Guardando cambios...";


    const { error } = await supabaseClient

        .from("configuracion_tienda")

        .update({

            metodos_pago: nuevosMetodos,

            actualizado_en:
                new Date().toISOString()

        })

        .eq("id", 1);


    if (error) {

        console.error(error);

        mensajeMetodosPago.textContent =
            "Error al guardar los métodos de pago.";

        guardarMetodosPago.disabled = false;

        return;

    }


    // ACTUALIZAR ESTADO LOCAL

    metodosPagoAdmin = nuevosMetodos;


    mensajeAdmin.textContent =
        "Métodos de pago actualizados correctamente.";


    guardarMetodosPago.disabled = false;


    // CERRAR VENTANA

    modalMetodosPago.close();

});




// ======================================================
// COMPROBAR SESIÓN AL ABRIR ADMIN.HTML
// ======================================================

async function comprobarSesion() {

    const { data } =
        await supabaseClient
            .auth
            .getSession();


    if (
        data.session
    ) {

        mostrarPanel();


        await cargarConfiguracionAdmin();

    } else {

        mostrarLogin();

    }

}


// ======================================================
// INICIAR
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        comprobarSesion();

    }
);