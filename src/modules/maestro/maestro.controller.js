import { MaestroView } from './maestro.view.js';

export const initMaestro = (container, navigateToLogin) => {
  // 1. Renderizar el layout principal del Maestro
  container.innerHTML = MaestroView;

  // 2. Capturar elementos del DOM
  const contentArea = document.querySelector('#maestro-module-content');
  const btnLogout = document.querySelector('#btn-logout-maestro');
  const navButtons = document.querySelectorAll('.nav-btn');

  const navTasks = document.querySelector('#nav-maestro-tasks');
  const navStudents = document.querySelector('#nav-maestro-students');

  // Función auxiliar para cambiar la pestaña activa
  const setActiveNav = (activeButton) => {
    navButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  };

  // 3. Asignar eventos de navegación interna
  navTasks.addEventListener('click', (e) => {
    setActiveNav(e.target);
    // Aquí luego llamaremos al controlador de tareas del maestro
    contentArea.innerHTML = `
      <div class="module-header">
        <h3>Mis Tareas</h3>
      </div>
      <p>Aquí el maestro podrá crear, listar, asignar y eliminar sus tareas.</p>
    `;
  });

navStudents.addEventListener('click', (e) => {
    setActiveNav(e.target);
    initMaestroStudentsModule(contentArea); // Inyectamos el módulo de calificaciones
  });

  // Cerrar sesión
  btnLogout.addEventListener('click', () => {
    navigateToLogin();
  });

  // 4. Inicializar la vista por defecto (Tareas)
  navTasks.click();
};