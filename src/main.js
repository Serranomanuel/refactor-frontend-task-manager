import './style.css';
import { initLogin } from './home/login.controller.js';
import { initRegister } from './home/register.controller.js';
import { initAdmin } from './admin/admin.controller.js';
import { initMaestro } from './maestro/maestro.controller.js';
import { initEstudiante } from './estudiante/estudiante.controller.js';

const app = document.querySelector('#app');

// --- Funciones de Navegación (Rutas) ---

const goToAdmin = () => initAdmin(app, goToLogin);
const goToMaestro = () => initMaestro(app, goToLogin);
const goToEstudiante = () => initEstudiante(app, goToLogin);

const goToRegister = () => initRegister(app, goToLogin);

// Al login le pasamos todas las rutas posibles para que decida a dónde enviar al usuario
const goToLogin = () => initLogin(app, goToRegister, goToAdmin, goToMaestro, goToEstudiante);

// --- Inicialización ---
goToLogin();