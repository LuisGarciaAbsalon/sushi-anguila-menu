/* ANGUILA SUSHI — Control de productos y variantes en el menú.
   Cargar DESPUÉS de script.js; usa el catálogo y la tabla de Supabase. */
(() => {
  'use strict';
  if (typeof supabaseClient === 'undefined') return;

  let catalogo = [];
  let estados = new Map();
  let listo = false;
  let consultaActual = null;
  let dibujando = false;

  function normalizar(valor) {
    return String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function activo(clave) { return listo && estados.get(clave) !== false; }
  function encontrarProducto(nombre) {
    const texto = String(nombre || '');
    return catalogo.find(p => p.nombre === texto) ||
      catalogo.find(p => texto.startsWith(p.nombre + ' (')) || null;
  }
  function permitido(nombreProducto, nombreOpcion = '') {
    const p = encontrarProducto(nombreProducto);
    if (!listo || (p && !activo(p.clave))) return false;
    if (!p || !nombreOpcion) return true;
    const opcion = (p.opciones || []).find(o => o.nombre === nombreOpcion);
    if (!opcion) return true;
    if (!activo(opcion.clave)) return false;
    if (opcion.nombre.includes(' · ')) {
      const base = opcion.nombre.split(' · ')[0];
      if (!activo(`${p.clave}--${normalizar(base)}`)) return false;
    }
    return true;
  }

  function tarjetas() {
    return document.querySelectorAll('main section.menu article.producto, .extras-pedido .extra-card');
  }
  function marcarTarjetas() {
    tarjetas().forEach(tarjeta => {
      const boton = tarjeta.querySelector('[data-nombre],[data-producto]');
      const nombre = boton?.dataset.producto || boton?.dataset.nombre ||
        tarjeta.querySelector('.producto-info h3, .extra-info strong')?.textContent.trim();
      if (!nombre) return;
      const permitidoProducto = permitido(nombre);
      tarjeta.classList.toggle('producto-agotado', listo && !permitidoProducto);
      tarjeta.classList.toggle('producto-verificando', !listo);
      tarjeta.querySelectorAll('button.agregar, button.abrir-opciones, button.abrir-opciones-dinamico')
        .forEach(b => {
          b.disabled = !permitidoProducto;
          b.setAttribute('aria-disabled', String(!permitidoProducto));
          b.title = !listo ? 'Comprobando disponibilidad' : permitidoProducto ? '' : 'Producto agotado';
        });
    });
  }

  function nombreDelModal() {
    return document.getElementById('titulo-opciones-producto')?.textContent.trim() || '';
  }

  function marcarOpciones() {
    const lista = document.getElementById('lista-opciones-producto');
    if (!lista) return;
    const nombreProducto = nombreDelModal();
    const producto = encontrarProducto(nombreProducto);
    if (!producto) return;
    lista.querySelectorAll(':scope > .opcion-producto').forEach(fila => {
      const nombre = fila.querySelector('.opcion-producto-info strong')?.textContent.trim();
      const radio = fila.querySelector('input[type=radio]');
      if (!nombre || !radio) return;
      const habilitado = permitido(nombreProducto, nombre);
      fila.classList.toggle('opcion-agotada', !habilitado);
      radio.disabled = !habilitado;
      let etiqueta = fila.querySelector('.estado-opcion-agotada');
      if (!habilitado && !etiqueta) {
        etiqueta = document.createElement('span');
        etiqueta.className = 'estado-opcion-agotada';
        etiqueta.textContent = 'AGOTADO';
        fila.querySelector('.opcion-producto-info')?.appendChild(etiqueta);
      }
      if (habilitado && etiqueta) etiqueta.remove();
      if (!habilitado && radio.checked) {
        radio.checked = false;
        fila.classList.remove('seleccionada');
        if (typeof opcionProductoActual !== 'undefined') opcionProductoActual = null;
        const confirmar = document.getElementById('confirmar-opcion-producto');
        if (confirmar) {
          confirmar.disabled = true;
          confirmar.textContent = 'Selecciona una opción disponible';
        }
      }
    });
  }

  function dibujar() {
    if (dibujando) return;
    dibujando = true;
    requestAnimationFrame(() => {
      dibujando = false;
      marcarTarjetas();
      marcarOpciones();
    });
  }

  async function recargar() {
    if (consultaActual) return consultaActual;
    consultaActual = (async () => {
      try {
        const { data, error } = await supabaseClient.from('disponibilidad_productos').select('clave,activo');
        if (error) throw error;
        estados = new Map((data || []).map(item => [item.clave, item.activo]));
        listo = true;
      } catch (error) {
        listo = false; // Por seguridad, bloquear pedidos si falla la consulta.
        console.error('Error verificando disponibilidad:', error);
      } finally {
        dibujar();
      }
    })();
    try { await consultaActual; } finally { consultaActual = null; }
  }

  // Validación fresca justo antes de abrir WhatsApp.
  window.validarProductosActivosAntesDeEnviar = async () => {
    if (!catalogo.length) {
      alert('No pudimos cargar el catálogo. Actualiza la página.');
      return false;
    }
    await recargar();
    if (!listo) {
      alert('No pudimos verificar los productos. Revisa tu conexión e inténtalo de nuevo.');
      return false;
    }
    if (typeof pedido === 'undefined') return true;
    const agotados = Object.values(pedido).filter(item => {
      const producto = encontrarProducto(item.nombre);
      if (!producto) return false;
      if (!permitido(producto.nombre)) return true;
      const principio = producto.nombre + ' (';
      if (!item.nombre.startsWith(principio)) return false;
      const opcion = item.nombre.slice(principio.length, -1);
      return !permitido(producto.nombre, opcion);
    });
    if (agotados.length) {
      alert('Estos productos u opciones están agotados:\n' +
        [...new Set(agotados.map(p => p.nombre))].map(n => '• ' + n).join('\n') +
        '\n\nElimínalos del carrito antes de continuar.');
      return false;
    }
    return true;
  };

  // Protección al hacer clic (además del disabled de la interfaz).
  document.addEventListener('click', evento => {
    const boton = evento.target.closest('button.agregar, button.abrir-opciones, button.abrir-opciones-dinamico');
    if (boton) {
      const nombre = boton.dataset.producto || boton.dataset.nombre ||
        boton.closest('article.producto')?.querySelector('.producto-info h3')?.textContent.trim();
      if (nombre && !permitido(nombre)) {
        evento.preventDefault(); evento.stopImmediatePropagation();
        alert('Este producto está agotado.');
        return;
      }
    }
    const sumar = evento.target.closest('.sumar');
    if (sumar && typeof pedido !== 'undefined') {
      const item = pedido[sumar.dataset.nombre];
      if (item) {
        const p = encontrarProducto(item.nombre);
        if (p) {
          const opcion = item.nombre.startsWith(p.nombre + ' (')
            ? item.nombre.slice(p.nombre.length + 2, -1) : '';
          if (!permitido(p.nombre, opcion)) {
            evento.preventDefault(); evento.stopImmediatePropagation();
            alert('Esta opción está agotada. Puedes quitarla del carrito.');
            return;
          }
        }
      }
    }
    const confirmar = evento.target.closest('#confirmar-opcion-producto');
    if (confirmar && typeof productoOpcionesActual !== 'undefined') {
      const opcion = typeof opcionProductoActual !== 'undefined' ? opcionProductoActual?.nombre : '';
      if (!permitido(productoOpcionesActual, opcion)) {
        evento.preventDefault(); evento.stopImmediatePropagation();
        alert('Este producto o esta opción está agotada.');
      }
    }
  }, true);

  async function iniciar() {
    marcarTarjetas();
    try {
      const respuesta = await fetch('./catalogo-productos.json', { cache: 'no-store' });
      if (!respuesta.ok) throw new Error('No se encontró catalogo-productos.json');
      catalogo = await respuesta.json();
      if (!Array.isArray(catalogo)) throw new Error('El catálogo no es válido');
    } catch (error) {
      console.error('No se puede cargar el catálogo:', error);
      return; // Mantener los controles bloqueados por seguridad.
    }
    await recargar();
    supabaseClient.channel('disponibilidad-productos-clientes-v2')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'disponibilidad_productos' }, recargar)
      .subscribe();
    document.addEventListener('visibilitychange', () => { if (!document.hidden) recargar(); });
    setInterval(() => { if (!document.hidden) recargar(); }, 30000);
    const principal = document.querySelector('main');
    if (principal) new MutationObserver(dibujar).observe(principal, { childList: true, subtree: true });
    const opciones = document.getElementById('lista-opciones-producto');
    if (opciones) new MutationObserver(dibujar).observe(opciones, { childList: true });
  }
  iniciar();
})();
