// ======================================================
// ANGUILA SUSHI - SCRIPT PRINCIPAL
// PARTE 1 DE 3
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
// CHAROLA
// ======================================================

let charolaSeleccionada = false;

const MIN_ROLLOS_CHAROLA = 6;

const MAX_ROLLOS_CHAROLA = 10;

// ======================================================
// PROMOCIÓN 2X1 EN ROLLOS
// TEMPORALMENTE ACTIVA
// DESPUÉS LA CONTROLARÁ EL ADMIN
// ======================================================

let promo2x1Activa = true;

let promoCharolaActiva = false;

let tiendaAbierta = true;

// ======================================================
// CONFIGURACIÓN DE LA TIENDA DESDE SUPABASE
// ======================================================

async function cargarConfiguracionTienda() {

    const { data, error } =
        await supabaseClient
            .from("configuracion_tienda")
            .select(
    "tienda_abierta, promo_2x1, promo_charola"
)
            .eq("id", 1)
            .single();


    if (error) {

        console.error(
            "Error al cargar configuración:",
            error
        );

        return;
    }

    // ======================================================
// CONFIGURACIÓN EN TIEMPO REAL
// ======================================================

let canalConfiguracionTienda = null;


function escucharConfiguracionEnTiempoReal() {

    if (canalConfiguracionTienda) {
        return;
    }


    canalConfiguracionTienda =
        supabaseClient
            .channel(
                "configuracion-tienda-realtime"
            )
            .on(
                "postgres_changes",

                {
                    event: "UPDATE",
                    schema: "public",
                    table: "configuracion_tienda",
                    filter: "id=eq.1"
                },

                function(payload) {

                    console.log(
                        "Cambio recibido en tiempo real:",
                        payload.new
                    );


                    // Volvemos a cargar el estado
                    // para actualizar toda la página
                    cargarConfiguracionTienda();

                }
            )
            .subscribe(
                function(status) {

                    console.log(
                        "Realtime tienda:",
                        status
                    );

                }
            );

}


    // ======================================================
// MOSTRAR / OCULTAR BANNER 2X1
// ======================================================

function actualizarBannerPromo() {

    const bannerPromo =
        document.getElementById(
            "banner-promo-2x1"
        );


    if (!bannerPromo) {
        return;
    }


    if (promo2x1Activa) {

        bannerPromo.style.display =
            "flex";

    } else {

        bannerPromo.style.display =
            "none";

    }

}

    // ==================================================
    // GUARDAR ESTADO REAL
    // ==================================================

    tiendaAbierta =
        data.tienda_abierta;

    promo2x1Activa =
        data.promo_2x1;
    
    promoCharolaActiva =
    data.promo_charola;

      actualizarBannerPromo();
      actualizarPopupPromo();

    console.log(
        "Tienda abierta:",
        tiendaAbierta
    );

    console.log(
        "2x1 activo:",
        promo2x1Activa
    );
    console.log(
    "Promo charola activa:",
    promoCharolaActiva
);


    // ==================================================
    // ACTUALIZAR ESTADO VISUAL
    // ==================================================

    const estadoTienda =
        document.getElementById(
            "estado-tienda"
        );

    const textoEstado =
        document.getElementById(
            "texto-estado"
        );


    if (
        estadoTienda &&
        textoEstado
    ) {

        if (tiendaAbierta) {

            estadoTienda.classList.remove(
                "cerrado"
            );

            estadoTienda.classList.add(
                "abierto"
            );

            textoEstado.textContent =
                "Abierto";

        } else {

            estadoTienda.classList.remove(
                "abierto"
            );

            estadoTienda.classList.add(
                "cerrado"
            );

            textoEstado.textContent =
                "Cerrado";

        }

    }


    

    // ==================================================
    // RECALCULAR CARRITO / PROMOCIÓN
    // ==================================================

    actualizarPedido();

}



// ======================================================
// CONFIGURACIÓN EN TIEMPO REAL
// ======================================================

let canalConfiguracionTienda = null;


function escucharConfiguracionEnTiempoReal() {

    // Evitar crear el canal más de una vez
    if (canalConfiguracionTienda) {
        return;
    }


    canalConfiguracionTienda =
        supabaseClient
            .channel(
                "configuracion-tienda-realtime"
            )
            .on(
                "postgres_changes",

                {
                    event: "UPDATE",
                    schema: "public",
                    table: "configuracion_tienda",
                    filter: "id=eq.1"
                },

                function(payload) {

                    console.log(
                        "🔄 Cambio recibido:",
                        payload.new
                    );


                    // Actualizar la página
                    // sin necesidad de recargar
                    cargarConfiguracionTienda();

                }
            )
            .subscribe(
                function(status) {

                    console.log(
                        "📡 Realtime tienda:",
                        status
                    );

                }
            );

}

// ======================================================
// MODAL PERSONALIZADO - TIENDA CERRADA
// ======================================================

function mostrarModalTiendaCerrada() {

    const modal =
        document.getElementById(
            "modal-tienda-cerrada"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "oculto"
    );

    document.body.style.overflow =
        "hidden";

}


function cerrarModalTiendaCerrada() {

    const modal =
        document.getElementById(
            "modal-tienda-cerrada"
        );

    if (!modal) {
        return;
    }

    modal.classList.add(
        "oculto"
    );

    document.body.style.overflow =
        "";

}


// ======================================================
// BLOQUEAR PEDIDOS SI LA TIENDA ESTÁ CERRADA
// ======================================================

document.addEventListener(
    "click",
    function(evento) {

        if (tiendaAbierta) {
            return;
        }


        const botonBloqueado =
            evento.target.closest(
                `
                .agregar,
                .agregar-producto-fijo,
                .abrir-opciones,
                .abrir-opciones-dinamico,
                .sumar,
                .servicio-btn,
                #confirmar-opcion-producto
                `
            );


        if (!botonBloqueado) {
            return;
        }


        evento.preventDefault();

        evento.stopPropagation();

        evento.stopImmediatePropagation();


       mostrarModalTiendaCerrada();

    },
    true
);

// ======================================================
// PRODUCTO CON OPCIONES - ESTADO ACTUAL
// ======================================================

let productoOpcionesActual = null;

let opcionProductoActual = null;


// ======================================================
// ELEMENTOS DEL CARRITO
// ======================================================

const botonesAgregar =
    document.querySelectorAll(
        ".agregar"
    );


const contador =
    document.getElementById(
        "cantidad-carrito"
    );


const total =
    document.getElementById(
        "total-carrito"
    );


const detallePedido =
    document.getElementById(
        "detalle-pedido"
    );


const totalModal =
    document.getElementById(
        "total-modal"
    );


const botonVerPedido =
    document.querySelector(
        ".ver-pedido"
    );


const modalPedido =
    document.getElementById(
        "modal-pedido"
    );


const cerrarPedido =
    document.getElementById(
        "cerrar-pedido"
    );


// ======================================================
// RESUMEN DE CUENTA
// ======================================================

const resumenCantidad =
    document.getElementById(
        "resumen-cantidad"
    );


const resumenTotal =
    document.getElementById(
        "resumen-total"
    );


const abrirResumen =
    document.getElementById(
        "abrir-resumen"
    );


const modalResumen =
    document.getElementById(
        "modal-resumen"
    );


const cerrarResumen =
    document.getElementById(
        "cerrar-resumen"
    );


const productosResumen =
    document.getElementById(
        "productos-resumen"
    );


const cantidadResumenDetalle =
    document.getElementById(
        "cantidad-resumen-detalle"
    );


const subtotalResumen =
    document.getElementById(
        "subtotal-resumen"
    );


const entregaResumen =
    document.getElementById(
        "entrega-resumen"
    );


const totalCuentaResumen =
    document.getElementById(
        "total-cuenta-resumen"
    );


// ======================================================
// MODAL DE OPCIONES DE PRODUCTO
// ======================================================

const botonesAbrirOpciones =
    document.querySelectorAll(
        ".abrir-opciones"
    );


const modalOpcionesProducto =
    document.getElementById(
        "modal-opciones-producto"
    );


const cerrarOpcionesProducto =
    document.getElementById(
        "cerrar-opciones-producto"
    );


const tituloOpcionesProducto =
    document.getElementById(
        "titulo-opciones-producto"
    );


const descripcionOpcionesProducto =
    document.getElementById(
        "descripcion-opciones-producto"
    );


const precioOpcionesProducto =
    document.getElementById(
        "precio-opciones-producto"
    );


const listaOpcionesProducto =
    document.getElementById(
        "lista-opciones-producto"
    );


const confirmarOpcionProducto =
    document.getElementById(
        "confirmar-opcion-producto"
    );


const comentarioOpcionesProducto =
    document.getElementById(
        "comentario-opciones-producto"
    );


const imagenOpcionesProducto =
    document.getElementById(
        "imagen-opciones-producto"
    );


// ======================================================
// PRODUCTOS CON OPCIONES
// ======================================================

const productosConOpciones = {


    // ==================================================
    // AVOCADO MAKY
    // ==================================================

    "Avocado Maky": {

        descripcion:
            "Rollo envuelto en aguacate.",

        imagen: "",

        opciones: [

            {
                nombre: "Vegetariano",
                precio: 119
            },

            {
                nombre: "Cangrejo",
                precio: 131
            },

            {
                nombre: "Salmón",
                precio: 131
            },

            {
                nombre: "Salmón ahumado",
                precio: 139
            },

            {
                nombre: "Tampico",
                precio: 128
            },

            {
                nombre: "Camarón",
                precio: 131
            },

            {
                nombre: "Pulpo",
                precio: 147
            },

            {
                nombre: "Anguila",
                precio: 143
            }

        ]

    },


    // ==================================================
    // NEVADO MAKY
    // ==================================================

    "Nevado Maky": {

        descripcion:
            "Rollo envuelto en queso.",

        imagen: "",

        opciones: [

            {
                nombre: "Vegetariano",
                precio: 119
            },

            {
                nombre: "Cangrejo",
                precio: 131
            },

            {
                nombre: "Salmón",
                precio: 131
            },

            {
                nombre: "Salmón ahumado",
                precio: 139
            },

            {
                nombre: "Camarón",
                precio: 131
            },

            {
                nombre: "Pulpo",
                precio: 147
            },

            {
                nombre: "Anguila",
                precio: 143
            }

        ]

    },


    // ==================================================
    // ARCOÍRIS ROLL
    // ==================================================

    "Arcoíris Roll": {

        descripcion:
            "Queso, aguacate, pepino y masago.",

        imagen: "",

        opciones: [

            {
                nombre: "Camarón",
                precio: 142
            },

            {
                nombre: "Cangrejo",
                precio: 142
            },

            {
                nombre: "Anguila",
                precio: 146
            },

            {
                nombre: "Salmón",
                precio: 142
            },

            {
                nombre: "Salmón ahumado",
                precio: 142
            }

        ]

    },


    // ==================================================
    // KIURY MAKY
    // ==================================================

    "Kiury Maky": {

        descripcion:
            "Rollo envuelto en hoja de pepino.",

        imagen: "",

        opciones: [

            {
                nombre: "Vegetariano",
                precio: 99
            },

            {
                nombre: "Cangrejo",
                precio: 114
            },

            {
                nombre: "Salmón",
                precio: 114
            },

            {
                nombre: "Salmón ahumado",
                precio: 138
            },

            {
                nombre: "Tampico",
                precio: 110
            },

            {
                nombre: "Camarón",
                precio: 114
            },

            {
                nombre: "Pulpo",
                precio: 144
            },

            {
                nombre: "Anguila",
                precio: 140
            }

        ]

    },


    // ==================================================
    // CALIFORNIA MAKY
    // ==================================================

    "California Maky": {

        descripcion:
            "Rollo de arroz con ajonjolí, aguacate, pepino y queso Philadelphia.",

        imagen: "",

        opciones: [

            {
                nombre: "Vegetariano",
                precio: 99
            },

            {
                nombre: "Especial",
                precio: 117
            },

            {
                nombre: "Camarón",
                precio: 119
            },

            {
                nombre: "Salmón",
                precio: 119
            },

            {
                nombre: "Salmón ahumado",
                precio: 129
            },

            {
                nombre: "Cangrejo",
                precio: 119
            },

            {
                nombre: "Anguila",
                precio: 135
            }

        ]

    }

};


// ======================================================
// ESPECIALIDADES DE LA BARRA
// ======================================================

const especialidadesBarra = [

    {
        nombre: "Kakiague Maky",
        precio: 135,
        descripcion:
            "XF: Verduras capeadas y salsa dulce. XD: Aguacate, cangrejo y Q. Philadelphia."
    },

    {
        nombre: "Pynta Maky",
        precio: 135,
        descripcion:
            "XF: Q. Philadelphia y tampico. XD: Camarón empanizado y aguacate."
    },

    {
        nombre: "Nevado Maky Especial",
        precio: 141,
        descripcion:
            "XF: Queso y salsa de tamarindo. XD: Cangrejo empanizado y aguacate."
    },

    {
        nombre: "Eby Maky",
        precio: 144,
        descripcion:
            "XF: Camarón. XD: Aguacate, pepino y Q. Philadelphia."
    },

    {
        nombre: "Tampico Maky Especial",
        precio: 147,
        descripcion:
            "XF: Masago y tampico. XD: Tampico y cangrejo."
    },

    {
        nombre: "Strawberry",
        precio: 141,
        descripcion:
            "XF: Q. Philadelphia, fresa y salsa dulce. XD: Camarón empanizado."
    },

    {
        nombre: "Manchego Fry Especial",
        precio: 141,
        descripcion:
            "XF: Q. manchego, chiles toreados y salsa chipotle. XD: Cangrejo empanizado, aguacate y cebollín."
    },

    {
        nombre: "Spyder Roll",
        precio: 147,
        descripcion:
            "XF: Masago, salsa de anguila. XD: Camarón tempura, aguacate y Q. Philadelphia."
    },

    {
        nombre: "Banana Roll",
        precio: 141,
        descripcion:
            "XF: Plátano frito y salsa de chipotle. XD: Q. Philadelphia, aguacate y camarón empanizado."
    },

    {
        nombre: "Frutal Sushi",
        precio: 141,
        descripcion:
            "XF: Q. Philadelphia, mango, fresa, kiwi y salsa dulce. XD: Camarón empanizado."
    },

    {
        nombre:
            "Mango Extreme (solo por temporada)",

        precio:
            149,

        descripcion:
            "XF: Q. Philadelphia, mango, salsa de tamarindo. XD: Camarón empanizado."
    },

    {
        nombre: "Meshi Roll",
        precio: 147,
        descripcion:
            "XF: Alga marina y salsa de anguila. XD: Camarón capeado, Q. Philadelphia y aguacate."
    },

    {
        nombre: "Hawaiano Roll",
        precio: 144,
        descripcion:
            "XF: Q. Philadelphia, piña y salsa dulce. XD: Salmón ahumado y aguacate."
    },

    {
        nombre: "Sake Maky",
        precio: 144,
        descripcion:
            "XF: Salmón fresco. XD: Aguacate, pepino y Q. Philadelphia."
    },

    {
        nombre: "Kany Maky",
        precio: 142,
        descripcion:
            "XF: Cangrejo fresco. XD: Aguacate, pepino y Q. Philadelphia."
    },

    {
        nombre: "Tako Maky",
        precio: 180,
        descripcion:
            "XF: Pulpo y salsa de anguila. XD: Q. Philadelphia, aguacate y pepino."
    },

    {
        nombre: "Kamikaze",
        precio: 147,
        descripcion:
            "XF: Tampico. XD: Q. Philadelphia, aguacate, kakiague, chiles toreados y cangrejo empanizado."
    },

    {
        nombre: "Flamin Roll",
        precio: 141,
        descripcion:
            "XF: Philadelphia, chetos flamin hot y salsa spicy. XD: Pollo a la plancha y aguacate."
    },

    {
        nombre: "Bonsay",
        precio: 135,
        descripcion:
            "XF: Lechuga fresca, tampico y masago. XD: Q. Philadelphia, aguacate, cangrejo y piel de salmón."
    },

    {
        nombre: "Sapporo",
        precio: 141,
        descripcion:
            "XF: Cebolla frita y chipotle. XD: Camarón preparado, Q. Philadelphia y aguacate."
    },

    {
        nombre: "Shary Maky",
        precio: 147,
        descripcion:
            "XF: Q. Philadelphia y piel de salmón. XD: Pepino, aguacate y salmón ahumado."
    },

    {
        nombre: "Samuray",
        precio: 149,
        descripcion:
            "XF: Q. Philadelphia, furikake y salsa de anguila. XD: Aguacate, pepino y anguila."
    },

    {
        nombre: "Unagui Sushi Especial",
        precio: 160,
        descripcion:
            "XF: Q. Philadelphia, kakiague y salsa de anguila. XD: Anguila y aguacate."
    },

    {
        nombre: "Carrussel Maky",
        precio: 155,
        descripcion:
            "XF: Q. Philadelphia, aguacate, cangrejo y salmón. XD: Q. Philadelphia, aguacate y pepino."
    },

    {
        nombre: "Baby Roll",
        precio: 160,
        descripcion:
            "XF: Pasta baby y salsa de anguila. XD: Anguila, aguacate, pepino y Q. Philadelphia."
    },

    {
    nombre: "Hot Spicy",
    precio: 160,
    descripcion:
        "XF: Salmón a la plancha, Q. Philadelphia y salsa dragón. XD: Camarón tempura, aguacate y kakiague.",
    imagen: "img/Spicy.jpg"
},

    {
        nombre: "Anguilla Sushi",
        precio: 160,
        descripcion:
            "XF: Anguila y salsa dulce. XD: Aguacate, pepino y Q. Philadelphia."
    },

    {
        nombre: "Sanje Roll",
        precio: 149,
        descripcion:
            "XF: Plátano frito, chiles tempura y salsa chipotle. XD: Q. Philadelphia, kakiague, aguacate y camarón empanizado."
    },

    {
        nombre: "Hade Roll",
        precio: 155,
        descripcion:
            "XF: Mango, aguacate, nuez caramelizada y salsa dulce. XD: Q. Philadelphia, camarón empanizado y aguacate."
    },

    {
        nombre: "Aguachile Maky",
        precio: 170,
        descripcion:
            "XF: Aguachile eby. XD: Pepino, zanahoria y aguacate."
    },

    {
        nombre: "Maguro Maky",
        precio: 147,
        descripcion:
            "XF: Atún fresco, aguacate y masago. XD: Pepino y Q. Philadelphia."
    },

    {
        nombre: "Gyo Roll",
        precio: 149,
        descripcion:
            "XF: Filete de res a la plancha. XD: Mango, aguacate y kushiague de queso."
    },

    {
        nombre: "Ibiza",
        precio: 132,
        descripcion:
            "XF: Pepino y alga. XD: Mango, zanahoria, aguacate y Q. Philadelphia."
    },

    {
        nombre: "Tokio Roll",
        precio: 170,
        descripcion:
            "XF: Anguila, salmón ahumado, aguacate y salsa dulce. XD: Aguacate, kakiague y Q. Philadelphia."
    },

    {
        nombre: "Miyazaki",
        precio: 120,
        descripcion:
            "XF: Ajonjolí. XD: Cangrejo empanizado, cebollín, chipotle, aguacate y Q. Philadelphia."
    },

    {
        nombre: "Spel Maky",
        precio: 132,
        descripcion:
            "XF: Queso, espinaca y salsa chipotle. XD: Salmón ahumado, zanahoria, aguacate y cebollín."
    },

    {
        nombre: "Ninja",
        precio: 141,
        descripcion:
            "XF: Hoja de pepino, tampico, tropiezos de camarón empanizado y salsa de anguila. XD: Philadelphia, aguacate y kanikama."
    },

    {
        nombre: "Bacon Roll",
        precio: 155,
        descripcion:
            "XF: Tocino frito, Philadelphia, salsa BBQ y cebollín. XD: Pollo a la plancha y aguacate."
    }

];


