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

const botonEstadoTienda =
    document.getElementById(
        "cambiar-estado-tienda"
    );

const botonPromo =
    document.getElementById(
        "cambiar-promo"
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
                "tienda_abierta, promo_2x1"
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

    if (tiendaAbiertaAdmin) {

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
    // PROMOCIÓN
    // ==================================================

    if (promo2x1Admin) {

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


        mensajeAdmin.textContent =
            "Actualizando promoción...";


        const nuevoEstado =
            !promo2x1Admin;


        const { error } =
            await supabaseClient
                .from(
                    "configuracion_tienda"
                )
                .update({

                    promo_2x1:
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
                "No tienes permiso para cambiar la promoción.";

            botonPromo.disabled =
                false;

            return;

        }


        promo2x1Admin =
            nuevoEstado;


        actualizarPanel();


        mensajeAdmin.textContent =
            nuevoEstado
                ?
                "Promoción 2x1 activada."
                :
                "Promoción 2x1 desactivada.";


        botonPromo.disabled =
            false;

    }
);


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