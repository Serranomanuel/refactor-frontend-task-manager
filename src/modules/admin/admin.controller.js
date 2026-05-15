import { AdminView } from './admin.view.js';
import { initUsersModule }  from './admin.users.controller.js';
import { initTasksModule }  from './admin.tasks.controller.js';
import { initRolesModule }  from './admin.roles.controller.js';
import { navigateTo }       from '../../routes/router.js';

export const initAdmin = (container, navigateToLogin, seccion = 'usuarios') => {
  container.innerHTML = AdminView;

  const contentArea  = document.querySelector('#admin-module-content');
  const btnLogout    = document.querySelector('#btn-logout');
  const navButtons   = document.querySelectorAll('.nav-btn');
  const navUsers     = document.querySelector('#nav-users');
  const navTasks     = document.querySelector('#nav-tasks');
  const navRoles     = document.querySelector('#nav-roles');

  const setActiveNav = (activeButton) => {
    navButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  };

  navUsers.addEventListener('click', () => navigateTo('/admin/usuarios'));
  navTasks.addEventListener('click', () => navigateTo('/admin/tareas'));
  navRoles.addEventListener('click', () => navigateTo('/admin/roles'));

  btnLogout.addEventListener('click', () => navigateToLogin());

  const cargarSeccion = (sec) => {
    if (sec === 'usuarios') { setActiveNav(navUsers); initUsersModule(contentArea); }
    if (sec === 'tareas')   { setActiveNav(navTasks);  initTasksModule(contentArea); }
    if (sec === 'roles')    { setActiveNav(navRoles);  initRolesModule(contentArea); }
  };

  cargarSeccion(seccion);
};