// ======================================================
// ROLLOS EMPANIZADOS
// ======================================================

const rollosEmpanizados = [

    {
        nombre: "Suzuki Roll",
        precio: 155,
        descripcion:
            "XF: Pescado, tampico y pasta de champiñón. XD: Q. Philadelphia y aguacate."
    },

    {
        nombre: "Manchego Maky",
        precio: 150,
        descripcion:
            "XF: Q. Manchego. XD: Cangrejo, Q. Philadelphia y aguacate."
    },

    {
        nombre: "Beef Maky",
        precio: 155,
        descripcion:
            "XF: Filete de res y salsa chipotle. XD: Q. Manchego y aguacate."
    },

    {
        nombre: "Tory Maky Especial",
        precio: 160,
        descripcion:
            "XF: Pollo empanizado. XD: Q. Manchego, aguacate, espárrago y chiles toreados."
    },

    {
        nombre: "Queso Maky Fry",
        precio: 165,
        descripcion:
            "XF: Q. Philadelphia y tampico. XD: Camarón empanizado y aguacate."
    },

    {
        nombre: "Gelsha Maky",
        precio: 160,
        descripcion:
            "XF: Camarón y salsa chipotle. XD: Aguacate y Q. Philadelphia."
    },

    {
        nombre: "Sake Maky Especial",
        precio: 170,
        descripcion:
            "XF: Salmón y salsa shirasha. XD: Q. Philadelphia y aguacate."
    },

    {
        nombre: "Cheese Hot",
        precio: 170,
        descripcion:
            "XF: Q. Manchego gratinado y chiles toreados. XD: Cangrejo empanizado, Q. Philadelphia, aguacate y espárrago."
    },

    {
        nombre: "Ostión Maky",
        precio: 170,
        descripcion:
            "XF: Salsa Rockefeller. XD: Ostión, aguacate, Q. Manchego, espárrago y chiles toreados."
    },

    {
        nombre: "Dragón Roll",
        precio: 170,
        descripcion:
            "XF: Empanizado, camarones salteados a la mantequilla, queso gratinado, salsa dragón y cebollín. XD: Arrachera y aguacate."
    },

    {
        nombre: "Dali Roll",
        precio: 150,
        descripcion:
            "XF: Empanizado, un toque de salsa spicy y cebollín. XD: Arrachera, aguacate y Q. Philadelphia."
    },

    {
        nombre: "Crunchy Roll",
        precio: 150,
        descripcion:
            "XF: Tocino empanizado y salsa spicy. XD: Kakiague y aguacate."
    }

];

// ======================================================
// ROLLOS CAPEADOS
// ======================================================

const rollosCapeados = [

    {
        nombre: "Tempura Maky",
        precio: 155,
        descripcion:
            "XF: Capeado y tampico. XD: Aguacate y camarón tempura."
    },

    {
        nombre: "Tempura Maky Fry",
        precio: 155,
        descripcion:
            "XF: Q. Philadelphia, chiles, tampico y salsa de anguila. XD: Tampico y kakiague."
    }

];


// ======================================================
// SUSHI BALLS
// ======================================================

const sushiBalls = [

    {
        nombre: "Saturno",
        precio: 130,
        descripcion:
            "Empanizado, relleno de Q. Philadelphia, aguacate, salmón y salsa chipotle."
    },

    {
        nombre: "Cosmo",
        precio: 130,
        descripcion:
            "Empanizado, relleno de Q. Philadelphia, aguacate, camarón y salsa chipotle."
    },

    {
        nombre: "Polo",
        precio: 120,
        descripcion:
            "Empanizado, relleno de Philadelphia, aguacate y pollo con salsa kushiague."
    },

    {
        nombre: "Alpha",
        precio: 120,
        descripcion:
            "Empanizado, relleno de Philadelphia, aguacate, carne de res y salsa kushiague."
    }

];



// ======================================================
// MENÚ COMPLETO DE COMIDA
// FUENTE: BASE FINAL DEL MENÚ DE ANGUILA SUSHI
// BEBIDAS NO INCLUIDAS POR AHORA
// ======================================================

// ------------------------------------------------------
// OPCIONES ADICIONALES / PRODUCTOS CON VARIANTES
// ------------------------------------------------------

Object.assign(
    productosConOpciones,
    {

        "California Maky": {
            descripcion:
                "Rollo de arroz con un toque de ajonjolí, aguacate, pepino y queso Philadelphia. La versión especial lleva masago.",
            imagen: "",
            esRollo: true,
            opciones: [
                { nombre: "Vegetariano · Normal", precio: 99 },
                { nombre: "Vegetariano · Especial", precio: 117 },
                { nombre: "Camarón · Normal", precio: 119 },
                { nombre: "Camarón · Especial", precio: 137 },
                { nombre: "Salmón ahumado · Normal", precio: 129 },
                { nombre: "Salmón ahumado · Especial", precio: 140 },
                { nombre: "Cangrejo · Normal", precio: 119 },
                { nombre: "Cangrejo · Especial", precio: 137 },
                { nombre: "Salmón · Normal", precio: 119 },
                { nombre: "Salmón · Especial", precio: 137 },
                { nombre: "Anguila · Normal", precio: 135 },
                { nombre: "Anguila · Especial", precio: 150 }
            ]
        },

        "Gyoza (4 pz)": {
            descripcion:
                "Ravioles orientales, rellenos de vegetales y proteína al gusto.",
            imagen: "",
            esRollo: false,
            opciones: [
                { nombre: "Cerdo", precio: 108 },
                { nombre: "Camarón", precio: 117 }
            ]
        },

        


        "Ramen Fussion": {
            descripcion:
                "Ramen bowl con calabaza, zanahoria, champiñón, cebollín, naruto, huevo y un toque de shichimi y ajonjolí.",
            imagen: "",
            esRollo: false,
            opciones: [
                { nombre: "Vegetariano", precio: 99 },
                { nombre: "Cerdo 120g", precio: 139 },
                { nombre: "Pollo 120g", precio: 139 },
                { nombre: "Res 120g", precio: 159 },
                { nombre: "Camarón 5 pz", precio: 165 },
                { nombre: "Salmón 120g", precio: 165 },
                { nombre: "Gyoza 5 pz", precio: 159 }
            ]
        },

        "Yasai": {
            descripcion:
                "Jitomate, lechugas mixtas, aguacate, zanahoria, betabel, espárragos, champiñón, chícharo japonés y pepino.",
            imagen: "",
            esRollo: false,
            opciones: [
                { nombre: "Variedad de verduras", precio: 88 },
                { nombre: "Con salmón fresco", precio: 124 },
                { nombre: "Con cangrejo fresco", precio: 124 },
                { nombre: "Con pollo en salsa yakitori", precio: 109 }
            ]
        },

        "Yakimeshi": {
            descripcion:
                "Arroz frito con verduras: cebolla, calabaza y zanahoria.",
            imagen: "",
            esRollo: false,
            opciones: [
                { nombre: "Verduras", precio: 74 },
                { nombre: "Pollo", precio: 94 },
                { nombre: "Pulpo y Ajo", precio: 127 },
                { nombre: "Salmón", precio: 110 },
                { nombre: "Mixto", precio: 110 },
                { nombre: "Tampico", precio: 99 },
                { nombre: "Res", precio: 105 },
                { nombre: "Camarón", precio: 110 },
                { nombre: "Arrachera", precio: 110 },
                
            ]
        },

        "Gohan": {
            descripcion:
                "Arroz blanco al vapor.",
            imagen: "",
            esRollo: false,
            opciones: [
                { nombre: "Blanco", precio: 52 },
                { nombre: "Tampico", precio: 74 },
                { nombre: "Furikake", precio: 79 }
            ]
        },

        "Tempuras": {
            descripcion:
                "Verduras capeadas con la opción de proteína.",
            imagen: "",
            esRollo: false,
            opciones: [
                { nombre: "Verduras", precio: 95 },
                { nombre: "Pollo", precio: 104 },
                { nombre: "Camarón", precio: 134 },
                { nombre: "Mixto (pollo, camarón y robalo)", precio: 134 },
                { nombre: "Robalo", precio: 140 }
            ]
        },

        "Teppan Yaki": {
            descripcion:
                "Base de verduras sazonadas a la plancha. Proteína a elegir: 150g. Mixto Especial: 200g.",
            imagen: "",
            esRollo: false,
            opciones: [
                { nombre: "Verduras", precio: 169 },
                { nombre: "Pollo", precio: 197 },
                { nombre: "Arrachera", precio: 204 },
                { nombre: "Filete de Res", precio: 204 },
                { nombre: "Camarón", precio: 210 },
                { nombre: "Salmón", precio: 215 },
                { nombre: "Mixto Normal", precio: 215 },
                { nombre: "Mixto Especial", precio: 225 }
            ]
        },

        "Teri Yaki": {
            descripcion:
                "Carnes, mariscos o pescado en salsa agridulce con arroz gohan y ensalada. Proteína a elegir: 150g.",
            imagen: "",
            esRollo: false,
            opciones: [
                { nombre: "Pollo", precio: 164 },
                { nombre: "Filete de Res", precio: 180 },
                { nombre: "Camarón", precio: 187 },
                { nombre: "Salmón", precio: 196 },
                { nombre: "Mixto (camarón, pollo y res)", precio: 196 }
            ]
        },

        "Yakisoba": {
            descripcion:
                "Tallarines japoneses y verduras orientales en salsa agridulce. Proteína a elegir: 150g.",
            imagen: "",
            esRollo: false,
            opciones: [
                { nombre: "Pollo", precio: 197 },
                { nombre: "Filete de Res", precio: 204 },
                { nombre: "Mixto (camarón, pollo y res)", precio: 215 },
                { nombre: "Camarón", precio: 210 }
            ]
        },

"Sashimi corte fino": {

    descripcion:
        "Cortes frescos de pescado de 90 g. Elige tu proteína.",

    imagen: "",
    esRollo: false,

    opciones: [
        { nombre: "Atún", precio: 113 },
        { nombre: "Pulpo", precio: 123 },
        { nombre: "Salmón", precio: 113 },
        { nombre: "Robalo", precio: 113 },
        {
            nombre: "Mixto (salmón, pulpo y robalo)",
            precio: 123
        }
    ]

},

"Sashimi corte grueso": {

    descripcion:
        "Cortes frescos de pescado de 120 g. Elige tu proteína.",

    imagen: "",
    esRollo: false,

    opciones: [
        { nombre: "Atún", precio: 139 },
        { nombre: "Pulpo", precio: 153 },
        { nombre: "Salmón", precio: 139 },
        { nombre: "Robalo", precio: 139 },
        {
            nombre: "Mixto (salmón, pulpo y robalo)",
            precio: 153
        }
    ]

},

       
"Temaki de alga": {

    descripcion:
        "Cono de hoja de alga con queso Philadelphia, aguacate y proteína a elegir.",

    imagen: "",
    esRollo: false,

    opciones: [
        { nombre: "Vegetariano", precio: 68 },
        { nombre: "Camarón", precio: 80 },
        { nombre: "Cangrejo", precio: 80 },
        { nombre: "Salmón", precio: 84 },
        { nombre: "Salmón ahumado", precio: 90 },
        { nombre: "Tampico especial", precio: 99 },
        { nombre: "Anguila", precio: 104 }
    ]

},

"Temaki de pepino": {

    descripcion:
        "Cono envuelto en pepino con queso Philadelphia, aguacate y proteína a elegir.",

    imagen: "",
    esRollo: false,

    opciones: [
        { nombre: "Vegetariano", precio: 63 },
        { nombre: "Camarón", precio: 75 },
        { nombre: "Cangrejo", precio: 75 },
        { nombre: "Salmón", precio: 79 },
        { nombre: "Salmón ahumado", precio: 85 },
        { nombre: "Tampico especial", precio: 95 },
        { nombre: "Anguila", precio: 99 }
    ]

},


        "Batera": {
            descripcion:
                "Arroz, queso, masago, aguacate y proteína a elegir.",
            imagen: "",
            esRollo: false,
            opciones: [
                { nombre: "Salmón", precio: 159 },
                { nombre: "Camarón", precio: 161 },
                { nombre: "Cangrejo", precio: 161 },
                { nombre: "Anguila", precio: 168 },
                { nombre: "Mixto (salmón, cangrejo y camarón)", precio: 170 },
                
            ]
        },

        "Niguiri's": {
            descripcion:
                "Sushi por pieza.",
            imagen: "",
            esRollo: false,
            opciones: [
                { nombre: "Camarón", precio: 41 },
                { nombre: "Robalo", precio: 44 },
                { nombre: "Pulpo", precio: 49 },
                { nombre: "Masago", precio: 57 },
                { nombre: "Cangrejo", precio: 47 },
                { nombre: "Anguila", precio: 63 },
                { nombre: "Atún", precio: 49 },
                { nombre: "Salmón ahumado", precio: 52 },
                { nombre: "Salmón", precio: 49 }
            ]
        },

        "Meshi Roll": {
            descripcion:
                "XF: Hoja de alga y aderezo a elección. XD: Camarón capeado, Q. Philadelphia y aguacate.",
            imagen: "",
            esRollo: true,
            opciones: [
                { nombre: "Aderezo Tampico", precio: 147 },
                { nombre: "Salsa de anguila", precio: 147 },
                { nombre: "Ambos aderezos", precio: 162 }
            ]
        }
    }
);

