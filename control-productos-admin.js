/* ANGUILA SUSHI — Control de productos y variantes desde Supabase.
   Se carga después de admin.js. No sustituye ninguna función existente. */
(() => {
  'use strict';
  const panel = document.getElementById('panel-admin');
  const mensajeAdmin = document.getElementById('mensaje-admin');
  if (!panel || !mensajeAdmin || typeof supabaseClient === 'undefined') return;

  const tarjeta = document.createElement('article');
  tarjeta.className = 'admin-card';
  tarjeta.innerHTML = `<div><span class="admin-etiqueta">CATÁLOGO</span>
    <h2>Administrar productos</h2>
    <p class="estado-admin">Activa o desactiva platillos y sus proteínas u opciones.</p></div>
    <button type="button" id="abrir-productos-admin" class="boton-control boton-rojo">Configurar productos</button>`;
  mensajeAdmin.before(tarjeta);

  const modal = document.createElement('dialog');
  modal.className = 'admin-productos-modal';
  modal.setAttribute('aria-labelledby', 'titulo-disponibilidad-admin');
  modal.innerHTML = `<div class="admin-productos-interior">
  <div class="admin-productos-cabecera">
    <div class="admin-productos-heading">
<span class="admin-productos-kicker">ANGUILA SUSHI</span>
     <h2 id="titulo-disponibilidad-admin">Productos</h2>
    </div>
    <button type="button" class="admin-productos-cerrar" aria-label="Cerrar ventana">&times;</button>
  </div>
  <div class="admin-productos-filtros">
      <label class="admin-productos-busqueda" for="filtrar-productos-admin">
        <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m16 16 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input type="search" id="filtrar-productos-admin" placeholder="Buscar platillo o proteína..." aria-label="Buscar platillo o proteína">
      </label>
    </div>
    <div class="admin-productos-lista" id="lista-productos-admin"></div>
    <div class="admin-productos-pie">
      <span class="admin-productos-contador" id="contador-productos-admin"></span>
      <p class="admin-productos-estado" id="estado-productos-admin" role="status" aria-live="polite"></p>
    </div>
  </div>`;
  document.body.append(modal);

  const abrir = document.getElementById('abrir-productos-admin');
  const cerrar = modal.querySelector('.admin-productos-cerrar');
  const filtro = modal.querySelector('#filtrar-productos-admin');
  const lista = modal.querySelector('#lista-productos-admin');
  const estado = modal.querySelector('#estado-productos-admin');
  const contadorResultados = modal.querySelector('#contador-productos-admin');

  let catalogo = [];
  let estados = new Map();
  let catalogoCargado = false;
  let guardando = false;

  const escapar = valor => String(valor).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // Agrupar las presentaciones Normal/Especial bajo una sola proteína.
  function opcionesDe(producto) {
    const grupos = new Map();
    for (const opcion of producto.opciones || []) {
      const trozos = opcion.nombre.split(' · ');
      const nombreGrupo = trozos.length > 1 ? trozos[0] : opcion.nombre;
      let grupo = grupos.get(nombreGrupo);
      if (!grupo) {
        // Si tiene presentaciones, se guarda la clave de la proteína;
        // de otro modo, la clave exacta de la opción.
        const clave = trozos.length > 1
          ? `${producto.clave}--${normalizar(nombreGrupo)}` : opcion.clave;
        grupo = { nombre: nombreGrupo, clave, presentaciones: [] };
        grupos.set(nombreGrupo, grupo);
      }
      if (trozos.length > 1) grupo.presentaciones.push(trozos.slice(1).join(' · '));
    }
    return [...grupos.values()];
  }

  function normalizar(valor) {
    return String(valor).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  function estaActivo(clave) { return estados.get(clave) !== false; }

  async function cargar() {
    abrir.disabled = true;
    estado.dataset.tipo = '';
    estado.textContent = 'Cargando catálogo y disponibilidad...';
    contadorResultados.textContent = 'Cargando productos...';
    lista.replaceChildren();
    try {
      if (!catalogoCargado) {
        const respuesta = await fetch('./catalogo-productos.json', { cache: 'no-store' });
        if (!respuesta.ok) throw new Error('No se pudo abrir catalogo-productos.json');
        catalogo = await respuesta.json();
        if (!Array.isArray(catalogo)) throw new Error('Catálogo inválido');
        catalogo.sort((a,b) => a.categoria.localeCompare(b.categoria, 'es') || a.nombre.localeCompare(b.nombre, 'es'));
        catalogoCargado = true;
      }
      const { data, error } = await supabaseClient.from('disponibilidad_productos').select('clave,activo');
      if (error) throw error;
      estados = new Map((data || []).map(fila => [fila.clave, fila.activo]));
      mostrar();
    } catch (error) {
      console.error('Error del catálogo:', error);
      estado.dataset.tipo = 'error';
      estado.textContent = 'No se pudo cargar. Revisa el catálogo y la conexión con Supabase.';
    } finally { abrir.disabled = false; }
  }

  function filaHTML(clave, titulo, detalle, esOpcion = false) {
    const activo = estaActivo(clave);
    return `<label class="admin-producto-fila ${esOpcion ? 'admin-producto-variante' : ''} ${activo ? '' : 'agotado'}">
      <span class="admin-producto-texto"><strong>${escapar(titulo)}</strong>
      <small>${escapar(detalle)}</small></span>
      <span class="admin-producto-controles">
        <span class="admin-producto-badge ${activo ? 'disponible' : 'no-disponible'}">${activo ? 'Disponible' : 'Agotado'}</span>
        <input type="checkbox" role="switch" data-clave="${escapar(clave)}" ${activo ? 'checked' : ''}
          aria-label="${activo ? 'Desactivar' : 'Activar'} ${escapar(titulo)}">
      </span></label>`;
  }

  function mostrar() {
    if (guardando) return;
    const busqueda = filtro.value.trim().toLocaleLowerCase('es');
    const visibles = catalogo.filter(p =>
      !busqueda || `${p.nombre} ${p.categoria} ${(p.opciones || []).map(o => o.nombre).join(' ')}`
        .toLocaleLowerCase('es').includes(busqueda)
    );
    lista.innerHTML = visibles.map(p => {
      const opciones = opcionesDe(p);
      const subfilas = opciones.map(o => {
        const detalle = o.presentaciones.length
          ? `Proteína/opción · ${o.presentaciones.join(' y ')}` : 'Opción individual';
        return filaHTML(o.clave, o.nombre, detalle, true);
      }).join('');
      return `<div class="admin-producto-grupo">
        ${filaHTML(p.clave, p.nombre, p.categoria)}
        ${subfilas ? `<details class="admin-producto-opciones"><summary>Opciones individuales <span class="admin-opciones-numero">${opciones.length}</span></summary>
          <div class="admin-producto-sublista">${subfilas}</div></details>` : ''}</div>`;
    }).join('');
    if (!visibles.length) lista.innerHTML = '<p class="admin-productos-vacio">No encontramos platillos con esa búsqueda.</p>';
    contadorResultados.textContent = `Mostrando ${visibles.length} de ${catalogo.length} platillos`;
    estado.textContent = '';
    estado.dataset.tipo = '';
  }

  abrir.addEventListener('click', () => { modal.showModal(); cargar(); });
  cerrar.addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  filtro.addEventListener('input', mostrar);

  lista.addEventListener('change', async evento => {
    const control = evento.target.closest('input[data-clave]');
    if (!control || guardando) return;
    const clave = control.dataset.clave;
    const activo = control.checked;
    guardando = true;
    control.disabled = true;
    estado.dataset.tipo = '';
    estado.textContent = 'Guardando cambio...';
    try {
      const { error } = await supabaseClient.from('disponibilidad_productos').upsert({
        clave, activo, actualizado_en: new Date().toISOString()
      }, { onConflict: 'clave' });
      if (error) throw error;
      estados.set(clave, activo);
      const fila = control.closest('.admin-producto-fila');
      fila?.classList.toggle('agotado', !activo);
      const insignia = fila?.querySelector('.admin-producto-badge');
      if (insignia) {
        insignia.textContent = activo ? 'Disponible' : 'Agotado';
        insignia.classList.toggle('disponible', activo);
        insignia.classList.toggle('no-disponible', !activo);
      }
      control.setAttribute('aria-label', `${activo ? 'Desactivar' : 'Activar'} ${fila?.querySelector('strong')?.textContent || 'producto'}`);
      estado.dataset.tipo = 'exito';
      estado.textContent = '✓ Cambio guardado';
    } catch (error) {
      console.error('Error guardando la disponibilidad:', error);
      control.checked = !activo;
      estado.dataset.tipo = 'error';
      estado.textContent = 'No se guardó. Revisa los permisos del administrador.';
    } finally {
      control.disabled = false;
      guardando = false;
    }
  });
})();
