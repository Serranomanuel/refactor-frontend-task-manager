import { MaestroTasksView } from './maestro.tasks.js';

export const initMaestroTasksModule = (container) => {
  container.innerHTML = MaestroTasksView;

  const tableBody = document.querySelector('#maestro-tasks-table-body');
  const btnCreateTask = document.querySelector('#btn-create-maestro-task');
  
  const taskModal = document.querySelector('#maestro-task-modal');
  const taskForm = document.querySelector('#maestro-task-form');
  const btnCancelTask = document.querySelector('#btn-cancel-m-task');

  // Datos simulados de tareas creadas por el maestro
  const mockMaestroTasks = [
    { id: 101, titulo: 'Ensayo sobre la Web', desc: 'Mínimo 500 palabras', fecha: '2026-05-18', asignado: 'Todos mis estudiantes' },
    { id: 102, titulo: 'Ejercicios CSS', desc: 'Maquetar un login', fecha: '2026-05-22', asignado: 'Carlos López' }
  ];

  const renderTasks = () => {
    tableBody.innerHTML = ''; 
    mockMaestroTasks.forEach(task => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${task.titulo}</strong></td>
        <td>${task.desc}</td>
        <td>${task.fecha}</td>
        <td><span class="badge badge-estudiante">${task.asignado}</span></td>
        <td>
          <button class="btn-action delete btn-delete-m-task" data-id="${task.id}">Eliminar</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Evento para eliminar
    document.querySelectorAll('.btn-delete-m-task').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.target.dataset.id);
        const index = mockMaestroTasks.findIndex(t => t.id === id);
        if (index !== -1) {
          mockMaestroTasks.splice(index, 1);
          renderTasks();
        }
      });
    });
  };

  renderTasks();

  // --- Lógica del Modal ---
  btnCreateTask.addEventListener('click', () => taskModal.classList.remove('hidden'));
  
  btnCancelTask.addEventListener('click', () => {
    taskModal.classList.add('hidden');
    taskForm.reset();
  });

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      titulo: document.querySelector('#m-task-title').value,
      desc: document.querySelector('#m-task-desc').value,
      fecha: document.querySelector('#m-task-date').value,
      asignado: document.querySelector('#m-task-assignee').value
    };
    mockMaestroTasks.push(newTask);
    renderTasks();
    taskModal.classList.add('hidden');
    taskForm.reset();
  });
};