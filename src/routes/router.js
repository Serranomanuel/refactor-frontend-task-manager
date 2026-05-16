import { routes } from './routes.js';

// Rutas que NO requieren autenticación
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export const navigateTo = (path) => {
    window.location.hash = '#' + path;
};

export const router = () => {
    const app  = document.querySelector('#app');
    const hash = window.location.hash;
    const path = (hash ? hash.slice(1).split('?')[0] : '/login').toLowerCase() || '/login';

    // Verificar autenticación para rutas privadas
    const isPublic = publicRoutes.some(r => path.startsWith(r));
    const token = sessionStorage.getItem('accessToken');

    if (!isPublic && !token) {
        navigateTo('/login');
        return;
    }

    // Buscar coincidencia exacta primero
    let route = routes.find(r => r.path === path);

    // Si no hay exacta, verificar ruta dinámica /admin/usuarios/:document
    if (!route) {
        const parts = path.split('/');
        if (parts.length === 4 && parts[1] === 'admin' && parts[2] === 'usuarios') {
            route = routes.find(r => r.path === '/admin/usuarios');
        }
    }

    if (route) {
        route.controller(app);
    } else {
        navigateTo('/login');
    }
};