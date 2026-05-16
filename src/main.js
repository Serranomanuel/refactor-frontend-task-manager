import './style.css';
import { initLogin } from './modules/home/login.controller.js';
import { initRegister } from './modules/home/register.controller.js';
import { initAdmin } from './modules/admin/admin.controller.js';
import { initMaestro } from './modules/maestro/maestro.controller.js';
import { initEstudiante } from './modules/student/estudiante.controller.js';
import { router } from './routes/router.js';



const app = document.querySelector('#app');

// --- Funciones de Navegación (Rutas) ---

const goToAdmin = () => initAdmin(app, navigateToLogin);
const goToMaestro = () => initMaestro(app, navigateToLogin);
const goToEstudiante = () => initEstudiante(app, navigateToLogin);

const goToRegister = () => initRegister(app, navigateToLogin);

// Al login le pasamos todas las rutas posibles para que decida a dónde enviar al usuario
const navigateToLogin = () => initLogin(app, goToRegister, goToAdmin, goToMaestro, goToEstudiante);

// Escuchar cambios en la URL (al movernos entre páginas)
window.addEventListener('hashchange', router);

// Ejecutar el router al cargar la página por primera vez
window.addEventListener('DOMContentLoaded', router);

// --- Inicialización ---
navigateToLogin(); 