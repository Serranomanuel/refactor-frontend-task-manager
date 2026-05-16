import { MaestroStudentsView } from './maestro.students.js';

export const initMaestroStudentsModule = (container) => {
  container.innerHTML = MaestroStudentsView;

  const tableBody = document.querySelector('#maestro-students-table-body');
  const gradeModal = document.querySelector('#grade-modal');
  const gradeForm = document.querySelector('#grade-form');
  const btnCancelGrade = document.querySelector('#btn-cancel-grade');
  
  const studentNameSpan = document.querySelector('#grade-student-name');
  const taskTitleSpan = document.querySelector('#grade-task-title');
  const gradeValueInput = document.querySelector('#grade-value');

  // Datos simulados de entregas de estudiantes
  const mockSubmissions = [
    { id: 1, doc: '987654', nombre: 'Carlos López', tarea: 'Ensayo sobre la Web', estado: 'Enviado', calificacion: null },
    { id: 2, doc: '112233', nombre: 'Ana Martínez', tarea: 'Ejercicios CSS', estado: 'Enviado', calificacion: 85 },
    { id: 3, doc: '445566', nombre: 'Luis Pérez', tarea: 'Ensayo sobre la Web', estado: 'Pendiente', calificacion: null }
  ];

  let currentGradingId = null;

  // Renderizar la tabla de entregas
  const renderSubmissions = () => {
    tableBody.innerHTML = '';
    mockSubmissions.forEach(sub => {
      const tr = document.createElement('tr');
      
      // Estilos para el estado
      let estadoBadge = '';
      if (sub.estado === 'Enviado') estadoBadge = '<span class="badge badge-maestro">Enviado</span>';
      else estadoBadge = '<span class="badge badge-estudiante" style="background:#f8d7da; color:#721c24;">Pendiente</span>';

      // Mostrar calificación
      const notaHtml = sub.calificacion !== null ? `<strong>${sub.calificacion} / 100</strong>` : '<span style="color:#999; font-size: 0.9rem;">Sin calificar</span>';
      
      // Deshabilitar botón si no ha enviado
      const btnDisabled = sub.estado === 'Pendiente' ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : '';

      tr.innerHTML = `
        <td>${sub.doc}</td>
        <td>${sub.nombre}</td>
        <td>${sub.tarea}</td>
        <td>${estadoBadge}</td>
        <td>${notaHtml}</td>
        <td>
          <button class="btn-action edit btn-grade" data-id="${sub.id}" ${btnDisabled}>
            ${sub.calificacion !== null ? 'Modificar Nota' : 'Calificar'}
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Eventos de los botones de calificación
    document.querySelectorAll('.btn-grade').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.target.dataset.id);
        openGradeModal(id);
      });
    });
  };

  renderSubmissions();

  // --- Lógica del Modal de Calificación ---
  const openGradeModal = (id) => {
    currentGradingId = id;
    const sub = mockSubmissions.find(s => s.id === id);
    studentNameSpan.textContent = sub.nombre;
    taskTitleSpan.textContent = sub.tarea;
    gradeValueInput.value = sub.calificacion || '';
    gradeModal.classList.remove('hidden');
  };

  btnCancelGrade.addEventListener('click', () => {
    gradeModal.classList.add('hidden');
    gradeForm.reset();
    currentGradingId = null;
  });

  gradeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (currentGradingId) {
      const index = mockSubmissions.findIndex(s => s.id === currentGradingId);
      mockSubmissions[index].calificacion = Number(gradeValueInput.value);
      renderSubmissions();
      gradeModal.classList.add('hidden');
      gradeForm.reset();
      currentGradingId = null;
    }
  });
};