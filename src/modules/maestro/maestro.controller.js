import { MaestroView }              from './maestro.view.js';
import { initMaestroStudentsModule } from './maestro.students.controller.js';
import { initMaestroTasksModule }    from './maestro.tasks.controller.js';
import { navigateTo }                from '../../routes/router.js';

export const initMaestro = (container, navigateToLogin, seccion = 'tareas') => {
  container.innerHTML = MaestroView;

  const contentArea   = document.querySelector('#maestro-module-content');
  const btnLogout     = document.querySelector('#btn-logout-maestro');
  const navButtons    = document.querySelectorAll('.nav-btn');
  const navTasks      = document.querySelector('#nav-maestro-tasks');
  const navStudents   = document.querySelector('#nav-maestro-students');

  const setActiveNav = (activeButton) => {
    navButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  };

  // Cada botón actualiza el hash
  navTasks.addEventListener('click',    () => navigateTo('/maestro/tareas'));
  navStudents.addEventListener('click', () => navigateTo('/maestro/estudiantes'));

  btnLogout.addEventListener('click', () => navigateToLogin());

  // Cargar la sección que indica la URL
  const cargarSeccion = (sec) => {
    if (sec === 'tareas')      { setActiveNav(navTasks);    initMaestroTasksModule(contentArea); }
    if (sec === 'estudiantes') { setActiveNav(navStudents); initMaestroStudentsModule(contentArea); }
  };

  cargarSeccion(seccion);
};