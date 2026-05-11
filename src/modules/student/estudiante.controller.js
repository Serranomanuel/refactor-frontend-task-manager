import { EstudianteView } from './estudiante.view.js';
import { initEstudianteTasksModule } from './estudiante.tasks.controller.js';

export const initEstudiante = (container, navigateToLogin) => {
  // 1. Renderizar layout
  container.innerHTML = EstudianteView;

  // 2. Capturar elementos
  const contentArea = document.querySelector('#student-module-content');
  const btnLogout = document.querySelector('#btn-logout-student');
  const navTasks = document.querySelector('#nav-student-tasks');

  // 3. Navegación
  navTasks.addEventListener('click', () => {
    initEstudianteTasksModule(contentArea);
  });

  btnLogout.addEventListener('click', () => {
    navigateToLogin();
  });

  // 4. Inicializar módulo por defecto
  navTasks.click();
};