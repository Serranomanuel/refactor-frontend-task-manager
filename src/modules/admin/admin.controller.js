import { AdminView } from './admin.view.js';
import { initUsersModule } from './admin.users.controller.js';
import { initTasksModule } from './admin.tasks.controller.js';
import { initRolesModule } from './admin.roles.controller.js';

export const initAdmin = (container, navigateToLogin) => {
  // 1. Renderizar el layout principal
  container.innerHTML = AdminView;

  // 2. Capturar elementos del DOM
  const contentArea = document.querySelector('#admin-module-content');
  const btnLogout = document.querySelector('#btn-logout');
  const navButtons = document.querySelectorAll('.nav-btn');

  const navUsers = document.querySelector('#nav-users');
  const navTasks = document.querySelector('#nav-tasks');
  const navRoles = document.querySelector('#nav-roles');

  /**
   * Función auxiliar para gestionar la apariencia visual del menú
   */
  const setActiveNav = (activeButton) => {
    navButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  };

  // 3. Asignar eventos de navegación

  // Módulo de Usuarios
  navUsers.addEventListener('click', (e) => {
    setActiveNav(e.target);
    initUsersModule(contentArea);
  });

  // Módulo de Tareas
  navTasks.addEventListener('click', (e) => {
    setActiveNav(e.target);
    initTasksModule(contentArea);
  });

  // Módulo de Roles (Placeholder)
navRoles.addEventListener('click', (e) => {
    setActiveNav(e.target);
    initRolesModule(contentArea); // Inicializa el módulo de roles
  });

  // Botón de Salida
  btnLogout.addEventListener('click', (e) => {
    e.preventDefault();
    // Aquí podrías limpiar datos de sesión en el futuro
    navigateToLogin();
  });

  // 4. Carga inicial por defecto
  // Forzamos el click en usuarios para que sea la primera vista al entrar
  navUsers.click();
};