// ======================================================
// MENÚ INFANTIL - FORMULARIO DE 3 ELECCIONES
// ======================================================


let seleccionesMenuInfantil = {

    principal: "",
    acompanamiento: "",
    complemento: "",
    rollo: ""

};


productosConOpciones[
    "Menú Infantil - Arma tu paquete"
] = {

    descripcion:
        "Incluye 1 juguito y 1 dulce sorpresa.",

    imagen: "",

    esRollo: false,

    esMenuInfantil: true,

    precioFijo: 179,
    grupos: [

        {
            clave: "principal",

            titulo:
                "Elige tu platillo principal",

            opciones: [

                "Pescado empanizado (3 láminas)",

                "Pollo teriyaki (75gr)",

                "Medio rollo clásico"

            ]
        },

        
{
    clave: "rollo",

    titulo: "¿Qué rollo clásico prefieres?",

    opciones: [
        "California",
        "Avocado",
        "Nevado"
    ]
},



        {
            clave: "acompanamiento",

            titulo:
                "Acompaña con",

            opciones: [

                "Yakimeshi de verduras (½ porción)",

                "Gohan blanco (½ porción)",

                "Gyozas (3 pz)"

            ]
        },


        {
            clave: "complemento",

            titulo:
                "Complementa con",

            opciones: [

                "Kushiague de queso (2 pz)",

                "Papas a la francesa (120gr)",

                "Kushiague de plátano (2 pz)"

            ]
        }

    ]

};





// ------------------------------------------------------
// ENTRADAS
// ------------------------------------------------------

productosConOpciones["Edamames (80g)"] = {

    descripcion:
        "Frijol de soya tierno. Elige tu preparación.",

    imagen: "",

    esRollo: false,

    opciones: [
        { nombre: "Al vapor", precio: 75 },
        { nombre: "Asados", precio: 75 }
    ]

};


const entradasMenu = [

   
{
    nombre: "Edamames (80g)",
    conOpciones: true,
    precioDesde: 75,
    descripcion:
        "Frijol de soya tierno. Disponible al vapor o asado.",
    imagen: "",
    icono: "🫛",
    esRollo: false
},


    {
        nombre: "Squid Rings",
        precio: 81,
        descripcion:
            "Aros de calamar en pasta tempura, con pimiento morrón, cebolla y un toque de pimienta limón y salsa dragón.",
        icono: "🦑"
    },

    {
        nombre: "Tacos de Rib Eye (150g)",
        precio: 135,
        descripcion:
            "Tacos orientales de Rib Eye a la plancha con salsa de ajonjolí, chipotle y cebollín.",
        icono: "🌮"
    },

    {
        nombre: "Camarones Rokka",
        precio: 139,
        descripcion:
            "100g de camarones crujientes, bañados en salsa de chipotle sobre una fresca ensalada.",
        icono: "🍤"
    },

    {
        nombre: "Gyoza (4 pz)",
        conOpciones: true,
        precioDesde: 108,
        descripcion:
            "Ravioles orientales, rellenos de vegetales y proteína al gusto.",
        icono: "🥟"
    }

];


// ------------------------------------------------------
// BROCHETAS
// ------------------------------------------------------


const kushiaguesMenu = [

    {
        nombre: "Kushiague de plátano",
        precioPieza: 25,
        precioOrden: 60
    },

    {
        nombre: "Kushiague de queso manchego",
        precioPieza: 37,
        precioOrden: 98
    },

    {
        nombre: "Kushiague de plátano con queso",
        precioPieza: 37,
        precioOrden: 98
    },

    {
        nombre: "Kushiague de camarón con queso",
        precioPieza: 49,
        precioOrden: 129
    },

    {
        nombre: "Kushiague de salmón con queso",
        precioPieza: 49,
        precioOrden: 129
    },

    {
        nombre: "Kushiague de cangrejo con queso",
        precioPieza: 49,
        precioOrden: 129
    },

    {
        nombre: "Kushiague de pollo",
        precioPieza: 45,
        precioOrden: 125
    },

    {
        nombre: "Kushiague de queso Philadelphia",
        precioPieza: 39,
        precioOrden: 110
    }

].map(function(producto) {

    return {

        ...producto,

        conOpciones: true,

        precioDesde: producto.precioPieza,

        descripcion:
            "Brocheta empanizada. Disponible por pieza u orden de 3 piezas.",

        imagen: "",

        icono: "🍢",

        esRollo: false

    };

});


// ======================================================
// REGISTRAR OPCIONES DE CADA KUSHIAGUE
// ======================================================

kushiaguesMenu.forEach(function(producto) {

    productosConOpciones[producto.nombre] = {

        descripcion: producto.descripcion,

        imagen: "",

        esRollo: false,

        opciones: [

            {
                nombre: "1 pieza",
                precio: producto.precioPieza
            },

            {
                nombre: "Orden de 3 piezas",
                precio: producto.precioOrden
            }

        ]

    };

});



const yakitorisMenu = [

    {
        nombre: "Yakitori de pollo",
        precioPieza: 44,
        precioOrden: 117
    },

    {
        nombre: "Yakitori de res",
        precioPieza: 45,
        precioOrden: 120
    },

    {
        nombre: "Yakitori de arrachera",
        precioPieza: 45,
        precioOrden: 120
    },

    {
        nombre: "Yakitori de camarón",
        precioPieza: 55,
        precioOrden: 145
    },

    {
        nombre: "Yakitori de salmón",
        precioPieza: 55,
        precioOrden: 145
    },

    {
        nombre: "Yakitori mixto (pollo, camarón y res)",
        precioOrden: 147
    }

].map(function(producto) {

    const tienePieza =
        typeof producto.precioPieza === "number";

    return {

        ...producto,

        conOpciones: true,

        precioDesde: tienePieza
            ? producto.precioPieza
            : producto.precioOrden,

        precioTexto: tienePieza
            ? ""
            : `Orden (3 pzs) $${producto.precioOrden}`,

        descripcion:
            "Brocheta sazonada a la plancha con salsa agridulce, cebolla y pimientos.",

        imagen: "",

        icono: "🍢",

        esRollo: false

    };

});


// ======================================================
// REGISTRAR OPCIONES DE CADA YAKITORI
// ======================================================

yakitorisMenu.forEach(function(producto) {

    const opciones = [];

    if (typeof producto.precioPieza === "number") {

        opciones.push({
            nombre: "1 pieza",
            precio: producto.precioPieza
        });

    }

    opciones.push({
        nombre: "Orden de 3 piezas",
        precio: producto.precioOrden
    });

    productosConOpciones[producto.nombre] = {

        descripcion: producto.descripcion,

        imagen: "",

        esRollo: false,

        opciones: opciones

    };

});



// ------------------------------------------------------
// SOPAS & NOODLES
// ------------------------------------------------------

const sopasMenu = [

    {
        nombre: "Udon Especial",
        precio: 127,
        descripcion:
            "Caldo base de soya, tallarines udon, 2 pz de camarones, huevo, champiñones, espinaca, cebolla, cebollín y naruto.",
        icono: "🍜"
    },

    {
        nombre: "Misoshiro",
        precio: 79,
        descripcion:
            "Caldo miso, tofu, alga y cebollín.",
        icono: "🍲"
    },

    {
        nombre: "Ramen",
        precio: 99,
        descripcion:
            "Caldo de soya, pollo, espinaca, champiñón y pasta ramen.",
        icono: "🍜"
    },

    {
        nombre: "Sumashi",
        precio: 104,
        descripcion:
            "Caldo de soya, camarón, pulpo, robalo, fideo harusame y alga.",
        icono: "🍲"
    },

    {
        nombre: "Tempura Udón",
        precio: 104,
        descripcion:
            "Caldo tempura, pasta udón, camarones y verduras capeadas.",
        icono: "🍜"
    },

    {
        nombre: "Miso Especial",
        precio: 124,
        descripcion:
            "Camarón, salmón, fideo harusame, pulpo, espinaca y champiñones.",
        icono: "🍲"
    },

    {
        nombre: "Tori Spicy",
        precio: 139,
        descripcion:
            "120 gr de pollo a la plancha, chicoria, hongo shiitake, zanahoria, fideo harusame y un toque de salsa dragón.",
        icono: "🌶️"
    },

    {
        nombre: "Shiitake Udon",
        precio: 169,
        descripcion:
            "120 gr de salmón a la plancha, caldo miso, hongo shiitake, chicoria, zanahoria y pasta oriental udón.",
        icono: "🍜"
    }

];


const ramenFussionMenu = [

    {
        nombre: "Ramen Fussion",
        conOpciones: true,
        precioDesde: 99,
        descripcion:
            "Ramen bowl con calabaza, zanahoria, champiñón, cebollín, naruto, huevo y un toque de shichimi y ajonjolí.",
        icono: "🍜"
    }

];


// ------------------------------------------------------
// ENSALADAS
// ------------------------------------------------------

const ensaladasMenu = [

    {
        nombre: "Yasai",
        conOpciones: true,
        precioDesde: 88,
        descripcion:
            "Variedad de verduras con distintas opciones de proteína.",
        icono: "🥗"
    },

    {
        nombre: "Sunomono",
        precio: 94,
        descripcion:
            "Pepino, harusame, camarón, cangrejo, pulpo, ajonjolí y vinagre dulce.",
        icono: "🥗"
    },

    {
        nombre: "Primavera",
        precio: 118,
        descripcion:
            "Melón, pepino, cangrejo, lluvia de primavera con vinagre dulce.",
        icono: "🥗"
    },

    {
        nombre: "Yakusa Tropical",
        precio: 118,
        descripcion:
            "Lechugas mixtas, pepino, fruta de temporada, zanahoria, espinacas, camarones glaseados con teriyaki y salsa dulce.",
        icono: "🥗"
    },

    {
        nombre: "Ensalada Mixta",
        precio: 129,
        descripcion:
            "Variedad de verduras, camarón, salmón y cangrejo frescos.",
        icono: "🥗"
    },

    {
        nombre: "Yasai Fry",
        precio: 139,
        descripcion:
            "Lechugas mixtas, zanahoria, aguacate, jitomate, pepino, espárrago, pollo, camarón y cangrejo empanizado.",
        icono: "🥗"
    }

];


// ------------------------------------------------------
// ARROCES
// ------------------------------------------------------


const yakimeshiMenu = [

    {
        nombre: "Yakimeshi",
        conOpciones: true,
        precioDesde: 74,
        descripcion:
            "Arroz frito con verduras: cebolla, calabaza y zanahoria. Elige tu proteína.",
        icono: "🍚",
        esRollo: false
    },

    {
        nombre: "Yakimeshi Especial",
        precio: 135,
        descripcion:
            "Presentación especial de yakimeshi.",
        imagen: "",
        icono: "🍚",
        esRollo: false
    }

];



const gohanMenu = [

    {
        nombre: "Gohan",
        conOpciones: true,
        precioDesde: 52,
        descripcion:
            "Arroz blanco al vapor.",
        icono: "🍚"
    }

];


// ------------------------------------------------------
// COCINA JAPONESA
// ------------------------------------------------------

const tempurasMenu = [

    {
        nombre: "Tempuras",
        conOpciones: true,
        precioDesde: 95,
        descripcion:
            "Verduras capeadas con opción de proteína.",
        icono: "🍤"
    }

];


const teppanMenu = [

    {
        nombre: "Teppan Yaki",
        conOpciones: true,
        precioDesde: 169,
        descripcion:
            "Base de verduras sazonadas a la plancha. Proteína a elegir.",
        icono: "🍳"
    }

];


const teriMenu = [

    {
        nombre: "Teri Yaki",
        conOpciones: true,
        precioDesde: 164,
        descripcion:
            "Carnes, mariscos o pescado en salsa agridulce con arroz gohan y ensalada.",
        icono: "🍱"
    }

];


const yakisobaMenu = [

    {
        nombre: "Yakisoba",
        conOpciones: true,
        precioDesde: 197,
        descripcion:
            "Tallarines japoneses y verduras orientales en salsa agridulce.",
        icono: "🍝"
    }

];


const cocinaEspecialidadesMenu = [

    {
        nombre: "Tori Fry",
        precio: 164,
        descripcion:
            "Tiras de pollo empanizado con ensalada mixta y arroz al vapor.",
        icono: "🍗"
    },

    {
        nombre: "Tori Katsu",
        precio: 196,
        descripcion:
            "Pechuga empanizada rellena de verduras sazonadas, queso manchego gratinado, ensalada y arroz blanco.",
        icono: "🍗"
    },

    {
        nombre: "Sakana Fry",
        precio: 189,
        descripcion:
            "Tiras de robalo empanizado con ensalada mixta y arroz al vapor.",
        icono: "🐟"
    },

    {
        nombre: "Tori Katsu Especial",
        precio: 209,
        descripcion:
            "Pechuga empanizada rellena de queso Philadelphia y verduras sazonadas, ensalada de cangrejo, tampico, aguacate y queso Philadelphia.",
        icono: "🍗"
    },

    {
        nombre: "Yaki-Udón",
        precio: 209,
        descripcion:
            "Verduras salteadas con pasta udón y salsa yakitori.",
        icono: "🍜"
    },

    {
        nombre: "KatsuDon",
        precio: 145,
        descripcion:
            "80g de lomo de cerdo empanizado, cebollín, champiñón, espinaca y clara de huevo, fondeados sobre una cama de arroz al vapor.",
        icono: "🍚"
    },

    {
        nombre: "Eby Cheese",
        precio: 219,
        descripcion:
            "6 brochetas de camarón empanizadas con ensalada y arroz.",
        icono: "🍤"
    },

    {
        nombre: "Sake Fry",
        precio: 225,
        descripcion:
            "Salmón relleno de verduras selectas, queso crema y espinaca. Guarnición de verduras con tallarines orientales y arroz al vapor.",
        icono: "🐟"
    },

    {
        nombre: "Chicken Katsuo",
        precio: 219,
        descripcion:
            "Pechuga de pollo salteada, marinada con jugo de limón, rellena de queso manchego y camarones a la mantequilla, guarnición de arroz al vapor, zanahoria y espárrago balsámico con salsa pantaï.",
        icono: "🍗"
    }

];


// ------------------------------------------------------
// SUSHI
// ------------------------------------------------------


const sashimisMenu = [

    {
        nombre: "Sashimi corte fino",
        conOpciones: true,
        precioDesde: 113,
        descripcion:
            "Cortes frescos de pescado de 90 g. Elige tu proteína.",
        imagen: "",
        icono: "🐟",
        esRollo: false
    },

    {
        nombre: "Sashimi corte grueso",
        conOpciones: true,
        precioDesde: 139,
        descripcion:
            "Cortes frescos de pescado de 120 g. Elige tu proteína.",
        imagen: "",
        icono: "🐟",
        esRollo: false
    }

];




const temakisAlgaMenu = [

    {
        nombre: "Temaki de alga",
        conOpciones: true,
        precioDesde: 68,
        descripcion:
            "Cono de alga con queso Philadelphia, aguacate y proteína a elegir.",
        icono: "🍣",
        esRollo: false
    }

];


const temakisPepinoMenu = [

    {
        nombre: "Temaki de pepino",
        conOpciones: true,
        precioDesde: 63,
        descripcion:
            "Cono envuelto en pepino con queso Philadelphia, aguacate y proteína a elegir.",
        icono: "🥒",
        esRollo: false
    }

];



const bateraMenu = [

    {
        nombre: "Batera",
        conOpciones: true,
        precioDesde: 159,
        descripcion:
            "Arroz, queso, masago, aguacate y proteína a elegir.",
        icono: "🍰"
    }

];


const niguirisMenu = [

    {
        nombre: "Niguiri's",
        conOpciones: true,
        precioDesde: 41,
        descripcion:
            "Sushi por pieza. Elige tu variedad.",
        icono: "🍣",
        esRollo: false
    },

    {
        nombre: "Niguiri Sushi (10 piezas)",
        precio: 298,
        descripcion:
            "Orden de 10 piezas de sushi.",
        imagen: "",
        icono: "🍣",
        esRollo: false
    }

];



