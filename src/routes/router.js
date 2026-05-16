// src/routes/router.js

import { initLogin }           from '../modules/home/login.controller.js';
import { initRegister }        from '../modules/home/register.controller.js';
import { initForgotPassword }  from '../modules/home/forgot-password.controller.js';
import { initResetPassword }   from '../modules/home/reset-password.controller.js';
import { initDashboard }       from '../modules/home/dashboard.controller.js';

// Referencia al contenedor principal
const app = document.querySelector('#app') || document.body;

/**
 * Navega a una ruta cambiando el hash de la URL.
 * @param {string} path - Ruta destino (ej: '/dashboard', '/login')
 */
export const navigateTo = (path) => {
  window.location.hash = `#${path}`;
};

/**
 * Parsea la ruta actual desde window.location.hash.
 * Ej: #/dashboard/usuarios → { path: '/dashboard', params: { seccion: 'usuarios' } }
 */
const parseRoute = () => {
  const hash = window.location.hash.slice(1) || '/login';
  const [path, queryString] = hash.split('?');
  const segments = path.split('/').filter(Boolean);

  // Para rutas tipo /dashboard/usuarios
  const basePath = segments.length > 0 ? `/${segments[0]}` : '/';
  const subPath  = segments[1] || null;

  return { path: basePath, seccion: subPath, fullPath: hash };
};

/**
 * Renderiza la vista correspondiente según la ruta actual.
 */
const router = () => {
  const { path, seccion } = parseRoute();

  // Limpiar contenido anterior
  app.innerHTML = '';

  switch (path) {
    // ─── Auth (públicas) ───
    case '/login':
      initLogin(app);
      break;

    case '/register':
      initRegister(app);
      break;

    case '/forgot-password':
      initForgotPassword(app);
      break;

    case '/reset-password':
      initResetPassword(app);
      break;

    // ─── Panel dinámico único ───
    case '/dashboard':
      initDashboard(app, () => navigateTo('/login'), seccion);
      break;

    // ─── Redirecciones de rutas viejas ───
    // Si alguien entra con /admin, /maestro o /estudiante, va al dashboard
    case '/admin':
    case '/maestro':
    case '/estudiante':
      navigateTo('/dashboard');
      break;

    // ─── Ruta por defecto ───
    default:
      // Si hay token, ir al dashboard; si no, al login
      const token = sessionStorage.getItem('accessToken') || sessionStorage.getItem('token');
      if (token) {
        navigateTo('/dashboard');
      } else {
        navigateTo('/login');
      }
      break;
  }
};

// Escuchar cambios de hash
window.addEventListener('hashchange', router);

// Cargar ruta inicial al abrir la app
document.addEventListener('DOMContentLoaded', router);