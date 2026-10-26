/* ANGUILA SUSHI — Navegación por categorías, modo de prueba
 * Muestra una sola categoría del menú a la vez.
 * Conserva la estructura actual, los productos, carrito, Supabase y buscador.
 * No edites script.js ni barra-menu.js para instalar esta prueba.
 */
(() => {
  'use strict';

  const iniciar = () => {
    const principal = document.querySelector('main');
    if (!principal) return;

    // Secciones principales con identificador: Entradas, Arroces, Rollos, etc.
    const secciones = [...principal.querySelectorAll(':scope > section.menu[id]')];
    if (!secciones.length) return;

    const mapa = new Map();
    secciones.forEach((seccion) => {
      mapa.set(seccion.id, { seccion, grupo: null });
      // También reconoce destinos internos de enlaces: Clásicos, Empanizados, etc.
      seccion.querySelectorAll('[id]').forEach((elemento) => {
        const grupo = elemento.closest('.grupo-rollos');
        mapa.set(elemento.id, { seccion, grupo });
      });
    });

    const rollos = document.getElementById('rollos');
    const gruposRollos = rollos ? [...rollos.querySelectorAll(':scope > .grupo-rollos')] : [];

    const elegir = (id, desplazar = true) => {
      if (id === "capeados-rollos") {
    id = "empanizados-rollos";
}
      const destino = mapa.get(id) || mapa.get('entradas') || { seccion: secciones[0], grupo: null };
      const { seccion, grupo } = destino;

      // Oculta solamente otros apartados del menú, no la portada, los modales ni el carrito.
      secciones.forEach((item) => {
        if (item === seccion) {
          item.style.removeProperty('display');
          item.removeAttribute('aria-hidden');
        } else {
          item.style.setProperty('display', 'none', 'important');
          item.setAttribute('aria-hidden', 'true');
        }
      });

      // Cuando se selecciona un subgrupo de Rollos, evita que aparezcan los siguientes.
      // Al seleccionar "Rollos" completo, se recuperan todos sus subgrupos.
      
gruposRollos.forEach((item) => {

    const mostrarJuntos =
        grupo?.id === "empanizados-rollos" &&
        (
            item.id === "empanizados-rollos" ||
            item.id === "capeados-rollos"
        );

    if (
        seccion === rollos &&
        grupo &&
        item !== grupo &&
        !mostrarJuntos
    ) {
        item.style.setProperty(
            "display",
            "none",
            "important"
        );
    } else {
        item.style.removeProperty("display");
    }

});


      // Actualiza una marca accesible en la barra horizontal (sin cambiar su diseño).
      document.querySelectorAll('.lista-categorias a[href^="#"], .barra-menu-fija a[href^="#"]').forEach((link) => {
        if (link.getAttribute('href') === `#${id}`) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });

      // Sitúa al usuario en el encabezado del apartado, bajo la barra fija.
      if (desplazar) {
        requestAnimationFrame(() => {
          seccion.style.scrollMarginTop = '78px';
          seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    };

    const extraerId = (enlace) => {
      if (!enlace || !enlace.hash) return null;
      try { return decodeURIComponent(enlace.hash.slice(1)); }
      catch (_) { return enlace.hash.slice(1); }
    };

    // Funciona con los enlaces actuales y los que genera barra-menu.js.
    document.addEventListener('click', (evento) => {
      const enlace = evento.target.closest('a[href^="#"]');
      if (!enlace) return;
      const id = extraerId(enlace);
      if (!mapa.has(id)) return;
      evento.preventDefault();
      history.pushState(null, '', `#${encodeURIComponent(id)}`);
      elegir(id);
    }, true);

    // Permite enlaces directos, búsqueda con enlaces y botones Atrás/Adelante del navegador.
    const elegirDesdeUrl = () => {
      const id = extraerId(window.location);
      elegir(id || 'entradas');
    };
    window.addEventListener('hashchange', elegirDesdeUrl);
    window.addEventListener('popstate', elegirDesdeUrl);

    const inicial = extraerId(window.location) || 'entradas';
    elegir(inicial, Boolean(window.location.hash));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }
})();