// ------------------------------------------------------
// ESPECIALIDADES DE LA BARRA - DATOS FINALES
// ------------------------------------------------------

especialidadesBarra.splice(
    0,
    especialidadesBarra.length,

    {
        nombre: "Kakiague Maky",
        precio: 135,
        descripcion:
            "XF: Verduras capeadas y salsa dulce. XD: Aguacate, cangrejo y Q. Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Pynta Maky",
        precio: 135,
        descripcion:
            "XF: Q. Philadelphia y tampico. XD: Camarón empanizado y aguacate.",
        esRollo: true
    },

    {
        nombre: "Nevado Maky Especial",
        precio: 141,
        descripcion:
            "XF: Queso y salsa de tamarindo. XD: Cangrejo empanizado y aguacate.",
        esRollo: true
    },

    {
        nombre: "Eby Maky",
        precio: 144,
        descripcion:
            "XF: Camarón fresco. XD: Aguacate, pepino y Q. Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Tampico Maky Especial",
        precio: 147,
        descripcion:
            "XF: Masago y tampico. XD: Tampico y cangrejo.",
        esRollo: true
    },

    {
        nombre: "Strawberry",
        precio: 141,
        descripcion:
            "XF: Q. Philadelphia, fresa y salsa dulce. XD: Camarón empanizado.",
        esRollo: true
    },

    {
        nombre: "Manchego Fry Especial",
        precio: 141,
        descripcion:
            "XF: Q. manchego, chiles toreados y salsa chipotle. XD: Cangrejo empanizado, aguacate y cebollín.",
        esRollo: true
    },

    {
        nombre: "Spyder Roll",
        precio: 147,
        descripcion:
            "XF: Masago, salsa de anguila. XD: Camarón tempura, aguacate y Q. Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Banana Roll",
        precio: 141,
        descripcion:
            "XF: Plátano frito y salsa de chipotle. XD: Q. Philadelphia, aguacate y camarón tempura.",
        esRollo: true
    },

    {
        nombre: "Frutal Sushi",
        precio: 141,
        descripcion:
            "XF: Q. Philadelphia, mango, fresa, kiwi y salsa dulce. XD: Camarón empanizado.",
        esRollo: true
    },

    {
        nombre: "Mango Extreme - solo por temporada",
        precio: 149,
        descripcion:
            "XF: Q. Philadelphia, mango, salsa de tamarindo. XD: Camarón empanizado.",
        esRollo: true
    },

    {
        nombre: "Meshi Roll",
        precio: 147,
        precioDesde: 147,
        conOpciones: true,
        descripcion:
            "XF: Hoja de alga y aderezo a elección. XD: Camarón capeado, Q. Philadelphia y aguacate.",
        esRollo: true
    },

    {
        nombre: "Hawaiano Roll",
        precio: 144,
        descripcion:
            "XF: Q. Philadelphia, piña y salsa dulce. XD: Salmón ahumado y aguacate.",
        esRollo: true
    },

    {
        nombre: "Sake Maky",
        precio: 144,
        descripcion:
            "XF: Salmón fresco. XD: Aguacate, pepino y Q. Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Kany Maky",
        precio: 142,
        descripcion:
            "XF: Cangrejo fresco. XD: Aguacate, pepino y Q. Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Tako Maky",
        precio: 180,
        descripcion:
            "XF: Pulpo y salsa de anguila. XD: Q. Philadelphia, aguacate y pepino.",
        esRollo: true
    },

    {
        nombre: "Kamikaze",
        precio: 147,
        descripcion:
            "XF: Tampico. XD: Q. Philadelphia, aguacate, kakiague, chiles toreados y cangrejo empanizado.",
        esRollo: true
    },

    {
        nombre: "Flamin Roll",
        precio: 141,
        descripcion:
            "XF: Philadelphia, Cheetos Flamin Hot y salsa spicy. XD: Pollo a la plancha y aguacate.",
        esRollo: true
    },

    {
        nombre: "Bonsay",
        precio: 135,
        descripcion:
            "XF: Lechuga fresca, tampico y masago. XD: Q. Philadelphia, aguacate, cangrejo y piel de salmón.",
        esRollo: true
    },

    {
        nombre: "Sapporo",
        precio: 141,
        descripcion:
            "XF: Cebolla frita y chipotle. XD: Camarón tempura, Q. Philadelphia y aguacate.",
        esRollo: true
    },

    {
        nombre: "Sharyy Maky",
        precio: 147,
        descripcion:
            "XF: Q. Philadelphia y piel de salmón. XD: Pepino, aguacate y salmón ahumado.",
        esRollo: true
    },

    {
        nombre: "Samuray",
        precio: 149,
        descripcion:
            "XF: Q. Philadelphia, furikake y salsa de anguila. XD: Aguacate, pepino y anguila.",
        esRollo: true
    },

    {
        nombre: "Unagui Sushi Especial",
        precio: 160,
        descripcion:
            "XF: Q. Philadelphia, kakiague y salsa de anguila. XD: Anguila y aguacate.",
        esRollo: true
    },

    {
        nombre: "Carrussel Maky",
        precio: 155,
        descripcion:
            "XF: Q. Philadelphia, aguacate, cangrejo y salmón. XD: Q. Philadelphia, aguacate y pepino.",
        esRollo: true
    },

    {
        nombre: "Baby Roll",
        precio: 160,
        descripcion:
            "XF: Pasta baby y salsa de anguila. XD: Anguila, aguacate, pepino y Q. Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Hot Spicy",
        precio: 160,
        descripcion:
            "XF: Salmón a la plancha, Q. Philadelphia y salsa dragón. XD: Camarón tempura, aguacate y kakiague.",
        imagen: "img/Spicy.jpg",
        esRollo: true
    },

    {
        nombre: "Anguila Sushi",
        precio: 160,
        descripcion:
            "XF: Anguila y salsa dulce. XD: Aguacate, pepino y Q. Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Sanje Roll",
        precio: 149,
        descripcion:
            "XF: Plátano frito, chiles tempura y salsa chipotle. XD: Q. Philadelphia, kakiague, aguacate y camarón empanizado.",
        esRollo: true
    },

    {
        nombre: "Hade Roll",
        precio: 155,
        descripcion:
            "XF: Mango, aguacate, nuez caramelizada y salsa dulce. XD: Q. Philadelphia, camarón empanizado y aguacate.",
        esRollo: true
    },

    {
        nombre: "Aguachile Maky",
        precio: 170,
        descripcion:
            "XF: Aguachile eby. XD: Pepino, zanahoria y aguacate.",
        esRollo: true
    },

    {
        nombre: "Maguro Maky",
        precio: 147,
        descripcion:
            "XF: Atún fresco, aguacate y masago. XD: Pepino y Q. Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Gyo Roll",
        precio: 149,
        descripcion:
            "XF: Filete de res a la plancha. XD: Mango, aguacate y kushiague de queso.",
        esRollo: true
    },

    {
        nombre: "Ibiza",
        precio: 132,
        descripcion:
            "XF: Pepino y alga. XD: Mango, zanahoria, aguacate y Q. Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Tokio Roll",
        precio: 170,
        descripcion:
            "XF: Anguila, salmón ahumado, aguacate y salsa dulce. XD: Aguacate, kakiague y Q. Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Miyazaki",
        precio: 120,
        descripcion:
            "XF: Ajonjolí. XD: Cangrejo empanizado, cebollín, chipotle, aguacate y Q. Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Spei Maky",
        precio: 132,
        descripcion:
            "XF: Queso, espinaca y salsa chipotle. XD: Salmón ahumado, zanahoria, aguacate y cebollín.",
        esRollo: true
    },

    {
        nombre: "Ninja",
        precio: 141,
        descripcion:
            "XF: Hoja de pepino, láminas de camarón empanizado, tampico y salsa de anguila. XD: Queso Philadelphia, aguacate y cangrejo.",
        esRollo: true
    },

    {
        nombre: "Bacon Roll",
        precio: 155,
        descripcion:
            "XF: Tocino frito, Philadelphia, salsa BBQ y cebollín. XD: Pollo a la plancha y aguacate.",
        esRollo: true
    }
);


// ------------------------------------------------------
// ROLLOS EMPANIZADOS
// ------------------------------------------------------

rollosEmpanizados.splice(
    0,
    rollosEmpanizados.length,

    {
        nombre: "Suzuki Roll",
        precio: 155,
        descripcion:
            "XF: Pescado, tampico y pasta de champiñón. XD: Q. Philadelphia y aguacate.",
        esRollo: true
    },

    {
        nombre: "Manchego Maky",
        precio: 150,
        descripcion:
            "XF: Q. Manchego. XD: Cangrejo, Q. Philadelphia y aguacate.",
        esRollo: true
    },

    {
        nombre: "Beef Maky",
        precio: 155,
        descripcion:
            "XF: Filete de res y salsa chipotle. XD: Q. Manchego y aguacate.",
        esRollo: true
    },

    {
        nombre: "Tory Maky Especial",
        precio: 160,
        descripcion:
            "XF: Pollo empanizado. XD: Q. Manchego, aguacate, espárrago y chiles toreados.",
        esRollo: true
    },

    {
        nombre: "Queso Maky Fry",
        precio: 165,
        descripcion:
            "XF: Q. Philadelphia y tampico. XD: Camarón empanizado y aguacate.",
        esRollo: true
    },

    {
        nombre: "Geisha Maky",
        precio: 160,
        descripcion:
            "XF: Camarón y salsa chipotle. XD: Aguacate y Q. Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Sake Maky Especial",
        precio: 170,
        descripcion:
            "XF: Salmón y salsa shirasha. XD: Q. Philadelphia y aguacate.",
        esRollo: true
    },

    {
        nombre: "Cheese Hot",
        precio: 170,
        descripcion:
            "XF: Q. Manchego gratinado y chiles toreados. XD: Cangrejo empanizado, Q. Philadelphia, aguacate y espárrago.",
        esRollo: true
    },

    {
        nombre: "Ostión Maky",
        precio: 170,
        descripcion:
            "XF: Salsa Rockefeller. XD: Ostión, aguacate, Q. Manchego, espárrago y chiles toreados.",
        esRollo: true
    },

    {
        nombre: "Dragón Roll",
        precio: 170,
        descripcion:
            "XF: Empanizado, camarones salteados a la mantequilla, queso gratinado, salsa dragón y cebollín. XD: Arrachera y aguacate.",
        esRollo: true
    },

    {
        nombre: "Dalí Roll",
        precio: 150,
        descripcion:
            "XF: Empanizado y un toque de salsa spicy. XD: Arrachera, aguacate y queso Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Crunchy Roll",
        precio: 150,
        descripcion:
            "XF: Tocino empanizado y salsa spicy. XD: Kakiague y aguacate.",
        esRollo: true
    }
);


// ------------------------------------------------------
// ROLLOS CAPEADOS
// ------------------------------------------------------

rollosCapeados.splice(
    0,
    rollosCapeados.length,

    {
        nombre: "Tempura Maky",
        precio: 155,
        descripcion:
            "XF: Capeado y tampico. XD: Aguacate y camarón tempura.",
        esRollo: true
    },

    {
        nombre: "Tempura Maky Fry",
        precio: 155,
        descripcion:
            "XF: Queso Philadelphia, chiles, tampico y salsa de anguila. XD: Aguacate y kakiague.",
        esRollo: true
    }
);


// ------------------------------------------------------
// SUSHI BALLS
// ------------------------------------------------------

sushiBalls.splice(
    0,
    sushiBalls.length,

    {
        nombre: "Saturno",
        precio: 130,
        descripcion:
            "XF: Empanizado, salsa chipotle. XD: Salmón fresco, queso Philadelphia y aguacate.",
        esRollo: false
    },

    {
        nombre: "Cosmo",
        precio: 130,
        descripcion:
            "XF: Empanizado, salsa chipotle. XD: Camarón fresco, queso Philadelphia y aguacate.",
        esRollo: false
    },

    {
        nombre: "Polo",
        precio: 120,
        descripcion:
            "XF: Empanizado, salsa kushiague. XD: Pollo a la plancha, queso Philadelphia y aguacate.",
        esRollo: false
    },

    {
        nombre: "Alpha",
        precio: 120,
        descripcion:
            "XF: Empanizado, salsa kushiague. XD: Carne de res a la plancha, queso Philadelphia y aguacate.",
        esRollo: false
    }
);


// ------------------------------------------------------
// POSTRES
// ------------------------------------------------------

const postresMenu = [

    {
        nombre: "Caffé Jelly",
        precio: 80,
        descripcion:
            "Gelatina de café con helado de vainilla y crema de kahlúa.",
        icono: "🍮"
    },

    {
        nombre: "Yorokobi",
        precio: 80,
        descripcion:
            "Flor de helado con pétalos de plátano empanizado.",
        icono: "🍨"
    },

    {
        nombre: "Banana Maky",
        precio: 85,
        descripcion:
            "Rollo de arroz, plátano frito, queso y mermelada, cajeta o chocolate.",
        icono: "🍌"
    },

    {
        nombre: "Tempura Helado",
        precio: 87,
        descripcion:
            "Pan capeado, relleno de helado de vainilla con mermelada, cajeta o chocolate.",
        icono: "🍨"
    }

];


// ------------------------------------------------------
// ORDEN EXTRA
// ------------------------------------------------------

const ordenExtraMenu = [

    {
        nombre: "Salsa chipotle (2oz)",
        precio: 39,
        descripcion: "Orden extra.",
        icono: "🌶️"
    },

    {
        nombre: "Hojuelas de ajo frito",
        precio: 30,
        descripcion: "Orden extra.",
        icono: "🧄"
    },

    {
        nombre: "Salsa de ajonjolí (2oz)",
        precio: 39,
        descripcion: "Orden extra.",
        icono: "🥣"
    },

    {
        nombre: "Queso Philadelphia (2oz)",
        precio: 35,
        descripcion: "Orden extra.",
        icono: "🧀"
    },

    {
        nombre: "Masago (1oz)",
        precio: 46,
        descripcion: "Orden extra.",
        icono: "🍣"
    },

    {
        nombre: "Salsa de anguila (2oz)",
        precio: 46,
        descripcion: "Orden extra.",
        icono: "🥣"
    },

    {
        nombre: "Tampico",
        precio: 45,
        descripcion: "Orden extra de Tampico (4oz).",
        imagen: "img/tampico.png",
        icono: "🍣"
    }

];


// ------------------------------------------------------
// MENÚ INFANTIL
// ------------------------------------------------------

const infantilMenu = [

    {
        nombre: "Menú Infantil - Arma tu paquete",
        conOpciones: true,
        precioDesde: 179,
        precioTexto: "$179",
        descripcion:
            "Incluye 1 juguito y 1 dulce sorpresa. Elige platillo principal, acompañamiento y complemento.",
        icono: "🧒"
    }

];


// ------------------------------------------------------
// SESSION 5
// ------------------------------------------------------

const session5CocinaMenu = [

    {
        nombre: "Eby Rockefeller",
        precio: 209,
        descripcion:
            "Camarones salteados a la mantequilla con ajo, bañados en salsa Rockefeller, servidos sobre una cama de arroz al vapor y ensalada de guarnición.",
        icono: "🍤"
    },

    {
        nombre: "Tori Tori",
        precio: 185,
        descripcion:
            "Rollos empanizados de pollo rellenos de kanikama y queso Philadelphia, acompañados de arroz al vapor, aguacate y salsa chipotle artesanal.",
        icono: "🍗"
    },

    {
        nombre: "Golden Ika",
        precio: 190,
        descripcion:
            "Calamar squid (150gr) salteado a la mantequilla con ajo, champiñones, espárragos y brócoli, acompañado de arroz al vapor y ensalada fresca.",
        icono: "🦑"
    }

];


