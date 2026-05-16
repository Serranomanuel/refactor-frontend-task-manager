// src/main.js
import './style.css'
import { initLogin }           from './modules/home/login.controller.js';
import { initRegister }        from './modules/home/register.controller.js';
import { initForgotPassword }  from './modules/home/forgot-password.controller.js';
import { initResetPassword }   from './modules/home/reset-password.controller.js';
import { initDashboard }       from './modules/home/dashboard.controller.js';

const app = document.querySelector('#app');

// Router simple basado en hash
const router = () => {
  const hash = window.location.hash.slice(1) || '/login';
  const [path, query] = hash.split('?');
  const segments = path.split('/').filter(Boolean);
  
  const basePath = segments[0] ? `/${segments[0]}` : '/';
  const subPath  = segments[1] || null;

  app.innerHTML = '';

  switch (basePath) {
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
    case '/dashboard':
      initDashboard(app, () => navigateTo('/login'), subPath);
      break;
    // Redirecciones de rutas viejas
    case '/admin':
    case '/maestro':
    case '/estudiante':
      navigateTo('/dashboard');
      break;
    default:
      const token = sessionStorage.getItem('accessToken') || sessionStorage.getItem('token');
      token ? navigateTo('/dashboard') : navigateTo('/login');
      break;
  }
};

export const navigateTo = (path) => {
  window.location.hash = `#${path}`;
};

window.addEventListener('hashchange', router);
document.addEventListener('DOMContentLoaded', router);