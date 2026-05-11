import { TasksView } from './admin.tasks.js';

export const initTasksModule = (container) => {
  // Renderizar la vista
  container.innerHTML = TasksView;

  // Capturar elementos
  const tableBody = document.querySelector('#tasks-table-body');
  const btnCreateTask = document.querySelector('#btn-create-task');
  
  const taskModal = document.querySelector('#task-modal');
  const btnCancelTask = document.querySelector('#btn-cancel-task');
  const taskForm = document.querySelector('#task-form');
  const modalTitle = document.querySelector('#task-modal-title');

  // Datos simulados (Mock data)
  const mockTasks = [
    { id: 1, titulo: 'Matemáticas Básicas', desc: 'Resolver página 10 del libro', fecha: '2026-05-15', asignado: 'Todos los estudiantes' },
    { id: 2, titulo: 'Historia', desc: 'Ensayo sobre la Revolución', fecha: '2026-05-20', asignado: 'Carlos López (Estudiante)' }
  ];

  // Función para listar las tareas en la tabla
  const renderTasks = (tasks) => {
    tableBody.innerHTML = ''; 
    tasks.forEach(task => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${task.titulo}</strong></td>
        <td>${task.desc}</td>
        <td>${task.fecha}</td>
        <td><span class="badge badge-estudiante">${task.asignado}</span></td>
        <td>
          <button class="btn-action edit" data-id="${task.id}">Editar</button>
          <button class="btn-action delete" data-id="${task.id}">Eliminar</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  };

  // Carga inicial
  renderTasks(mockTasks);

  // --- Funciones del Modal ---
  const openModal = (title = 'Crear Tarea') => {
    modalTitle.textContent = title;
    taskModal.classList.remove('hidden');
  };

  const closeModal = () => {
    taskModal.classList.add('hidden');
    taskForm.reset();
  };

  // Asignar eventos del modal
  btnCreateTask.addEventListener('click', () => openModal('Crear Tarea'));
  btnCancelTask.addEventListener('click', closeModal);
  
  // Guardar nueva tarea
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newTask = {
      id: Date.now(), // Generamos un ID simulado con la fecha actual
      titulo: document.querySelector('#task-title').value,
      desc: document.querySelector('#task-desc').value,
      fecha: document.querySelector('#task-date').value,
      asignado: document.querySelector('#task-assignee').value
    };

    mockTasks.push(newTask);
    renderTasks(mockTasks);
    closeModal();
  });
};