const session5BarraMenu = [

    {
        nombre: "Katana Roll",
        precio: 180,
        descripcion:
            "XF: Atún flameado, aceite de ajonjolí, chile seco y un toque de salsa spicy. XD: Camarón empanizado, queso Philadelphia y aguacate.",
        esRollo: true
    },

    {
        nombre: "Mango Passion Roll",
        precio: 165,
        descripcion:
            "XF: Queso Philadelphia, láminas de mango, salsa de maracuyá y flores comestibles. XD: Salmón fresco y aguacate.",
        esRollo: true
    },

    {
        nombre: "Ebi Rock Roll",
        precio: 180,
        descripcion:
            "Rollo empanizado. XF: Camarones salteados a la mantequilla, bañados en salsa Rockefeller. XD: Camarón empanizado y queso Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Yokohama Roll",
        precio: 180,
        descripcion:
            "XF: Carne de res salteada en salsa teriyaki, cebollín y un toque de salsa spicy. XD: Pulpo a la mantequilla y aguacate.",
        esRollo: true
    },

    {
        nombre: "Dragon Green Roll",
        precio: 170,
        descripcion:
            "XF: Aguacate, salsa spicy y gotas de aceite de chile japonés. XD: Camarón empanizado, queso Philadelphia y tampico.",
        esRollo: true
    },

    {
        nombre: "Tuna Eureka Roll",
        precio: 165,
        descripcion:
            "XF: Atún fresco, reducción de soya con ajo y limón amarillo, chiles toreados. XD: Camarón tempura y aguacate.",
        esRollo: true
    },

    {
        nombre: "Kazan Roll",
        precio: 180,
        descripcion:
            "XF: Salmón flameado, aceite de ajonjolí, gotas de mayonesa oriental y chile seco. XD: Camarón empanizado, queso Philadelphia y aguacate.",
        esRollo: true
    },

    {
        nombre: "Nishiki Roll",
        precio: 165,
        descripcion:
            "XF: Queso Philadelphia, pera fresca, salsa Bora y flores comestibles. XD: Salmón ahumado y mango.",
        esRollo: true
    },

    {
        nombre: "Crab Roll",
        precio: 159,
        descripcion:
            "XF: Salsa spicy cremosa y espejo de salsa de anguila con cebollín. XD: Cangrejo suave (soft-shell crab), aguacate y queso Philadelphia.",
        esRollo: true
    },

    {
        nombre: "Roll Veggie",
        precio: 144,
        descripcion:
            "XF: Aguacate, aderezo de ajonjolí con limón eureka y flores comestibles. XD: Espárragos, champiñones salteados y zanahoria.",
        esRollo: true
    }

];


const session5PostresMenu = [

    {
        nombre: "Nube de Queso",
        precio: 95,
        descripcion:
            "Cheesecake de queso Philadelphia capeado en tempura ligera, servido tibio con una bola de helado sabor frutos rojos y mermelada.",
        icono: "🍰"
    },

    {
        nombre: "Cream Tapioca",
        precio: 90,
        descripcion:
            "Perlas de tapioca en mezcla cremosa de leches, acompañadas de helado de vainilla artesanal.",
        icono: "🍨"
    }

];


// ======================================================
// CREAR PRODUCTOS FIJOS AUTOMÁTICAMENTE
// ======================================================


function renderizarProductosFijos(
    productos,
    idContenedor,
    esRolloPredeterminado = false
) {

    const contenedor =
        document.getElementById(
            idContenedor
        );


    if (!contenedor) {
        return;
    }


    contenedor.innerHTML =
        "";


    productos.forEach(
        function(producto) {

            const articulo =
                document.createElement(
                    "article"
                );


            articulo.className =
                "producto producto-con-imagen";


            const imagenProducto =
                producto.imagen
                    ?
                    `
                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                        class="producto-imagen"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    >

                    <div
                        class="producto-sin-imagen"
                    >
                        ${producto.icono || "🍣"}
                    </div>
                    `
                    :
                    `
                    <div
                        class="producto-sin-imagen"
                        style="display:flex;"
                    >
                        ${producto.icono || "🍣"}
                    </div>
                    `;


            const tieneOpciones =
                producto.conOpciones ===
                true;


            const precioMostrar =
                producto.precioTexto
                    ?
                    producto.precioTexto
                    :
                    tieneOpciones
                        ?
                        `Desde $${producto.precioDesde}`
                        :
                        `$${producto.precio}`;


            const esRollo =
                typeof producto.esRollo ===
                "boolean"
                    ?
                    producto.esRollo
                    :
                    esRolloPredeterminado;


            const botonProducto =
                tieneOpciones
                    ?
                    `
                    <button
                        type="button"
                        class="abrir-opciones-dinamico"
                        data-producto="${producto.nombre}"
                        aria-label="Elegir ${producto.nombre}"
                    >
                        +
                    </button>
                    `
                    :
                    `
                    <button
                        type="button"
                        class="agregar-producto-fijo agregar"
                        data-nombre="${producto.nombre}"
                        data-precio="${producto.precio}"
                        data-es-rollo="${esRollo}"
                        aria-label="Agregar ${producto.nombre}"
                    >
                        +
                    </button>
                    `;


            articulo.innerHTML =
                `
                <div class="producto-info">

                    <h3>
                        ${producto.nombre}
                    </h3>

                    <p>
                        ${producto.descripcion}
                    </p>

                    <span class="precio-producto">
                        ${precioMostrar}
                    </span>

                </div>


                <div class="producto-media">

                    ${imagenProducto}

                    ${botonProducto}

                </div>
                `;


            contenedor.appendChild(
                articulo
            );

        }
    );

}
// ======================================================
// MOSTRAR MENÚ COMPLETO
// ======================================================

// ENTRADAS
renderizarProductosFijos(
    entradasMenu,
    "entradas-menu"
);


// BROCHETAS
renderizarProductosFijos(
    kushiaguesMenu,
    "kushiagues-menu"
);

renderizarProductosFijos(
    yakitorisMenu,
    "yakitoris-menu"
);


// SOPAS
renderizarProductosFijos(
    sopasMenu,
    "sopas-menu"
);

renderizarProductosFijos(
    ramenFussionMenu,
    "ramen-fussion-menu"
);


// ENSALADAS
renderizarProductosFijos(
    ensaladasMenu,
    "ensaladas-menu"
);


// ARROCES
renderizarProductosFijos(
    yakimeshiMenu,
    "yakimeshi-menu"
);

renderizarProductosFijos(
    gohanMenu,
    "gohan-menu"
);


// COCINA
renderizarProductosFijos(
    tempurasMenu,
    "tempuras-menu"
);

renderizarProductosFijos(
    teppanMenu,
    "teppan-menu"
);

renderizarProductosFijos(
    teriMenu,
    "teri-menu"
);

renderizarProductosFijos(
    yakisobaMenu,
    "yakisoba-menu"
);

renderizarProductosFijos(
    [
        ...cocinaEspecialidadesMenu,
        ...session5CocinaMenu
    ],
    "cocina-especialidades-menu"
);


// SUSHI
renderizarProductosFijos(
    sashimisMenu,
    "sashimis-menu"
);



renderizarProductosFijos(
    [
        ...temakisAlgaMenu,
        ...temakisPepinoMenu
    ],
    "temakis-menu"
);



renderizarProductosFijos(
    bateraMenu,
    "batera-menu"
);

renderizarProductosFijos(
    niguirisMenu,
    "niguiris-menu"
);


renderizarProductosFijos(
    [
        ...especialidadesBarra,
        ...session5BarraMenu
    ],
    "especialidades-barra",
    true
);

renderizarProductosFijos(
    rollosEmpanizados,
    "rollos-empanizados",
    true
);

renderizarProductosFijos(
    rollosCapeados,
    "rollos-capeados",
    true
);

renderizarProductosFijos(
    sushiBalls,
    "sushi-balls",
    false
);


const postresConSalsa = [
    ...postresMenu,
    ...session5PostresMenu
].map(function(postre) {

    const requiereSalsa = [
        "Yorokobi",
        "Banana Maky",
        "Tempura Helado"
    ].includes(postre.nombre);

    // Los demás postres se quedan normales
    if (!requiereSalsa) {
        return postre;
    }

    productosConOpciones[postre.nombre] = {

        descripcion: postre.descripcion,

        imagen: postre.imagen || "",

        esRollo: false,

        opciones: [
            {
                nombre: "Chocolate",
                precio: postre.precio
            },
            {
                nombre: "Cajeta",
                precio: postre.precio
            },
            {
                nombre: "Mermelada",
                precio: postre.precio
            }
        ]

    };

    return {
        ...postre,
        conOpciones: true,
        precioDesde: postre.precio,
        esRollo: false
    };

});

renderizarProductosFijos(
    postresConSalsa,
    "postres-menu"
);


    return {
        ...postre,
        conOpciones: true,
        precioDesde: postre.precio,
        esRollo: false
    };

});

renderizarProductosFijos(
    postresConSalsa,
    "postres-menu"
);



// ORDEN EXTRA
renderizarProductosFijos(
    ordenExtraMenu,
    "orden-extra-menu"
);


// MENÚ INFANTIL
renderizarProductosFijos(
    infantilMenu,
    "infantil-menu"
);



// ======================================================
// AGREGAR PRODUCTOS NORMALES DEL HTML
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
                     
                    const esRollo =
    boton.closest("#rollos") !== null;
     

                cantidadCarrito++;


                totalCarrito +=
                    precio;


                if (
                    pedido[nombre]
                ) {

                    pedido[nombre]
                        .cantidad++;

                } else {

                    pedido[nombre] = {

    nombre:
        nombre,

    comentario:
        "",

    precio:
        precio,

    cantidad:
        1,

    esRollo:
        esRollo

};

                }


                actualizarPedido();

            }
        );

    }
);


// ======================================================
// AGREGAR PRODUCTOS FIJOS CREADOS CON JAVASCRIPT
// ======================================================

document.addEventListener(
    "click",
    function(evento) {

        const boton =
            evento.target.closest(
                ".agregar-producto-fijo"
            );


        if (!boton) {

            return;

        }


        const nombre =
            boton.dataset.nombre;


        const precio =
            Number(
                boton.dataset.precio

            
            );
        const esRollo =
            boton.dataset.esRollo ===
            "true";
            


        cantidadCarrito++;


        totalCarrito +=
            precio;


        if (
            pedido[nombre]
        ) {

            pedido[nombre]
                .cantidad++;

        } else {

            pedido[nombre] = {

    nombre:
        nombre,

    comentario:
        "",

    precio:
        precio,

    cantidad:
        1,

    esRollo:
        esRollo

};
        }


        actualizarPedido();

    }
);


function abrirModalOpcionesProducto(
    nombreProducto
) {

    const producto =
        productosConOpciones[
            nombreProducto
        ];


    if (!producto) {

        return;

    }


    productoOpcionesActual =
        nombreProducto;


    opcionProductoActual =
        null;


    tituloOpcionesProducto
        .textContent =
        nombreProducto;


    descripcionOpcionesProducto
        .textContent =
        producto.descripcion;


    if (
        imagenOpcionesProducto
    ) {

        imagenOpcionesProducto.src =
            producto.imagen || "";

    }


    if (
        comentarioOpcionesProducto
    ) {

        comentarioOpcionesProducto
            .value =
            "";

    }


    listaOpcionesProducto
        .innerHTML =
        "";


    const tituloSeccionOpciones =
        document.querySelector(
            ".seccion-opciones-producto h3"
        );


    const textoSeleccionOpciones =
        document.querySelector(
            ".seccion-opciones-producto .texto-seleccion"
        );


    // ==================================================
    // MENÚ INFANTIL
    // ==================================================

    if (
        producto.esMenuInfantil
    ) {

        seleccionesMenuInfantil = {

            principal: "",

            acompanamiento: "",

            complemento: "",

              rollo: ""
            

        };


        if (
            tituloSeccionOpciones
        ) {

            tituloSeccionOpciones.textContent =
                "Arma tu paquete";

        }


        if (
            textoSeleccionOpciones
        ) {

            textoSeleccionOpciones.textContent =
                "Selecciona una opción de cada grupo";

        }


        precioOpcionesProducto
            .textContent =
            `MXN $${producto.precioFijo}`;


        confirmarOpcionProducto
            .textContent =
            "Completa tu paquete";


        confirmarOpcionProducto
            .disabled =
            true;


        producto.grupos.forEach(
            function(grupo) {

                const bloqueGrupo =
                    document.createElement(
                        "div"
                    );


bloqueGrupo.className =
    "grupo-menu-infantil";

if (grupo.clave === "rollo") {

    bloqueGrupo.classList.add(
        "grupo-rollo-infantil"
    );

    bloqueGrupo.style.display = "none";

}



                const tituloGrupo =
                    document.createElement(
                        "h4"
                    );


                tituloGrupo.textContent =
                    grupo.titulo;


                bloqueGrupo.appendChild(
                    tituloGrupo
                );


                grupo.opciones.forEach(
                    function(nombreOpcion) {

                        const contenedor =
                            document.createElement(
                                "label"
                            );


                        contenedor.className =
                            "opcion-producto opcion-menu-infantil";


                        contenedor.innerHTML =
                            `

                            <div class="opcion-producto-info">

                                <strong>
                                    ${nombreOpcion}
                                </strong>

                            </div>


                            <input
                                type="radio"
                                name="menu-infantil-${grupo.clave}"
                                value="${nombreOpcion}"
                            >

                            `;


                        const radio =
                            contenedor
                                .querySelector(
                                    "input"
                                );


                        radio.addEventListener(
                            "change",
                            function() {

                                bloqueGrupo
                                    .querySelectorAll(
                                        ".opcion-producto"
                                    )
                                    .forEach(
                                        function(item) {

                                            item.classList.remove(
                                                "seleccionada"
                                            );

                                        }
                                    );


                                contenedor
                                    .classList
                                    .add(
                                        "seleccionada"
                                    );


                                seleccionesMenuInfantil[
                                    grupo.clave
                                ] =
                                    nombreOpcion;

                                    
if (grupo.clave === "principal") {

    const grupoRollo =
        listaOpcionesProducto.querySelector(
            ".grupo-rollo-infantil"
        );

    const eligioMedioRollo =
        nombreOpcion === "Medio rollo clásico";

    if (grupoRollo) {

        grupoRollo.style.display =
            eligioMedioRollo ? "" : "none";

        if (!eligioMedioRollo) {

            seleccionesMenuInfantil.rollo = "";

            grupoRollo.querySelectorAll(
                'input[type="radio"]'
            ).forEach(function(radio) {

                radio.checked = false;

            });

            grupoRollo.querySelectorAll(
                ".opcion-producto"
            ).forEach(function(item) {

                item.classList.remove(
                    "seleccionada"
                );

            });

        }

    }

}



                                
const paqueteCompleto =

    seleccionesMenuInfantil.principal !== "" &&

    seleccionesMenuInfantil.acompanamiento !== "" &&

    seleccionesMenuInfantil.complemento !== "" &&

    (
        seleccionesMenuInfantil.principal !==
            "Medio rollo clásico" ||

        seleccionesMenuInfantil.rollo !== ""
    );



                                if (
                                    paqueteCompleto
                                ) {

                                    opcionProductoActual = {

                                        nombre:

                                            
"Principal: " +
seleccionesMenuInfantil.principal +

(
    seleccionesMenuInfantil.principal ===
        "Medio rollo clásico"
        ? " (" + seleccionesMenuInfantil.rollo + ")"
        : ""
) +


                                            " | Acompaña: " +
                                            seleccionesMenuInfantil.acompanamiento +

                                            " | Complementa: " +
                                            seleccionesMenuInfantil.complemento,

                                        precio:
                                            producto.precioFijo

                                    };


                                    precioOpcionesProducto
                                        .textContent =
                                        `MXN $${producto.precioFijo}`;


                                    confirmarOpcionProducto
                                        .textContent =
                                        `Agregar MXN $${producto.precioFijo}`;


                                    confirmarOpcionProducto
                                        .disabled =
                                        false;

                                } else {

                                    opcionProductoActual =
                                        null;


                                    confirmarOpcionProducto
                                        .textContent =
                                        "Completa tu paquete";


                                    confirmarOpcionProducto
                                        .disabled =
                                        true;

                                }

                            }
                        );


                        bloqueGrupo
                            .appendChild(
                                contenedor
                            );

                    }
                );


                listaOpcionesProducto
                    .appendChild(
                        bloqueGrupo
                    );

            }
        );


        modalOpcionesProducto
            .style
            .display =
            "flex";


        return;

    }


    // ==================================================
    // DEMÁS PRODUCTOS CON OPCIONES
    // ==================================================

    if (
        tituloSeccionOpciones
    ) {

        tituloSeccionOpciones.textContent =
            "Elige tu opción";

    }


    if (
        textoSeleccionOpciones
    ) {

        textoSeleccionOpciones.textContent =
            "Selecciona 1 opción";

    }


    precioOpcionesProducto
        .textContent =
        "Selecciona una opción";


    confirmarOpcionProducto
        .textContent =
        "Selecciona una opción";


    confirmarOpcionProducto
        .disabled =
        true;


    producto.opciones.forEach(
        function(opcion) {

            const contenedor =
                document.createElement(
                    "label"
                );


            contenedor.className =
                "opcion-producto";


            contenedor.innerHTML =
                `

                <div class="opcion-producto-info">

                    <strong>
                        ${opcion.nombre}
                    </strong>

                    <span>
                        MXN $${opcion.precio}
                    </span>

                </div>


                <input
                    type="radio"
                    name="opcion-producto"
                    value="${opcion.nombre}"
                >

                `;


            const radio =
                contenedor
                    .querySelector(
                        "input"
                    );


            radio.addEventListener(
                "change",
                function() {

                    document
                        .querySelectorAll(
                            "#lista-opciones-producto > .opcion-producto"
                        )
                        .forEach(
                            function(item) {

                                item.classList.remove(
                                    "seleccionada"
                                );

                            }
                        );


                    contenedor
                        .classList
                        .add(
                            "seleccionada"
                        );


                    opcionProductoActual =
                        opcion;


                    precioOpcionesProducto
                        .textContent =
                        `MXN $${opcion.precio}`;


                    confirmarOpcionProducto
                        .textContent =
                        `Agregar MXN $${opcion.precio}`;


                    confirmarOpcionProducto
                        .disabled =
                        false;

                }
            );


            listaOpcionesProducto
                .appendChild(
                    contenedor
                );

        }
    );


    modalOpcionesProducto
        .style
        .display =
        "flex";

}


