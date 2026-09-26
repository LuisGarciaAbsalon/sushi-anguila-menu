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
        nombre: "Kaklagüe Maky",
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
// CREAR PRODUCTOS FIJOS AUTOMÁTICAMENTE
// ======================================================
function renderizarProductosFijos(productos, idContenedor) {

    const contenedor =
        document.getElementById(idContenedor);

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    productos.forEach(function(producto) {

        const articulo =
            document.createElement("article");

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
                >
                `
                :
                `
                <div
                    class="producto-sin-imagen"
                    style="display:flex;"
                >
                    🍣
                </div>
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
                    $${producto.precio}
                </span>

            </div>


            <div class="producto-media">

                ${imagenProducto}

                <button
                    type="button"
                    class="agregar-producto-fijo agregar"
                    data-nombre="${producto.nombre}"
                    data-precio="${producto.precio}"
                    aria-label="Agregar ${producto.nombre}"
                >
                    +
                </button>

            </div>
            `;


        contenedor.appendChild(articulo);

    });

}
// ======================================================
// MOSTRAR ESPECIALIDADES Y EMPANIZADOS
// ======================================================
renderizarProductosFijos(
    especialidadesBarra,
    "especialidades-barra"
);


renderizarProductosFijos(
    rollosEmpanizados,
    "rollos-empanizados"
);


renderizarProductosFijos(
    rollosCapeados,
    "rollos-capeados"
);


renderizarProductosFijos(
    sushiBalls,
    "sushi-balls"
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
                            1

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
                    1

            };

        }


        actualizarPedido();

    }
);


// ======================================================
// ABRIR MODAL DE OPCIONES
// ======================================================

botonesAbrirOpciones.forEach(
    function(boton) {

        boton.addEventListener(
            "click",
            function() {

                const nombreProducto =
                    boton.dataset.producto;


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


                precioOpcionesProducto
                    .textContent =
                    "Selecciona una opción";


                confirmarOpcionProducto
                    .textContent =
                    "Selecciona una opción";


                confirmarOpcionProducto
                    .disabled =
                    true;


                listaOpcionesProducto
                    .innerHTML =
                    "";


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
                                        ".opcion-producto"
                                    )
                                    .forEach(
                                        function(item) {

                                            item
                                                .classList
                                                .remove(
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
                            1

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


// ======================================================
// COSTO DE ENTREGA
// ======================================================

function obtenerCostoEntrega() {

    if (
        servicioSeleccionado ===
        "domicilio"
    ) {

        return 30;

    }


    return 0;

}


// ======================================================
// ACTUALIZAR CARRITO
// ======================================================

function actualizarPedido() {

    if (contador) {

        contador.textContent =
            cantidadCarrito;

    }


    if (total) {

        total.textContent =
            totalCarrito;

    }


    if (totalModal) {

        totalModal.textContent =
            totalCarrito;

    }


    if (resumenCantidad) {

        resumenCantidad.textContent =
            cantidadCarrito;

    }


    if (resumenTotal) {

        resumenTotal.textContent =
            totalCarrito +
            obtenerCostoEntrega();

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
            "<p>Tu carrito está vacío.</p>";

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


        const subtotal =
            producto.precio *
            producto.cantidad;


        const nombreMostrar =
            producto.nombre ||
            claveProducto;


        const comentarioMostrar =
            producto.comentario || "";


        detallePedido.innerHTML +=
            `

            <div class="item-pedido">

                <div>

                    <strong>
                        ${nombreMostrar}
                    </strong>

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


    const costoEntrega =
        obtenerCostoEntrega();


    if (subtotalResumen) {

        subtotalResumen.textContent =
            totalCarrito;

    }


    if (entregaResumen) {

        entregaResumen.textContent =
            costoEntrega;

    }


    if (totalCuentaResumen) {

        totalCuentaResumen.textContent =
            totalCarrito +
            costoEntrega;

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
                    totalCarrito +
                    obtenerCostoEntrega();


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


    for (
        let claveProducto in pedido
    ) {

        const producto =
            pedido[
                claveProducto
            ];


        const subtotal =
            producto.precio *
            producto.cantidad;


        // IMPORTANTE:
        // usamos producto.nombre porque
        // algunos productos tienen una clave
        // interna codificada.

        const nombreMostrar =
            producto.nombre ||
            claveProducto;


        mensaje +=
            `${nombreMostrar} x${producto.cantidad} - $${subtotal}\n`;


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
// INICIAR PÁGINA
// ======================================================

actualizarPedido();

actualizarDatosEfectivo();

actualizarBotonContinuarDireccion();


// ======================================================
// FIN DEL SCRIPT
// ANGUILA SUSHI
// ======================================================