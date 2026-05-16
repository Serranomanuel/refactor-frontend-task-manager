import { TasksView } from './tasks.view.js';
import { showToast, showConfirm } from '../../utils/toast.js';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${sessionStorage.getItem('accessToken') || sessionStorage.getItem('token')}`,
});

const FIELD_MAP = {
  title:       'title',
  description: 'description',
  dueDate:     'dueDate',
  assigneeId:  'user_id',
};

export const initTasksModule = async (container, userPermissions = []) => {
  container.innerHTML = TasksView;

  const tableBody      = document.querySelector('#tasks-table-body');
  const btnCreate      = document.querySelector('#btn-create-task');
  const titleEl        = document.querySelector('#tasks-title');
  const taskModal      = document.querySelector('#task-modal');
  const submitModal    = document.querySelector('#submit-modal');
  const gradeModal     = document.querySelector('#grade-modal');
  const taskForm       = document.querySelector('#task-form');
  const submitForm     = document.querySelector('#submit-form');
  const gradeForm      = document.querySelector('#grade-form');

  // Detectar permisos
  const canCreate   = userPermissions.includes('Crear Tareas');
  const canEdit     = userPermissions.includes('Editar Tareas');
  const canDelete   = userPermissions.includes('Eliminar Tareas');
  const canAssign   = userPermissions.includes('Asignar Tareas');
  const canGrade    = userPermissions.includes('Calificar Trabajos');
  const isStudent   = !canCreate && !canEdit && !canDelete && !canAssign && !canGrade;

  // Ajustar UI según permisos (con defensas)
  if (btnCreate && canCreate) btnCreate.style.display = 'block';
  if (titleEl && isStudent) titleEl.textContent = 'Mis Tareas';

  let editingTaskId = null;
  let currentSubmitId = null;
  let currentGradeId = null;

  // ─── Cargar usuarios en select ───
  const loadUsersIntoSelect = async (preselected = '') => {
    const select = document.querySelector('#task-assignee');
    if (!select) return;
    select.innerHTML = '<option value="" disabled selected>Cargando usuarios...</option>';

    try {
      const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error al obtener usuarios');
      const json = await res.json();
      const users = json.data ?? json ?? [];

      select.innerHTML = '<option value="" disabled selected>Seleccione un usuario...</option>';
      users.forEach(user => {
        const opt = document.createElement('option');
        opt.value = user.id;
        opt.textContent = `${user.name || 'Sin nombre'} ${user.email ? `(${user.email})` : ''}`;
        select.appendChild(opt);
      });

      if (preselected) select.value = String(preselected);
    } catch (err) {
      select.innerHTML = '<option value="" disabled selected>Error al cargar usuarios</option>';
    }
  };

  // ─── Cargar tareas ───
  const loadTasks = async () => {
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem;">Cargando tareas...</td></tr>';

    try {
      let res;
      if (isStudent) {
        try {
          res = await fetch(`${API_URL}/tasks/my-tasks`, { headers: getHeaders() });
          if (!res.ok) throw new Error('Fallback');
        } catch (e) {
          res = await fetch(`${API_URL}/tasks`, { headers: getHeaders() });
        }
      } else {
        res = await fetch(`${API_URL}/tasks`, { headers: getHeaders() });
      }

      if (res.status === 401) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red; padding:2rem;">Sesión inválida o sin permisos.</td></tr>';
        return;
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error al obtener tareas');

      const tasks = json.data ?? json ?? [];
      if (tasks.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem;">No hay tareas registradas.</td></tr>';
        return;
      }

      tableBody.innerHTML = '';
      tasks.forEach(task => {
        const assigneeName = task.assigneeName ?? task.user?.name ?? task.asignado ?? '';
        const estado = task.estado ?? task.status ?? 'Pendiente';
        const calif = task.calificacion ?? task.grade ?? null;

        const estadoBadge = estado === 'Enviado' 
          ? '<span class="badge badge-maestro">Enviado</span>'
          : '<span class="badge badge-estudiante" style="background:#f8d7da; color:#721c24;">Pendiente</span>';

        const notaHtml = calif !== null ? `<strong>${calif} / 100</strong>` : '<span style="color:#999; font-size:0.9rem;">Sin calificar</span>';

        // Botones según permisos
        let actions = '';
        if (canEdit) actions += `<button class="btn-action edit" data-id="${task.id}">Editar</button>`;
        if (canDelete) actions += `<button class="btn-action delete" data-id="${task.id}">Eliminar</button>`;
        if (canGrade && estado === 'Enviado' && calif === null) {
          actions += `<button class="btn-action edit btn-grade" data-id="${task.id}">Calificar</button>`;
        }
        if (isStudent && estado === 'Pendiente') {
          actions += `<button class="btn-action edit btn-submit" data-id="${task.id}">Entregar</button>`;
        }
        if (isStudent && estado === 'Enviado') {
          actions += `<button class="btn-action edit" disabled style="opacity:0.5;">Entregado</button>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${task.title ?? task.titulo ?? ''}</strong></td>
          <td>${task.description ?? task.desc ?? ''}</td>
          <td>${task.dueDate ?? task.fecha ?? task.date ?? ''}</td>
          <td>${assigneeName}</td>
          <td>${estadoBadge}</td>
          <td>${notaHtml}</td>
          <td>${actions}</td>
        `;
        tableBody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red; padding:2rem;">Error al conectar con el servidor.</td></tr>';
    }
  };

  // ─── Modal Crear/Editar ───
  const openTaskModal = async (task = null) => {
    if (!taskModal) return;
    
    const modalTitle = document.querySelector('#task-modal-title');
    if (modalTitle) modalTitle.textContent = task ? 'Editar Tarea' : 'Crear Tarea';

    if (task) {
      const titleIn = document.querySelector('#task-title');
      const descIn = document.querySelector('#task-desc');
      const dateIn = document.querySelector('#task-date');
      
      if (titleIn) titleIn.value = task.title ?? task.titulo ?? '';
      if (descIn) descIn.value = task.description ?? task.desc ?? '';
      if (dateIn) dateIn.value = task.dueDate ?? task.fecha ?? task.date ?? '';
      
      editingTaskId = task.id;
      await loadUsersIntoSelect(task.user_id ?? task.assigneeId ?? '');
    } else {
      editingTaskId = null;
      if (taskForm) taskForm.reset();
      await loadUsersIntoSelect();
    }
    taskModal.classList.remove('hidden');
  };

  const closeTaskModal = () => {
    if (taskModal) taskModal.classList.add('hidden');
    if (taskForm) taskForm.reset();
    editingTaskId = null;
  };

  if (btnCreate) btnCreate.addEventListener('click', () => openTaskModal());
  
  const btnCancelTask = document.querySelector('#btn-cancel-task');
  if (btnCancelTask) btnCancelTask.addEventListener('click', closeTaskModal);

  if (taskForm) {
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const payload = {};
      const titleIn = document.querySelector('#task-title');
      const descIn = document.querySelector('#task-desc');
      const dateIn = document.querySelector('#task-date');
      const assignIn = document.querySelector('#task-assignee');

      if (titleIn) payload[FIELD_MAP.title] = titleIn.value;
      if (descIn) payload[FIELD_MAP.description] = descIn.value;
      if (dateIn) payload[FIELD_MAP.dueDate] = dateIn.value;

      const rawAssignee = assignIn ? assignIn.value : '';
      if (rawAssignee) payload[FIELD_MAP.assigneeId] = Number(rawAssignee);

      const btnSubmit = taskForm.querySelector('button[type="submit"]');
      if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.textContent = 'Guardando...'; }

      try {
        let res;
        if (editingTaskId) {
          res = await fetch(`${API_URL}/tasks/${editingTaskId}`, {
            method: 'PATCH', headers: getHeaders(), body: JSON.stringify(payload)
          });
        } else {
          res = await fetch(`${API_URL}/tasks`, {
            method: 'POST', headers: getHeaders(), body: JSON.stringify(payload)
          });
        }
        
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Error al guardar');
        
        showToast(editingTaskId ? 'Tarea actualizada.' : 'Tarea creada.', 'success');
        closeTaskModal();
        await loadTasks();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.textContent = 'Guardar'; }
      }
    });
  }

  // ─── Modal Entregar (estudiante) ───
  const openSubmitModal = (taskId, title) => {
    currentSubmitId = taskId;
    const titleSpan = document.querySelector('#submit-task-title');
    if (titleSpan) titleSpan.textContent = title;
    if (submitModal) submitModal.classList.remove('hidden');
  };

  const closeSubmitModal = () => {
    if (submitModal) submitModal.classList.add('hidden');
    if (submitForm) submitForm.reset();
    currentSubmitId = null;
  };

  const btnCancelSubmit = document.querySelector('#btn-cancel-submit');
  if (btnCancelSubmit) btnCancelSubmit.addEventListener('click', closeSubmitModal);

  if (submitForm) {
    submitForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!currentSubmitId) return;

      const urlIn = document.querySelector('#submission-url');
      const commentsIn = document.querySelector('#submission-comments');
      
      const payload = {
        url: urlIn ? urlIn.value : '',
        comments: commentsIn ? commentsIn.value : ''
      };

      try {
        const res = await fetch(`${API_URL}/tasks/${currentSubmitId}/submit`, {
          method: 'POST', headers: getHeaders(), body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Error al entregar');
        
        showToast('Tarea entregada correctamente.', 'success');
        closeSubmitModal();
        await loadTasks();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // ─── Modal Calificar ───
  const openGradeModal = (taskId, studentName, taskTitle) => {
    currentGradeId = taskId;
    const nameSpan = document.querySelector('#grade-student-name');
    const titleSpan = document.querySelector('#grade-task-title');
    if (nameSpan) nameSpan.textContent = studentName;
    if (titleSpan) titleSpan.textContent = taskTitle;
    if (gradeModal) gradeModal.classList.remove('hidden');
  };

  const closeGradeModal = () => {
    if (gradeModal) gradeModal.classList.add('hidden');
    if (gradeForm) gradeForm.reset();
    currentGradeId = null;
  };

  const btnCancelGrade = document.querySelector('#btn-cancel-grade');
  if (btnCancelGrade) btnCancelGrade.addEventListener('click', closeGradeModal);

  if (gradeForm) {
    gradeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!currentGradeId) return;

      const gradeIn = document.querySelector('#grade-value');
      const feedbackIn = document.querySelector('#grade-feedback');
      
      const payload = {
        grade: gradeIn ? Number(gradeIn.value) : 0,
        feedback: feedbackIn ? feedbackIn.value : ''
      };

      try {
        const res = await fetch(`${API_URL}/tasks/${currentGradeId}/grade`, {
          method: 'POST', headers: getHeaders(), body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Error al calificar');
        
        showToast('Calificación guardada.', 'success');
        closeGradeModal();
        await loadTasks();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // ─── Eventos de tabla (delegación) ───
  if (tableBody) {
    tableBody.addEventListener('click', async (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.dataset.id;
      if (!id) return;

      // Editar
      if (btn.classList.contains('edit') && !btn.classList.contains('btn-submit') && !btn.classList.contains('btn-grade')) {
        try {
          const res = await fetch(`${API_URL}/tasks/${id}`, { headers: getHeaders() });
          const json = await res.json();
          openTaskModal(json.data ?? json);
        } catch (err) { showToast('Error al cargar tarea.', 'error'); }
      }

      // Eliminar
      if (btn.classList.contains('delete')) {
        const confirmed = await showConfirm('¿Eliminar esta tarea?');
        if (!confirmed) return;
        try {
          await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE', headers: getHeaders() });
          showToast('Tarea eliminada.', 'success');
          await loadTasks();
        } catch (err) { showToast('Error al eliminar.', 'error'); }
      }

      // Entregar
      if (btn.classList.contains('btn-submit')) {
        const title = btn.closest('tr')?.querySelector('td strong')?.textContent ?? '';
        openSubmitModal(id, title);
      }

      // Calificar
      if (btn.classList.contains('btn-grade')) {
        const row = btn.closest('tr');
        const cells = row?.querySelectorAll('td');
        const studentName = cells?.[3]?.textContent ?? '';
        const taskTitle = cells?.[0]?.textContent ?? '';
        openGradeModal(id, studentName, taskTitle);
      }
    });
  }

  await loadTasks();
};