// Botones de opciones que ya existen en el HTML.
botonesAbrirOpciones.forEach(
    function(boton) {

        boton.addEventListener(
            "click",
            function() {

                abrirModalOpcionesProducto(
                    boton.dataset.producto
                );

            }
        );

    }
);


// Botones de opciones creados dinámicamente por JavaScript.
document.addEventListener(
    "click",
    function(evento) {

        const boton =
            evento.target.closest(
                ".abrir-opciones-dinamico"
            );


        if (!boton) {
            return;
        }


        abrirModalOpcionesProducto(
            boton.dataset.producto
        );

    }
);

// ======================================================
// AGREGAR PRODUCTO CON OPCIÓN AL CARRITO
// ======================================================

if (
    confirmarOpcionProducto
) {

    confirmarOpcionProducto
        .addEventListener(
            "click",
            function() {

                if (
                    !productoOpcionesActual ||
                    !opcionProductoActual
                ) {

                    return;

                }


                const nombreProducto =
                    `${productoOpcionesActual} (${opcionProductoActual.nombre})`;


                const precio =
                    opcionProductoActual
                        .precio;


                const comentarioProducto =
                    comentarioOpcionesProducto
                        ?
                        comentarioOpcionesProducto
                            .value
                            .trim()
                        :
                        "";


                /*
                    Usamos nombre + comentario
                    para distinguir pedidos diferentes.

                    Ejemplo:

                    Avocado Maky (Pulpo)
                    Nota: salsa aparte

                    no debe mezclarse con:

                    Avocado Maky (Pulpo)
                    Nota: sin queso
                */

                const claveProducto =
                    encodeURIComponent(
                        nombreProducto +
                        "|" +
                        comentarioProducto
                    );


                cantidadCarrito++;


                totalCarrito +=
                    precio;


                if (
                    pedido[claveProducto]
                ) {

                    pedido[claveProducto]
                        .cantidad++;

                } else {

                    pedido[claveProducto] = {

    nombre:
        nombreProducto,

    comentario:
        comentarioProducto,

    precio:
        precio,

    cantidad:
        1,

    esRollo:
        productosConOpciones[
            productoOpcionesActual
        ]?.esRollo !== false

};

                }


                actualizarPedido();


                modalOpcionesProducto
                    .style
                    .display =
                    "none";


                productoOpcionesActual =
                    null;


                opcionProductoActual =
                    null;


                if (
                    comentarioOpcionesProducto
                ) {

                    comentarioOpcionesProducto
                        .value =
                        "";

                }

            }
        );

}


// ======================================================
// CERRAR MODAL DE OPCIONES
// ======================================================

if (
    cerrarOpcionesProducto
) {

    cerrarOpcionesProducto
        .addEventListener(
            "click",
            function() {

                modalOpcionesProducto
                    .style
                    .display =
                    "none";


                productoOpcionesActual =
                    null;


                opcionProductoActual =
                    null;

            }
        );

}


// ======================================================
// FIN DE LA PARTE 1 DE 3
// ======================================================

// ======================================================
// ANGUILA SUSHI - SCRIPT PRINCIPAL
// PARTE 2 DE 3
// ======================================================

// ======================================================
// FUNCIONES DE CHAROLA
// ======================================================

function contarRollosPedido() {

    let cantidadRollos = 0;


    for (
        let claveProducto in pedido
    ) {

        const producto =
            pedido[
                claveProducto
            ];


        if (
            producto.esRollo
        ) {

            cantidadRollos +=
                producto.cantidad;

        }

    }


    return cantidadRollos;

}


// ======================================================
// DÍA ACTUAL
// 0 domingo
// 4 jueves
// 5 viernes
// 6 sábado
// ======================================================

function obtenerDiaActual() {

    return new Date()
        .getDay();

}


// ======================================================
// SABER SI PUEDE PEDIR CHAROLA
// ======================================================

function charolaDisponible() {

    const rollos =
        contarRollosPedido();


    return (
        rollos >=
            MIN_ROLLOS_CHAROLA &&
        rollos <=
            MAX_ROLLOS_CHAROLA
    );

}


// ======================================================
// COSTO DE CHAROLA
// ======================================================

function obtenerCostoCharola() {

    if (
        !charolaSeleccionada
    ) {

        return 0;

    }


    const dia =
        obtenerDiaActual();


    // JUEVES

    if (
        dia === 4
    ) {

        return 30;

    }


    return 0;

}


// ======================================================
// ROLLO DE CORTESÍA
// VIERNES, SÁBADO Y DOMINGO
// DESDE 8 ROLLOS
// ======================================================

function tieneRolloCortesiaCharola() {

    if (
    !charolaSeleccionada ||
    !promoCharolaActiva
) {

    return false;

}


    const rollos =
        contarRollosPedido();


    if (
        rollos < 8
    ) {

        return false;

    }


    const dia =
        obtenerDiaActual();


    return (
        dia === 5 ||
        dia === 6 ||
        dia === 0
    );

}


// ======================================================
// ACTUALIZAR INTERFAZ DE CHAROLA
// ======================================================
function actualizarOpcionCharola() {

    const contenedorCharola =
        document.getElementById(
            "charola-pedido"
        );


    const boton =
        document.getElementById(
            "btn-charola"
        );


    const mensaje =
        document.getElementById(
            "mensaje-charola"
        );


    if (
        !contenedorCharola ||
        !boton ||
        !mensaje
    ) {

        return;

    }


    const rollos =
        contarRollosPedido();


    const disponible =
        charolaDisponible();


    // ==================================================
    // OCULTAR SI NO TIENE ENTRE 6 Y 10 ROLLOS
    // ==================================================

    if (
        !disponible
    ) {

        contenedorCharola.style.display =
            "none";


        charolaSeleccionada =
            false;


        boton.classList.remove(
            "activa"
        );


        boton.textContent =
            "Seleccionar charola";


        return;

    }


    // ==================================================
    // MOSTRAR CHAROLA
    // ==================================================

    contenedorCharola.style.display =
        "";


    boton.disabled =
        false;


    const dia =
        obtenerDiaActual();


    // ==================================================
    // JUEVES
    // ==================================================

    if (
        dia === 4
    ) {

        mensaje.textContent =
            "Jueves: charola +$30.";

    }


    // ==================================================
    // PROMO CHAROLA - 8 A 10 ROLLOS
    // ==================================================

    else if (
        promoCharolaActiva &&
        (
            dia === 5 ||
            dia === 6 ||
            dia === 0
        ) &&
        rollos >= 8
    ) {

        mensaje.textContent =
            "🎁 Arma tu charola con 8 rollos y el noveno es de regalo, a decisión del chef.";

    }


    // ==================================================
    // PROMO ACTIVA PERO SOLO TIENE 6 O 7
    // ==================================================

    else if (
        promoCharolaActiva &&
        (
            dia === 5 ||
            dia === 6 ||
            dia === 0
        )
    ) {

        mensaje.textContent =
            "Charola sin costo. Con 8 rollos, el noveno es de regalo.";

    }


    // ==================================================
    // DÍA NORMAL
    // ==================================================

    else {

        mensaje.textContent =
            "Charola sin costo adicional.";

    }


    // ==================================================
    // ESTADO DEL BOTÓN
    // ==================================================

    boton.classList.toggle(
        "activa",
        charolaSeleccionada
    );


    boton.textContent =
        charolaSeleccionada
            ?
            "✓ Charola seleccionada"
            :
            "Seleccionar charola";

}


// ======================================================
// ELEMENTOS DE INFORMACIÓN DEL PEDIDO
// ======================================================

const modalInformacion =
    document.getElementById(
        "modal-informacion"
    );


const volverInfo =
    document.getElementById(
        "volver-info"
    );


