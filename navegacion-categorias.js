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

    if (
        seccion === rollos &&
        grupo &&
        item !== grupo
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

      
      // Seleccionar y centrar la categoría principal
      const carril = document.querySelector(
        '.barra-redisenada .carril-categorias'
      );

      const botones = [
        ...document.querySelectorAll(
          '.barra-redisenada .categoria-btn'
        )
      ];

      const seleccionada = botones.find(
        boton => boton.getAttribute('href') === `#${seccion.id}`
      );

      botones.forEach(boton => {
        const activa = boton === seleccionada;

        boton.classList.toggle('active', activa);

        if (activa) {
          boton.setAttribute('aria-current', 'true');
        } else {
          boton.removeAttribute('aria-current');
        }
      });

      if (carril && seleccionada) {
        requestAnimationFrame(() => {
          const rectBoton = seleccionada.getBoundingClientRect();
          const rectCarril = carril.getBoundingClientRect();

          const diferencia =
            (rectBoton.left + rectBoton.width / 2) -
            (rectCarril.left + rectCarril.width / 2);

          carril.scrollTo({
            left: carril.scrollLeft + diferencia,
            behavior: 'smooth'
          });
        });
      }

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


/* ==========================================
   FLECHAS Y SUBCATEGORÍAS ANGUILA SUSHI
   ========================================== */

(() => {
    const iniciarBarra = () => {

        const barra = document.querySelector('.barra-redisenada');
        if (!barra) return;

        const carril = barra.querySelector('.carril-categorias');
        const izquierda = barra.querySelector('.flecha-izquierda');
        const derecha = barra.querySelector('.flecha-derecha');

        // Mover la barra con las flechas
        izquierda.addEventListener('click', () => {
            carril.scrollBy({ left: -180, behavior: 'smooth' });
        });

        derecha.addEventListener('click', () => {
            carril.scrollBy({ left: 180, behavior: 'smooth' });
        });

        const actualizarFlechas = () => {
            izquierda.disabled = carril.scrollLeft <= 2;
            derecha.disabled =
                carril.scrollLeft >= carril.scrollWidth - carril.clientWidth - 2;
        };

        carril.addEventListener('scroll', actualizarFlechas, { passive: true });
        window.addEventListener('resize', actualizarFlechas);

        // Agregar las subcategorías dentro de Rollos
        const tituloRollos = document.querySelector('#rollos .titulo-rollos');

        if (tituloRollos && !document.querySelector('#rollos .submenu-rollos')) {
            const submenu = document.createElement('nav');
            submenu.className = 'submenu-rollos';
            submenu.setAttribute('aria-label', 'Tipos de rollos');

            submenu.innerHTML = `
                <a href="#rollos">Todos</a>
                <a href="#rollos-tradicionales">Tradicionales</a>
                <a href="#rollos-clasicos">Clásicos</a>
                <a href="#especialidades-rollos">Especialidades</a>
                <a href="#empanizados-rollos">Empanizados</a>
                <a href="#capeados-rollos">Capeados</a>
                <a href="#sushi-balls-rollos">Sushi Balls</a>
            `;

            tituloRollos.insertAdjacentElement('afterend', submenu);
        }

        // Mantener resaltada la categoría seleccionada
        const actualizarActivos = () => {
            const id = decodeURIComponent(location.hash.slice(1)) || 'entradas';
            const seccion = document.getElementById(id)?.closest('section.menu[id]');
            const principal = seccion?.id || 'entradas';

            barra.querySelectorAll('.categoria-btn').forEach(enlace => {
                enlace.classList.toggle(
                    'active',
                    enlace.getAttribute('href') === `#${principal}`
                );
            });

            document.querySelectorAll('.submenu-rollos a').forEach(enlace => {
                enlace.classList.toggle(
                    'active',
                    enlace.getAttribute('href') === `#${id}`
                );
            });
        };

        document.addEventListener('click', evento => {
            if (evento.target.closest('a[href^="#"]')) {
                requestAnimationFrame(actualizarActivos);
            }
        });

        window.addEventListener('hashchange', actualizarActivos);
        window.addEventListener('popstate', actualizarActivos);

        actualizarActivos();
        actualizarFlechas();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarBarra, { once: true });
    } else {
        iniciarBarra();
    }
})();

