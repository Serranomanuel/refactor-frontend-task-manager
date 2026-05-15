import { EstudianteView }            from './estudiante.view.js';
import { initEstudianteTasksModule } from './estudiante.tasks.controller.js';
import { navigateTo }                from '../../routes/router.js';

export const initEstudiante = (container, navigateToLogin, seccion = 'tareas') => {
  container.innerHTML = EstudianteView;

  const contentArea = document.querySelector('#student-module-content');
  const btnLogout   = document.querySelector('#btn-logout-student');
  const navTasks    = document.querySelector('#nav-student-tasks');

  navTasks.addEventListener('click', () => navigateTo('/estudiante/tareas'));

  btnLogout.addEventListener('click', () => navigateToLogin());

  // Cargar sección según URL
  if (seccion === 'tareas') {
    navTasks.classList.add('active');
    initEstudianteTasksModule(contentArea);
  }
};