const cerrarInfo =
    document.getElementById(
        "cerrar-info"
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


const botonesServicio =
    document.querySelectorAll(
        ".servicio-btn"
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
function obtenerDescuento2x1() {

    if (!promo2x1Activa) {
        return 0;
    }
    if (
    tieneRolloCortesiaCharola()
) {

    return 0;

}

    const preciosRollos = [];


    // ==============================================
    // SACAR CADA ROLLO INDIVIDUAL DEL CARRITO
    // ==============================================

    for (let claveProducto in pedido) {

        const producto =
            pedido[claveProducto];

        if (!producto.esRollo) {
            continue;
        }


        for (
            let i = 0;
            i < producto.cantidad;
            i++
        ) {

            preciosRollos.push(
                producto.precio
            );

        }

    }


    // ==============================================
    // ORDENAR DEL MÁS BARATO AL MÁS CARO
    // ==============================================

    preciosRollos.sort(
        function(a, b) {
            return a - b;
        }
    );


    // ==============================================
    // CUÁNTOS ROLLOS SON GRATIS
    // ==============================================

    const cantidadGratis =
        Math.floor(
            preciosRollos.length / 2
        );


    // ==============================================
    // DESCONTAR LOS MÁS BARATOS
    // ==============================================

    let descuento = 0;


    for (
        let i = 0;
        i < cantidadGratis;
        i++
    ) {

        descuento +=
            preciosRollos[i];

    }


    return descuento;

}

// ======================================================
// IDENTIFICAR QUÉ ROLLOS QUEDAN GRATIS EN EL 2X1
// ======================================================

function obtenerRollosGratis2x1() {

    const gratisPorProducto = {};

    if (!promo2x1Activa) {
        return gratisPorProducto;
    }
    if (
    !promo2x1Activa ||
    tieneRolloCortesiaCharola()
) {

    return gratisPorProducto;

}


    const unidadesRollos = [];


    // Convertimos el carrito en rollos individuales
    for (let claveProducto in pedido) {

        const producto =
            pedido[claveProducto];

        if (!producto.esRollo) {
            continue;
        }


        for (
            let i = 0;
            i < producto.cantidad;
            i++
        ) {

            unidadesRollos.push({

                clave:
                    claveProducto,

                precio:
                    producto.precio

            });

        }

    }


    // Los más baratos primero
    unidadesRollos.sort(
        function(a, b) {

            return (
                a.precio -
                b.precio
            );

        }
    );


    const cantidadGratis =
        Math.floor(
            unidadesRollos.length / 2
        );


    // Los N más baratos son gratis
    for (
        let i = 0;
        i < cantidadGratis;
        i++
    ) {

        const clave =
            unidadesRollos[i]
                .clave;


        if (
            !gratisPorProducto[clave]
        ) {

            gratisPorProducto[clave] =
                0;

        }


        gratisPorProducto[clave]++;

    }


    return gratisPorProducto;

}

// ======================================================
// TOTAL DE PRODUCTOS DESPUÉS DE PROMOCIÓN
// ======================================================

function obtenerTotalProductosConPromo() {

    return (
        totalCarrito -
        obtenerDescuento2x1()
    );

}


// ======================================================
// TOTAL FINAL DEL PEDIDO
// ======================================================

function obtenerTotalFinal() {

    return (
        obtenerTotalProductosConPromo() +
        obtenerCostoCharola() +
        obtenerCostoEntrega()
    );

}

// ======================================================
// COSTO DE ENTREGA
// ======================================================
function obtenerCostoEntrega() {

    if (
        servicioSeleccionado !==
        "domicilio"
    ) {

        return 0;

    }


    // Si está activa la promoción 2x1,
    // el envío cuesta $50

   if (
    promo2x1Activa &&
    !tieneRolloCortesiaCharola()
) {

    return 50;

}


    // Día normal

    return 30;

}

// ======================================================
// ACTUALIZAR CARRITO
// ======================================================

function actualizarPedido() {

    actualizarOpcionCharola();

    const descuento2x1 =
        obtenerDescuento2x1();

    const totalConPromo =
        obtenerTotalProductosConPromo();

    const costoCharola =
        obtenerCostoCharola();

    const totalProductosYCharola =
        totalConPromo +
        costoCharola;

    const totalFinal =
        obtenerTotalFinal();

    const gratisPorProducto =
        obtenerRollosGratis2x1();

    // ==================================================
    // ACTUALIZAR BARRA DEL CARRITO
    // ==================================================

    if (contador) {

        contador.textContent =
            cantidadCarrito;

    }


    if (total) {

        total.textContent =
    totalProductosYCharola;

    }


    if (totalModal) {

       totalModal.textContent =
    totalProductosYCharola;

    }


    if (resumenCantidad) {

        resumenCantidad.textContent =
            cantidadCarrito;

    }


    if (resumenTotal) {

        resumenTotal.textContent =
            totalFinal;

    }


    if (!detallePedido) {

        return;

    }


    // ==================================================
    // CARRITO VACÍO
    // ==================================================

    if (
        cantidadCarrito === 0
    ) {

        detallePedido.innerHTML =
            `
            <div class="carrito-vacio">

                <span>🛒</span>

                <strong>
                    Tu carrito está vacío
                </strong>

                <p>
                    Agrega algo rico del menú.
                </p>

            </div>
            `;

        return;

    }


    detallePedido.innerHTML =
        "";


    // ==================================================
    // MOSTRAR PRODUCTOS
    // ==================================================

    for (
        let claveProducto in pedido
    ) {

        const producto =
            pedido[claveProducto];


        const nombreMostrar =
            producto.nombre ||
            claveProducto;


        const comentarioMostrar =
            producto.comentario || "";


        const unidadesGratis =
            gratisPorProducto[
                claveProducto
            ] || 0;


        const unidadesPagadas =
            producto.cantidad -
            unidadesGratis;


        const subtotalNormal =
            producto.precio *
            producto.cantidad;


        const subtotalCobrado =
            producto.precio *
            unidadesPagadas;


        const tienePromo =
            unidadesGratis > 0;


        detallePedido.innerHTML +=
            `

            <div
                class="
                    item-pedido
                    ${
                        tienePromo
                            ?
                            "item-pedido-promo"
                            :
                            ""
                    }
                "
            >

                <div class="item-pedido-info">

                    <div class="item-pedido-titulo">

                        <strong>
                            ${nombreMostrar}
                        </strong>


                        ${
                            tienePromo
                                ?
                                `
                                <span class="badge-2x1">

                                    🎁 ${
                                        producto.cantidad ===
                                        unidadesGratis

                                            ?

                                            "Gratis por 2x1"

                                            :

                                            `${unidadesGratis} gratis de ${producto.cantidad}`
                                    }

                                </span>
                                `
                                :
                                ""
                        }

                    </div>


                    ${
                        comentarioMostrar !== ""
                            ?
                            `
                            <p class="nota-producto">
                                📝 ${comentarioMostrar}
                            </p>
                            `
                            :
                            ""
                    }


                    <div class="controles-cantidad">

                        <button
                            type="button"
                            class="restar"
                            data-nombre="${claveProducto}"
                        >
                            −
                        </button>


                        <span>
                            ${producto.cantidad}
                        </span>


                        <button
                            type="button"
                            class="sumar"
                            data-nombre="${claveProducto}"
                        >
                            +
                        </button>

                    </div>

                </div>


                <div class="precio-item-carrito">

                    ${
                        tienePromo
                            ?
                            `

                            <span class="precio-tachado">
                                $${subtotalNormal}
                            </span>

                            ${
                                subtotalCobrado === 0
                                    ?
                                    `
                                    <strong class="texto-gratis">
                                        GRATIS
                                    </strong>
                                    `
                                    :
                                    `
                                    <strong>
                                        $${subtotalCobrado}
                                    </strong>
                                    `
                            }

                            `
                            :
                            `

                            <strong>
                                $${subtotalNormal}
                            </strong>

                            `
                    }

                </div>

            </div>

            `;

    }


    // ==================================================
    // DESCUENTO 2X1
    // ==================================================

    if (
        promo2x1Activa &&
        descuento2x1 > 0
    ) {

        detallePedido.innerHTML +=
            `

            <div class="resumen-promo-2x1">

                <div class="icono-promo-2x1">
                    🎁
                </div>


                <div class="texto-promo-2x1">

                    <strong>
                        Promoción 2x1
                    </strong>

                    <small>
                        Se cobran los rollos de mayor precio
                    </small>

                </div>


                <strong class="cantidad-descuento-2x1">
                    -$${descuento2x1}
                </strong>

            </div>

            `;

    }
// ==================================================
// MOSTRAR CHAROLA EN EL CARRITO
// ==================================================

if (
    charolaSeleccionada
) {

    const costoCharola =
        obtenerCostoCharola();


    const tieneCortesia =
        tieneRolloCortesiaCharola();


    let textoCharola =
        "Sin costo adicional";


    if (
        costoCharola > 0
    ) {

        textoCharola =
            `Costo adicional: $${costoCharola}`;

    }


    if (
        tieneCortesia
    ) {

        textoCharola =
            "Incluye 1 rollo de cortesía elegido por cocina";

    }


    detallePedido.innerHTML +=
        `

        <div class="resumen-charola">

            <span>
                🍱
            </span>

            <div>

                <strong>
                    Pedido en charola
                </strong>

                <small>
                    ${textoCharola}
                </small>

            </div>

        </div>

        `;

}

    activarControles();

}

// ======================================================
// BOTONES + Y - DEL CARRITO
// ======================================================

function activarControles() {


    // ==================================================
    // SUMAR
    // ==================================================

    document
        .querySelectorAll(
            ".sumar"
        )
        .forEach(
            function(boton) {

                boton.addEventListener(
                    "click",
                    function() {

                        const claveProducto =
                            boton.dataset.nombre;


                        if (
                            !pedido[
                                claveProducto
                            ]
                        ) {

                            return;

                        }


                        pedido[
                            claveProducto
                        ].cantidad++;


                        cantidadCarrito++;


                        totalCarrito +=
                            pedido[
                                claveProducto
                            ].precio;


                        actualizarPedido();

                    }
                );

            }
        );


    // ==================================================
    // RESTAR
    // ==================================================

    document
        .querySelectorAll(
            ".restar"
        )
        .forEach(
            function(boton) {

                boton.addEventListener(
                    "click",
                    function() {

                        const claveProducto =
                            boton.dataset.nombre;


                        if (
                            !pedido[
                                claveProducto
                            ]
                        ) {

                            return;

                        }


                        pedido[
                            claveProducto
                        ].cantidad--;


                        cantidadCarrito--;


                        totalCarrito -=
                            pedido[
                                claveProducto
                            ].precio;


                        if (
                            pedido[
                                claveProducto
                            ].cantidad === 0
                        ) {

                            delete pedido[
                                claveProducto
                            ];

                        }


                        actualizarPedido();

                    }
                );

            }
        );

}


// ======================================================
// ACTUALIZAR RESUMEN DE CUENTA
// ======================================================

function actualizarResumenCuenta() {

    

    if (
        !productosResumen
    ) {

        return;

    }


    productosResumen.innerHTML =
        "";


    if (
        cantidadResumenDetalle
    ) {

        cantidadResumenDetalle
            .textContent =
            cantidadCarrito;

    }


    // ==================================================
    // MOSTRAR PRODUCTOS
    // ==================================================

    for (
        let claveProducto in pedido
    ) {

        const producto =
            pedido[claveProducto];


        const subtotal =
            producto.precio *
            producto.cantidad;


        const nombreMostrar =
            producto.nombre ||
            claveProducto;


        const comentarioMostrar =
            producto.comentario || "";


        productosResumen.innerHTML +=
            `

            <div class="producto-resumen">

                <div>

                    <span>
                        ${nombreMostrar}
                        x${producto.cantidad}
                    </span>

                    ${
                        comentarioMostrar !== ""
                            ?
                            `
                            <small class="nota-producto">
                                📝 ${comentarioMostrar}
                            </small>
                            `
                            :
                            ""
                    }

                </div>

                <strong>
                    $${subtotal}
                </strong>

            </div>

            `;

    }


    // ==================================================
    // PROMOCIÓN 2X1
    // ==================================================

    const descuento2x1 =
        obtenerDescuento2x1();


    if (
        promo2x1Activa &&
        descuento2x1 > 0
    ) {

        productosResumen.innerHTML +=
            `

            <div class="producto-resumen descuento-2x1">

                <div>

                    <strong>
                        🎉 Promoción 2x1
                    </strong>

                    <small>
                        Descuento en rollos participantes
                    </small>

                </div>

                <strong>
                    -$${descuento2x1}
                </strong>

            </div>

            `;

    }


    // ==================================================
    // TOTALES
    // ==================================================

    const costoEntrega =
        obtenerCostoEntrega();


    const totalFinal =
        obtenerTotalFinal();


    if (
        subtotalResumen
    ) {

        subtotalResumen.textContent =
            totalCarrito;

    }


    if (
        entregaResumen
    ) {

        entregaResumen.textContent =
            costoEntrega;

    }


    if (
        totalCuentaResumen
    ) {

        totalCuentaResumen.textContent =
            totalFinal;

    }

}

// ======================================================
// ABRIR CARRITO
// ======================================================

if (
    botonVerPedido
) {

    botonVerPedido
        .addEventListener(
            "click",
            function() {

                actualizarPedido();


                modalPedido.style.display =
                    "flex";


                const carritoFijo =
                    document.querySelector(
                        ".carrito"
                    );


                if (carritoFijo) {

                    carritoFijo.style.display =
                        "none";

                }

            }
        );

}

// ======================================================
// CERRAR CARRITO
// ======================================================

if (
    cerrarPedido
) {

    cerrarPedido
        .addEventListener(
            "click",
            function() {

                modalPedido.style.display =
                    "none";


                const carritoFijo =
                    document.querySelector(
                        ".carrito"
                    );


                if (carritoFijo) {

                    carritoFijo.style.display =
                        "flex";

                }

            }
        );

}
// ======================================================
// ABRIR RESUMEN DE CUENTA
// ======================================================

if (
    abrirResumen
) {

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

if (
    cerrarResumen
) {

    cerrarResumen.addEventListener(
        "click",
        function() {

            modalResumen.style.display =
                "none";

        }
    );

}


// ======================================================
// CERRAR RESUMEN TOCANDO AFUERA
// ======================================================

if (
    modalResumen
) {

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


                // ==================================================
                // REINICIAR MÉTODOS DE PAGO
                // ==================================================

                if (
                    metodoPagoSelect
                ) {

                    metodoPagoSelect.innerHTML =
                        `
                        <option value="">
                            Selecciona un método
                        </option>
                        `;

                }


                // ==================================================
                // PARA LLEVAR
                // ==================================================

                if (
                    servicioSeleccionado ===
                    "llevar"
                ) {

                    if (
                        metodoPagoSelect
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

                    }


                    if (
                        textoServicio
                    ) {

                        textoServicio.textContent =
                            "🛍 Para llevar";

                    }

                }


                // ==================================================
                // A DOMICILIO
                // ==================================================

                if (
                    servicioSeleccionado ===
                    "domicilio"
                ) {

                    if (
                        metodoPagoSelect
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

                    }


                    if (
                        textoServicio
                    ) {

                        textoServicio.textContent =
                            "🛵 A domicilio";

                    }

                }


                actualizarDatosEfectivo();


                if (
                    modalInformacion
                ) {

                    modalInformacion.style.display =
                        "flex";

                }

            }
        );

    }
);


// ======================================================
// REGRESAR DESDE INFORMACIÓN
// ======================================================

if (
    volverInfo
) {

    volverInfo.addEventListener(
        "click",
        function() {

            modalInformacion.style.display =
                "none";

        }
    );

}


// ======================================================
// CERRAR INFORMACIÓN CON X
// ======================================================

if (
    cerrarInfo
) {

    cerrarInfo.addEventListener(
        "click",
        function() {

            modalInformacion.style.display =
                "none";

        }
    );

}


// ======================================================
// MÉTODO DE PAGO
// ======================================================

if (
    metodoPagoSelect
) {

    metodoPagoSelect
        .addEventListener(
            "change",
            actualizarDatosEfectivo
        );

}


// ======================================================
// MOSTRAR CAMPO "PAGA CON"
// ======================================================

function actualizarDatosEfectivo() {

    if (
        !datosEfectivo
    ) {

        return;

    }


    if (
        servicioSeleccionado ===
            "domicilio" &&
        metodoPagoSelect &&
        metodoPagoSelect.value ===
            "Efectivo"
    ) {

        datosEfectivo.style.display =
            "block";

    } else {

        datosEfectivo.style.display =
            "none";


        if (
            pagaConInput
        ) {

            pagaConInput.value =
                "";

        }

    }

}


// ======================================================
// CONTINUAR DESDE INFORMACIÓN
// ======================================================

if (
    continuarInfo
) {

    continuarInfo.addEventListener(
        "click",
        function() {

            const nombreCliente =
                document.getElementById(
                    "nombre-cliente"
                );


            const telefonoCliente =
                document.getElementById(
                    "telefono-cliente"
                );


            const nombre =
                nombreCliente
                    ?
                    nombreCliente
                        .value
                        .trim()
                    :
                    "";


            const telefono =
                telefonoCliente
                    ?
                    telefonoCliente
                        .value
                        .trim()
                    :
                    "";


            const metodoPago =
                metodoPagoSelect
                    ?
                    metodoPagoSelect.value
                    :
                    "";


            // ==================================================
            // VALIDAR NOMBRE
            // ==================================================

            if (
                nombre === ""
            ) {

                alert(
                    "Por favor escribe tu nombre."
                );

                return;

            }


            // ==================================================
            // VALIDAR TELÉFONO
            // ==================================================

            if (
                telefono === ""
            ) {

                alert(
                    "Por favor escribe tu teléfono."
                );

                return;

            }


            // ==================================================
            // VALIDAR MÉTODO DE PAGO
            // ==================================================

            if (
                metodoPago === ""
            ) {

                alert(
                    "Selecciona un método de pago."
                );

                return;

            }


            // ==================================================
            // DOMICILIO + EFECTIVO
            // ==================================================

            if (
                servicioSeleccionado ===
                    "domicilio" &&
                metodoPago ===
                    "Efectivo"
            ) {

                const pagaCon =
                    pagaConInput
                        ?
                        pagaConInput.value
                        :
                        "";


                if (
                    pagaCon === ""
                ) {

                    alert(
                        "Indica con cuánto vas a pagar."
                    );

                    return;

                }


               const totalFinal =
    obtenerTotalFinal();


                if (
                    Number(
                        pagaCon
                    ) <
                    totalFinal
                ) {

                    alert(
                        "El monto con el que pagarás no puede ser menor al total del pedido."
                    );

                    return;

                }

            }


            // ==================================================
            // PARA LLEVAR
            // ==================================================

            if (
                servicioSeleccionado ===
                "llevar"
            ) {

                enviarPedidoWhatsApp();

                return;

            }


            // ==================================================
            // DOMICILIO
            // ==================================================

            if (
                servicioSeleccionado ===
                "domicilio"
            ) {

                modalInformacion
                    .style
                    .display =
                    "none";


                modalDireccion
                    .style
                    .display =
                    "flex";


                actualizarBotonContinuarDireccion();

            }

        }
    );

}


// ======================================================
// ESTADO DEL BOTÓN CONTINUAR DIRECCIÓN
// ======================================================

function actualizarBotonContinuarDireccion() {

    if (
        !continuarDireccion
    ) {

        return;

    }


    const direccionLista =
        direccionValidaCoacalco ===
        true;


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

        textoDireccionSeleccionada
            .textContent =
            direccion;


        direccionSeleccionada
            .style
            .display =
            "block";

    }


    if (
        resultadosDireccion
    ) {

        resultadosDireccion.innerHTML =
            "";

    }


    actualizarBotonContinuarDireccion();

}


// ======================================================
// OCULTAR DIRECCIÓN SELECCIONADA
// ======================================================

function ocultarDireccionSeleccionada() {

    if (
        direccionSeleccionada
    ) {

        direccionSeleccionada.style.display =
            "none";

    }


    if (
        textoDireccionSeleccionada
    ) {

        textoDireccionSeleccionada.textContent =
            "";

    }


    actualizarBotonContinuarDireccion();

}


// ======================================================
// CAMBIAR DIRECCIÓN
// ======================================================

if (
    cambiarDireccion
) {

    cambiarDireccion.addEventListener(
        "click",
        function() {

            direccionValidaCoacalco =
                false;


            latitudCliente =
                null;


            longitudCliente =
                null;


            usoUbicacionActual =
                false;


            direccionUbicacionActual =
                "";


            ocultarDireccionSeleccionada();


            if (
                calleInput
            ) {

                calleInput.value =
                    "";

                calleInput.focus();

            }

        }
    );

}


// ======================================================
// REGRESAR DESDE DIRECCIÓN
// ======================================================

