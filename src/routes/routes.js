import { initLogin } from '../modules/home/login.controller.js';
import { initRegister } from '../modules/home/register.controller.js';
import { initAdmin } from '../modules/admin/admin.controller.js';
import { initMaestro } from '../modules/maestro/maestro.controller.js';
import { initEstudiante } from '../modules/student/estudiante.controller.js';

export const routes = [
    { path: '/login', controller: initLogin },
    { path: '/register', controller: initRegister },
    { path: '/admin', controller: initAdmin },
    { path: '/maestro', controller: initMaestro },
    { path: '/estudiante', controller: initEstudiante },
];