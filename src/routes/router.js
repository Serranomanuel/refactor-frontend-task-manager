import { routes } from './routes.js';

export const router = () => {
    const app = document.querySelector('#app');
    
    // Obtener la ruta actual del hash (ej: #/login -> /login)
    const path = window.location.hash.slice(1).toLowerCase() || '/login';

    // Buscar la ruta en nuestro mapa
    const route = routes.find(r => r.path === path);

    if (route) {
        // Ejecutar el controlador de la ruta encontrada
        // Le pasamos las funciones de navegación necesarias
        route.controller(app, 
            () => navigateTo('/register'),
            () => navigateTo('/admin'),
            () => navigateTo('/maestro'),
            () => navigateTo('/estudiante')
        );
    } else {
        // Redirigir a login si la ruta no existe
        navigateTo('/login');
    }
};

// Función global para cambiar de ruta programáticamente
export const navigateTo = (path) => {
    window.location.hash = path;
};