if (
    volverDireccion
) {

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

if (
    botonUbicacionActual
) {

    botonUbicacionActual.addEventListener(
        "click",
        function() {

            if (
                !navigator.geolocation
            ) {

                estadoUbicacion.textContent =
                    "❌ Tu navegador no permite obtener la ubicación.";

                return;

            }


            estadoUbicacion.textContent =
                "📍 Verificando tu ubicación...";


            navigator.geolocation
                .getCurrentPosition(

                    async function(
                        posicion
                    ) {

                        const latitud =
                            posicion
                                .coords
                                .latitude;


                        const longitud =
                            posicion
                                .coords
                                .longitude;


                        const precision =
                            posicion
                                .coords
                                .accuracy;


                        try {

                            // ======================================
                            // CONVERTIR GPS A DIRECCIÓN
                            // ======================================

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
                                await fetch(
                                    url
                                );


                            if (
                                !respuesta.ok
                            ) {

                                throw new Error(
                                    "No se pudo verificar la ubicación."
                                );

                            }


                            const datos =
                                await respuesta
                                    .json();


                            const direccion =
                                datos.address ||
                                {};


                            // ======================================
                            // BUSCAR COACALCO EN LA DIRECCIÓN
                            // ======================================

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
                                    .filter(
                                        Boolean
                                    )
                                    .join(
                                        " "
                                    )
                                    .normalize(
                                        "NFD"
                                    )
                                    .replace(
                                        /[\u0300-\u036f]/g,
                                        ""
                                    )
                                    .toLowerCase();


                            console.log(
                                "Zona GPS detectada:",
                                zona
                            );


                            // ======================================
                            // FUERA DE COACALCO
                            // ======================================

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


                            // ======================================
                            // UBICACIÓN VÁLIDA
                            // ======================================

                            latitudCliente =
                                latitud;


                            longitudCliente =
                                longitud;


                            usoUbicacionActual =
                                true;


                            direccionValidaCoacalco =
                                true;


                            direccionUbicacionActual =
                                datos.display_name ||
                                "";


                            if (
                                calleInput
                            ) {

                                calleInput.value =
                                    "";

                            }


                            mostrarDireccionSeleccionada(
                                direccionUbicacionActual ||
                                "Ubicación actual"
                            );


                            estadoUbicacion.textContent =
                                `✅ Ubicación válida dentro de Coacalco (precisión aproximada: ${Math.round(precision)} metros)`;


                            actualizarBotonContinuarDireccion();

                        } catch (
                            error
                        ) {

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

                        console.error(
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
                            "❌ No se pudo obtener tu ubicación.";


                        actualizarBotonContinuarDireccion();

                    },


                    {
                        enableHighAccuracy:
                            true,

                        timeout:
                            15000,

                        maximumAge:
                            0
                    }

                );

        }
    );

}


// ======================================================
// FIN DE LA PARTE 2 DE 3
// ======================================================

// ======================================================
// ANGUILA SUSHI - SCRIPT PRINCIPAL
// PARTE 3 DE 3
// ======================================================


// ======================================================
// GOOGLE PLACES
// AUTOCOMPLETADO DE DIRECCIÓN
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
        libreriaPlaces
            .AutocompleteSuggestion;


    AutocompleteSessionTokenGoogle =
        libreriaPlaces
            .AutocompleteSessionToken;


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

    if (
        !resultadosDireccion
    ) {

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


        if (
            !tokenGoogle
        ) {

            crearNuevoTokenGoogle();

        }


        // ==============================================
        // PETICIÓN
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
            respuesta.suggestions ||
            [];


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
            .slice(
                0,
                5
            )
            .forEach(
                function(
                    sugerencia
                ) {

                    const prediccion =
                        sugerencia
                            .placePrediction;


                    if (
                        !prediccion
                    ) {

                        return;

                    }


                    const botonResultado =
                        document
                            .createElement(
                                "button"
                            );


                    botonResultado.type =
                        "button";


                    botonResultado.className =
                        "resultado-direccion";


                    botonResultado.textContent =
                        "📍 " +
                        prediccion
                            .text
                            .toString();


                    // ==================================
                    // SELECCIONAR DIRECCIÓN
                    // ==================================

                    botonResultado
                        .addEventListener(
                            "click",
                            async function() {

                                resultadosDireccion
                                    .innerHTML =
                                    `
                                    <p class="mensaje-direccion">
                                        📍 Verificando dirección...
                                    </p>
                                    `;


                                try {

                                    const lugar =
                                        prediccion
                                            .toPlace();


                                    await lugar
                                        .fetchFields(
                                            {

                                                fields:
                                                    [

                                                        "formattedAddress",

                                                        "location"

                                                    ]

                                            }
                                        );


                                    // ==========================
                                    // SIN COORDENADAS
                                    // ==========================

                                    if (
                                        !lugar.location
                                    ) {

                                        throw new Error(
                                            "La dirección no tiene coordenadas."
                                        );

                                    }


                                    const direccionCompleta =
                                        lugar
                                            .formattedAddress ||
                                        prediccion
                                            .text
                                            .toString();


                                    // ==========================
                                    // NORMALIZAR DIRECCIÓN
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


                                    // ==========================
                                    // VERIFICAR COACALCO
                                    // ==========================

                                    if (
                                        !direccionNormalizada
                                            .includes(
                                                "coacalco"
                                            )
                                    ) {

                                        if (
                                            calleInput
                                        ) {

                                            calleInput.value =
                                                "";

                                        }


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


                                        resultadosDireccion
                                            .innerHTML =
                                            "";


                                        ocultarDireccionSeleccionada();


                                        if (
                                            estadoUbicacion
                                        ) {

                                            estadoUbicacion
                                                .textContent =
                                                "❌ Esa dirección está fuera de Coacalco.";

                                        }


                                        actualizarBotonContinuarDireccion();


                                        return;

                                    }


                                    // ==========================
                                    // DIRECCIÓN CORRECTA
                                    // ==========================

                                    if (
                                        calleInput
                                    ) {

                                        calleInput.value =
                                            direccionCompleta;

                                    }


                                    latitudCliente =
                                        lugar
                                            .location
                                            .lat();


                                    longitudCliente =
                                        lugar
                                            .location
                                            .lng();


                                    usoUbicacionActual =
                                        false;


                                    direccionValidaCoacalco =
                                        true;


                                    direccionUbicacionActual =
                                        "";


                                    resultadosDireccion
                                        .innerHTML =
                                        "";


                                    mostrarDireccionSeleccionada(
                                        direccionCompleta
                                    );


                                    if (
                                        estadoUbicacion
                                    ) {

                                        estadoUbicacion
                                            .textContent =
                                            "";

                                    }


                                    actualizarBotonContinuarDireccion();


                                    // Nuevo token para
                                    // la próxima búsqueda.

                                    crearNuevoTokenGoogle();

                                } catch (
                                    error
                                ) {

                                    console.error(
                                        "Error al seleccionar dirección:",
                                        error
                                    );


                                    resultadosDireccion
                                        .innerHTML =
                                        "";


                                    direccionValidaCoacalco =
                                        false;


                                    latitudCliente =
                                        null;


                                    longitudCliente =
                                        null;


                                    usoUbicacionActual =
                                        false;


                                    direccionUbicacionActual =
                                        "";


                                    ocultarDireccionSeleccionada();


                                    if (
                                        estadoUbicacion
                                    ) {

                                        estadoUbicacion
                                            .textContent =
                                            "❌ No pudimos verificar esa dirección.";

                                    }


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


    } catch (
        error
    ) {

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

if (
    calleInput
) {

    calleInput.addEventListener(
        "input",
        function() {

            const direccion =
                calleInput
                    .value
                    .trim();


            // ==========================================
            // AL MODIFICAR LA DIRECCIÓN,
            // LA ANTERIOR DEJA DE SER VÁLIDA
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


            if (
                estadoUbicacion
            ) {

                estadoUbicacion.textContent =
                    "";

            }


            ocultarDireccionSeleccionada();


            actualizarBotonContinuarDireccion();


            clearTimeout(
                temporizadorDireccion
            );


            // ==========================================
            // MÍNIMO 3 CARACTERES
            // ==========================================

            if (
                direccion.length <
                3
            ) {

                if (
                    resultadosDireccion
                ) {

                    resultadosDireccion
                        .innerHTML =
                        "";

                }


                return;

            }


            // ==========================================
            // ESPERAR 500 MS
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
// BUSCAR CON BOTÓN DE LUPA
// ======================================================

if (
    botonBuscarDireccion
) {

    botonBuscarDireccion
        .addEventListener(
            "click",
            function() {

                if (
                    !calleInput
                ) {

                    return;

                }


                const direccion =
                    calleInput
                        .value
                        .trim();


                if (
                    direccion.length <
                    3
                ) {

                    alert(
                        "Escribe al menos 3 caracteres."
                    );

                    return;

                }


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
// CONTINUAR DESDE DIRECCIÓN
// ======================================================

if (
    continuarDireccion
) {

    continuarDireccion
        .addEventListener(
            "click",
            function() {

                const direccionManual =
                    calleInput
                        ?
                        calleInput
                            .value
                            .trim()
                        :
                        "";


                // ==========================================
                // SIN DIRECCIÓN
                // ==========================================

                if (
                    direccionManual ===
                        "" &&
                    usoUbicacionActual ===
                        false
                ) {

                    alert(
                        "Escribe tu dirección o comparte tu ubicación actual."
                    );

                    return;

                }


                // ==========================================
                // DIRECCIÓN ESCRITA
                // PERO NO SELECCIONADA
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
    


    // ==================================================
    // DATOS DEL CLIENTE
    // ==================================================

    const nombreCliente =
        document.getElementById(
            "nombre-cliente"
        );


    const telefonoCliente =
        document.getElementById(
            "telefono-cliente"
        );


    const cubiertosSelect =
        document.getElementById(
            "cubiertos"
        );


    const comentariosGenerales =
        document.getElementById(
            "comentarios"
        );


    const nombre =
        nombreCliente
            ?
            nombreCliente
                .value
                .trim()
            :
            "";


    const telefono =
        telefonoCliente
            ?
            telefonoCliente
                .value
                .trim()
            :
            "";


    const soya =
        tipoSoya
            ?
            tipoSoya.value
            :
            "";


    const cubiertos =
        cubiertosSelect
            ?
            cubiertosSelect.value
            :
            "";


    const metodoPago =
        metodoPagoSelect
            ?
            metodoPagoSelect.value
            :
            "";


    const comentarios =
        comentariosGenerales
            ?
            comentariosGenerales
                .value
                .trim()
            :
            "";

const costoEntrega =
    obtenerCostoEntrega();

const descuento2x1 =
    obtenerDescuento2x1();

const totalProductosConPromo =
    obtenerTotalProductosConPromo();

const totalFinal =
    obtenerTotalFinal();
    const costoCharola =
    obtenerCostoCharola();

const tieneCortesiaCharola =
    tieneRolloCortesiaCharola();


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
        // GPS
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
                latitudCliente !==
                    null &&
                longitudCliente !==
                    null
            ) {

                mensaje +=
                    `🗺️ Ubicación: https://www.google.com/maps?q=${latitudCliente},${longitudCliente}\n`;

            }

        }


        // ==============================================
        // GOOGLE PLACES
        // ==============================================

        else {

            const direccionManual =
                calleInput
                    ?
                    calleInput
                        .value
                        .trim()
                    :
                    "";


            mensaje +=
                `📍 Dirección: ${direccionManual}\n`;


            if (
                latitudCliente !==
                    null &&
                longitudCliente !==
                    null
            ) {

                mensaje +=
                    `🗺️ Ubicación: https://www.google.com/maps?q=${latitudCliente},${longitudCliente}\n`;

            }

        }

    }
// ==================================================
// CHAROLA
// ==================================================

if (
    charolaSeleccionada
) {

    mensaje +=
        "🍱 Presentación: Charola\n";


    if (
        costoCharola > 0
    ) {

        mensaje +=
            `💵 Costo de charola: $${costoCharola}\n`;

    } else {

        mensaje +=
            "💵 Charola: Sin costo adicional\n";

    }


    if (
        tieneCortesiaCharola
    ) {

        mensaje +=
            "🎁 Cortesía: 1 rollo elegido por cocina\n";

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
            pagaConInput
                ?
                Number(
                    pagaConInput.value
                )
                :
                0;


        mensaje +=
            `💵 Pagará con: $${pagaCon}\n`;

    }


    // ==================================================
    // COMENTARIOS GENERALES
    // ==================================================

    if (
        comentarios !==
        ""
    ) {

        mensaje +=
            `📝 Comentarios generales: ${comentarios}\n`;

    }


   // ==================================================
// PRODUCTOS
// ==================================================

mensaje +=
    "\n🛒 *PEDIDO*\n\n";


// Saber cuáles unidades quedaron gratis por el 2x1
const gratisPorProductoWhatsApp =
    obtenerRollosGratis2x1();


for (
    let claveProducto in pedido
) {

    const producto =
        pedido[
            claveProducto
        ];


    const nombreMostrar =
        producto.nombre ||
        claveProducto;


    // Cuántas unidades de este producto
    // quedaron gratis por la promoción
    const unidadesGratis =
        gratisPorProductoWhatsApp[
            claveProducto
        ] || 0;


    // Cuántas sí se cobran
    const unidadesPagadas =
        producto.cantidad -
        unidadesGratis;


    // ==============================================
    // UNIDADES GRATIS - PRECIO TACHADO
    // ==============================================

    if (
        unidadesGratis > 0
    ) {

        const subtotalGratis =
            producto.precio *
            unidadesGratis;

        mensaje +=
            `🎁 ${nombreMostrar} x${unidadesGratis} - ~$${subtotalGratis}~\n`;

    }


    // ==============================================
    // UNIDADES QUE SÍ SE COBRAN
    // ==============================================

    if (
        unidadesPagadas > 0
    ) {

        const subtotalPagado =
            producto.precio *
            unidadesPagadas;

        mensaje +=
            `${nombreMostrar} x${unidadesPagadas} - $${subtotalPagado}\n`;

    }


    // ==============================================
    // COMENTARIO DEL ROLLO
    // ==============================================

    if (
        producto.comentario &&
        producto.comentario !==
            ""
    ) {

        mensaje +=
            `   📝 Nota: ${producto.comentario}\n`;

    }

}
// ==================================================
// PROMOCIÓN 2X1
// ==================================================

if (
    promo2x1Activa &&
    descuento2x1 > 0
) {

    mensaje +=
        `\n🎉 *PROMOCIÓN 2X1*\n`;

    mensaje +=
        `Subtotal productos: $${totalCarrito}\n`;

    mensaje +=
        `Descuento 2x1: -$${descuento2x1}\n`;

    mensaje +=
        `Subtotal con promoción: $${totalProductosConPromo}\n`;

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
    "525538927316";


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
// INICIAR PÁGINA
// ======================================================

actualizarPedido();

actualizarDatosEfectivo();

actualizarBotonContinuarDireccion();

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Cargar estado inicial
        cargarConfiguracionTienda();


        // Escuchar cambios sin recargar
       escucharConfiguracionEnTiempoReal();

       const botonCerrarTienda =
    document.getElementById(
        "cerrar-modal-tienda-cerrada"
    );

const botonAceptarTienda =
    document.getElementById(
        "aceptar-modal-tienda-cerrada"
    );

const overlayTienda =
    document.querySelector(
        ".modal-tienda-cerrada__overlay"
    );


if (botonCerrarTienda) {

    botonCerrarTienda.addEventListener(
        "click",
        cerrarModalTiendaCerrada
    );

}


if (botonAceptarTienda) {

    botonAceptarTienda.addEventListener(
        "click",
        cerrarModalTiendaCerrada
    );

}


if (overlayTienda) {

    overlayTienda.addEventListener(
        "click",
        cerrarModalTiendaCerrada
    );

}

    }
);
// ======================================================
// VENTANA PROMOCIÓN DEL DÍA
// ======================================================

function actualizarPopupPromo() {

    const modalPromo2x1 =
        document.getElementById(
            "modal-promo-dia"
        );

    const modalPromoCharola =
        document.getElementById(
            "modal-promo-charola"
        );


    // Cerrar ambos antes de decidir cuál mostrar

    if (modalPromo2x1) {

        modalPromo2x1.classList.remove(
            "activa"
        );

    }


    if (modalPromoCharola) {

        modalPromoCharola.classList.remove(
            "activa"
        );

    }


    // Si la tienda está cerrada,
    // no mostramos promociones

    if (!tiendaAbierta) {

        return;

    }


    // ==================================================
    // PROMOCIÓN 2X1
    // ==================================================

    if (promo2x1Activa) {

        if (modalPromo2x1) {

            modalPromo2x1.classList.add(
                "activa"
            );

        }

        return;

    }


    // ==================================================
    // PROMOCIÓN CHAROLA
    // ==================================================
    // TEMPORALMENTE SIN VALIDAR EL DÍA
    // PARA QUE PODAMOS PROBARLA AHORA

    if (promoCharolaActiva) {

        if (modalPromoCharola) {

            modalPromoCharola.classList.add(
                "activa"
            );

        }

    }

}


// ======================================================
// CERRAR VENTANAS DE PROMOCIÓN
// ======================================================

document.addEventListener(
    "click",
    function(evento) {

        const modalPromo2x1 =
            document.getElementById(
                "modal-promo-dia"
            );

        const modalPromoCharola =
            document.getElementById(
                "modal-promo-charola"
            );


        // CERRAR 2X1 CON LA X

        if (
            evento.target.closest(
                "#cerrar-promo-dia"
            )
        ) {

            if (modalPromo2x1) {

                modalPromo2x1.classList.remove(
                    "activa"
                );

            }

            return;

        }


        // CERRAR CHAROLA CON LA X

        if (
            evento.target.closest(
                "#cerrar-promo-charola"
            )
        ) {

            if (modalPromoCharola) {

                modalPromoCharola.classList.remove(
                    "activa"
                );

            }

            return;

        }


        // CERRAR 2X1 TOCANDO FUERA

        if (
            modalPromo2x1 &&
            evento.target === modalPromo2x1
        ) {

            modalPromo2x1.classList.remove(
                "activa"
            );

            return;

        }


        // CERRAR CHAROLA TOCANDO FUERA

        if (
            modalPromoCharola &&
            evento.target === modalPromoCharola
        ) {

            modalPromoCharola.classList.remove(
                "activa"
            );

        }

    }
);

// ======================================================
// BOTÓN SUPERIOR - VER MI PEDIDO
// ======================================================

document.addEventListener(
    "click",
    function(evento) {

        const botonSuperior =
            evento.target.closest(
                "#ver-pedido-superior"
            );


        if (!botonSuperior) {
            return;
        }


        actualizarPedido();


        if (modalPedido) {

            modalPedido.style.display =
                "flex";

        }

    }
);


// ======================================================
// BOTÓN DE CHAROLA
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const botonCharola =
            document.getElementById(
                "btn-charola"
            );


        if (botonCharola) {

            botonCharola.addEventListener(
                "click",
                function() {

                    if (!charolaDisponible()) {
                        return;
                    }


                    charolaSeleccionada =
                        !charolaSeleccionada;


                    actualizarPedido();

                }
            );

        }


        actualizarOpcionCharola();

    }
);
// ======================================================
// FIN DEL SCRIPT
// ANGUILA SUSHI
// ======================================================