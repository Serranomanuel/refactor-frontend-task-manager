import { initLogin }      from '../modules/home/login.controller.js';
import { initRegister }   from '../modules/home/register.controller.js';
import { initForgotPassword }  from '../modules/home/forgot-password.controller.js';
import { initResetPassword }   from '../modules/home/reset-password.controller.js'; 
import { initAdmin }      from '../modules/admin/admin.controller.js';
import { initMaestro }    from '../modules/maestro/maestro.controller.js';
import { initEstudiante } from '../modules/student/estudiante.controller.js';

const toLogin      = () => window.location.hash = '#/login';
const toRegister   = () => window.location.hash = '#/register';
const toForgot     = () => window.location.hash = '#/forgot-password'; 
const toAdmin      = () => window.location.hash = '#/admin';
const toMaestro    = () => window.location.hash = '#/maestro';
const toEstudiante = () => window.location.hash = '#/estudiante';

export const routes = [
    // Auth
    { path: '/login',    controller: (app) => initLogin(app, toRegister, toAdmin, toMaestro, toEstudiante, toForgot) },
    { path: '/register', controller: (app) => initRegister(app, toLogin) },
    { path: '/forgot-password', controller: (app) => initForgotPassword(app, toLogin) },
    { path: '/reset-password',  controller: (app) => initResetPassword(app, toLogin) }, 

    // Admin — panel + sub-rutas de pestañas
    { path: '/admin',                  controller: (app) => initAdmin(app, toLogin) },
    { path: '/admin/usuarios',         controller: (app) => initAdmin(app, toLogin, 'usuarios') },
    { path: '/admin/usuarios/nuevo',   controller: (app) => initAdmin(app, toLogin, 'usuarios') },
    { path: '/admin/tareas',           controller: (app) => initAdmin(app, toLogin, 'tareas') },
    { path: '/admin/roles',            controller: (app) => initAdmin(app, toLogin, 'roles') },

    // Maestro
    { path: '/maestro',                controller: (app) => initMaestro(app, toLogin) },
    { path: '/maestro/tareas',         controller: (app) => initMaestro(app, toLogin, 'tareas') },
    { path: '/maestro/estudiantes',    controller: (app) => initMaestro(app, toLogin, 'estudiantes') },

    // Estudiante
    { path: '/estudiante',             controller: (app) => initEstudiante(app, toLogin) },
    { path: '/estudiante/tareas',      controller: (app) => initEstudiante(app, toLogin, 'tareas') },
];