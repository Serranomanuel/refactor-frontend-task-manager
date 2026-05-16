import { EstudianteTasksView } from './estudiante.tasks.js';

export const initEstudianteTasksModule = (container) => {
  container.innerHTML = EstudianteTasksView;

  const tableBody = document.querySelector('#student-tasks-table-body');
  const modal = document.querySelector('#submit-task-modal');
  const form = document.querySelector('#submit-task-form');
  const btnCancel = document.querySelector('#btn-cancel-submit');
  const titleSpan = document.querySelector('#submit-task-title');

  // Datos simulados (Mock data)
  const mockMyTasks = [
    { id: 1, titulo: 'Ensayo sobre la Web', desc: 'Mínimo 500 palabras', fecha: '2026-05-18', estado: 'Pendiente', calificacion: null },
    { id: 2, titulo: 'Ejercicios CSS', desc: 'Maquetar un login', fecha: '2026-05-22', estado: 'Enviado', calificacion: 85 },
    { id: 3, titulo: 'Base de datos', desc: 'Implementar comandos SQL', fecha: '2026-06-01', estado: 'Pendiente', calificacion: null }
  ];

  let currentTaskId = null;

  const renderTasks = () => {
    tableBody.innerHTML = '';
    mockMyTasks.forEach(task => {
      const tr = document.createElement('tr');
      
      // Manejo visual de estados
      const estadoBadge = task.estado === 'Enviado' 
        ? '<span class="badge badge-maestro">Enviado</span>' 
        : '<span class="badge badge-estudiante" style="background:#f8d7da; color:#721c24;">Pendiente</span>';

      const notaHtml = task.calificacion !== null ? `<strong>${task.calificacion} / 100</strong>` : '<span style="color:#999; font-size: 0.9rem;">Sin calificar</span>';
      
      // Si ya está enviado, cambiamos el texto y deshabilitamos el botón
      const isSent = task.estado === 'Enviado';
      const btnText = isSent ? 'Entregado' : 'Enviar Tarea';
      const btnState = isSent ? 'disabled style="opacity: 0.5; cursor: default;"' : '';

      tr.innerHTML = `
        <td><strong>${task.titulo}</strong></td>
        <td>${task.desc}</td>
        <td>${task.fecha}</td>
        <td>${estadoBadge}</td>
        <td>${notaHtml}</td>
        <td>
          <button class="btn-action edit btn-submit-task" data-id="${task.id}" ${btnState}>${btnText}</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Eventos para abrir el modal
    document.querySelectorAll('.btn-submit-task').forEach(btn => {
      if (!btn.hasAttribute('disabled')) {
        btn.addEventListener('click', (e) => {
          const id = Number(e.target.dataset.id);
          openSubmitModal(id);
        });
      }
    });
  };

  renderTasks();

  // --- Lógica del Modal ---
  const openSubmitModal = (id) => {
    currentTaskId = id;
    const task = mockMyTasks.find(t => t.id === id);
    titleSpan.textContent = task.titulo;
    modal.classList.remove('hidden');
  };

  btnCancel.addEventListener('click', () => {
    modal.classList.add('hidden');
    form.reset();
    currentTaskId = null;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (currentTaskId) {
      // 1. Encontrar la tarea
      const index = mockMyTasks.findIndex(t => t.id === currentTaskId);
      
      // 2. Cambiar su estado
      mockMyTasks[index].estado = 'Enviado';
      
      // 3. Volver a renderizar y cerrar
      renderTasks();
      modal.classList.add('hidden');
      form.reset();
      currentTaskId = null;
    }
  });
};