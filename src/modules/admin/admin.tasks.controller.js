import { TasksView } from './admin.tasks.js';
import { TaskRepository } from '../../repositories/taskRepository.js';
import { showToast, showConfirm } from '../../utils/toast.js';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
});

export const initTasksModule = async (container) => {
    container.innerHTML = TasksView;

    const tableBody     = document.querySelector('#tasks-table-body');
    const btnCreateTask = document.querySelector('#btn-create-task');
    const taskModal     = document.querySelector('#task-modal');
    const btnCancelTask = document.querySelector('#btn-cancel-task');
    const taskForm      = document.querySelector('#task-form');
    const modalTitle    = document.querySelector('#task-modal-title');
    const btnSelectAll  = document.querySelector('#btn-select-all-users');

    let editingTaskId = null;

    // Cargar usuarios como checkboxes estilo grid
    const loadUsersAsCheckboxes = async (selectedUserId = null) => {
        const container = document.querySelector('#task-assignees-container');
        container.innerHTML = '<span style="color:#999; font-size:0.9rem; padding:0.5rem;">Cargando usuarios...</span>';
        try {
            const res  = await fetch(`${API_URL}/api/users`, { headers: getHeaders() });
            const json = await res.json();
            const users = json.data ?? [];

            if (!users.length) {
                container.innerHTML = '<span style="color:#999; padding:0.5rem;">No hay usuarios disponibles.</span>';
                return;
            }

            container.innerHTML = users.map(u => `
                <label>
                    <input
                        type="checkbox"
                        class="assignee-checkbox"
                        value="${u.id}"
                        ${selectedUserId && Number(selectedUserId) === u.id ? 'checked' : ''}
                    >
                    <span class="checkbox-label-text">
                        <strong>${u.name}</strong>
                        <span>(${u.document})</span>
                    </span>
                </label>
            `).join('');
        } catch {
            container.innerHTML = '<span style="color:red; padding:0.5rem;">Error al cargar usuarios.</span>';
        }
    };

    const getSelectedUserIds = () =>
        Array.from(document.querySelectorAll('.assignee-checkbox:checked'))
            .map(cb => Number(cb.value));

    // Seleccionar / deseleccionar todos
    btnSelectAll?.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.assignee-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        checkboxes.forEach(cb => cb.checked = !allChecked);
        btnSelectAll.textContent = allChecked ? 'Seleccionar todos' : 'Deseleccionar todos';
    });

    // Renderizar tabla 
    const loadTasks = async () => {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">Cargando tareas...</td></tr>';
        try {
            const tasks = await TaskRepository.getAll();
            if (!tasks || tasks.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">No hay tareas registradas.</td></tr>';
                return;
            }

            tableBody.innerHTML = '';
            tasks.forEach(task => {
                const statusMap = {
                    'pendiente':   '<span class="badge badge-estudiante">Pendiente</span>',
                    'en-progreso': '<span class="badge badge-maestro">En progreso</span>',
                    'completada':  '<span class="badge badge-evaluador">Completada</span>',
                };
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${task.title}</strong></td>
                    <td>${task.description}</td>
                    <td>${statusMap[task.status] ?? task.status}</td>
                    <td><span class="badge badge-estudiante">${task.user_name ?? '—'}</span></td>
                    <td>
                        <button class="btn-action edit btn-edit-task" data-id="${task.id}">Editar</button>
                        <button class="btn-action delete btn-delete-task" data-id="${task.id}">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });

            attachTableEvents();
        } catch (err) {
            console.error('Error al cargar tareas:', err);
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:red; padding:2rem;">Error al conectar con el servidor.</td></tr>';
        }
    };

    // Eventos de tabla 
    const attachTableEvents = () => {
        document.querySelectorAll('.btn-delete-task').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const confirmed = await showConfirm('¿Eliminar esta tarea? Esta acción no se puede deshacer.');
                if (!confirmed) return;
                try {
                    await TaskRepository.delete(e.target.dataset.id);
                    showToast('Tarea eliminada correctamente.', 'success');
                    await loadTasks();
                } catch {
                    showToast('Error al eliminar la tarea.', 'error');
                }
            });
        });

        document.querySelectorAll('.btn-edit-task').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                try {
                    const task = await TaskRepository.getById(e.target.dataset.id);
                    editingTaskId = task.id;

                    await loadUsersAsCheckboxes(task.user_id);

                    document.querySelector('#task-title').value  = task.title;
                    document.querySelector('#task-desc').value   = task.description;
                    document.querySelector('#task-status').value = task.status ?? 'pendiente';

                    openModal('Editar Tarea');
                } catch {
                    showToast('Error al cargar los datos de la tarea.', 'error');
                }
            });
        });
    };

    // Modal 
    const openModal = async (title = 'Crear Tarea') => {
        modalTitle.textContent = title;
        if (!editingTaskId) {
            await loadUsersAsCheckboxes();
            btnSelectAll.textContent = 'Seleccionar todos';
        }
        taskModal.classList.remove('hidden');
    };

    const closeModal = () => {
        taskModal.classList.add('hidden');
        taskForm.reset();
        editingTaskId = null;
        btnSelectAll.textContent = 'Seleccionar todos';
    };

    btnCreateTask.addEventListener('click', () => openModal('Crear Tarea'));
    btnCancelTask.addEventListener('click', closeModal);

    // Submit 
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const selectedIds = getSelectedUserIds();

        if (selectedIds.length === 0) {
            showToast('Debes seleccionar al menos un usuario para asignar la tarea.', 'warning');
            return;
        }

        const title       = document.querySelector('#task-title').value.trim();
        const description = document.querySelector('#task-desc').value.trim();
        const status      = document.querySelector('#task-status').value;

        const btnSubmit = taskForm.querySelector('button[type="submit"]');
        btnSubmit.disabled    = true;
        btnSubmit.textContent = 'Guardando...';

        try {
            if (editingTaskId) {
                await TaskRepository.update(editingTaskId, {
                    user_id: selectedIds[0],
                    title,
                    description,
                    status,
                });
                showToast('Tarea actualizada exitosamente.', 'success');
            } else {
                await Promise.all(
                    selectedIds.map(userId =>
                        TaskRepository.create({ user_id: userId, title, description, status })
                    )
                );
                showToast(
                    selectedIds.length > 1
                        ? `Tarea creada y asignada a ${selectedIds.length} usuarios.`
                        : 'Tarea creada exitosamente.',
                    'success'
                );
            }

            closeModal();
            await loadTasks();
        } catch (err) {
            console.error('Error guardando tarea:', err);
            showToast('Error al guardar la tarea. Revisa la consola.', 'error');
        } finally {
            btnSubmit.disabled    = false;
            btnSubmit.textContent = 'Guardar';
        }
    });

    await loadTasks();
};