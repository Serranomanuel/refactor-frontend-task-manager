import { MaestroTasksView } from './maestro.task.js';
import { TaskRepository }   from '../../repositories/taskRepository.js';
import { showToast } from '../../utils/toast.js';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
});

export const initMaestroTasksModule = async (container) => {
    container.innerHTML = MaestroTasksView;

    const tableBody     = document.querySelector('#maestro-tasks-table-body');
    const btnCreateTask = document.querySelector('#btn-create-maestro-task');
    const taskModal     = document.querySelector('#maestro-task-modal');
    const taskForm      = document.querySelector('#maestro-task-form');
    const btnCancelTask = document.querySelector('#btn-cancel-m-task');
    const btnSelectAll  = document.querySelector('#btn-m-select-all');

    // Cargar usuarios en el checkbox grid (todos, no solo estudiantes)
    const loadUsersIntoGrid = async () => {
        const container = document.querySelector('#m-task-assignees-container');
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
                        class="m-assignee-checkbox"
                        value="${u.id}"
                    >
                    <span class="checkbox-label-text">
                        <strong>${u.name}</strong>
                        <span>(${u.document})</span>
                    </span>
                </label>
            `).join('');
        } catch (err) {
            console.error('Error cargando usuarios:', err);
            container.innerHTML = '<span style="color:red; padding:0.5rem;">Error al cargar usuarios.</span>';
        }
    };

    const getSelectedUserIds = () =>
        Array.from(document.querySelectorAll('.m-assignee-checkbox:checked'))
            .map(cb => Number(cb.value));

    // Seleccionar / deseleccionar todos
    btnSelectAll?.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.m-assignee-checkbox');
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
                    'pendiente':   'Pendiente',
                    'en-progreso': 'En progreso',
                    'completada':  'Completada',
                };
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${task.title}</strong></td>
                    <td>${task.description}</td>
                    <td><span class="badge badge-estudiante">${statusMap[task.status] ?? task.status}</span></td>
                    <td><span class="badge badge-estudiante">${task.user_name ?? '—'}</span></td>
                    <td>
                        <button class="btn-action delete btn-delete-m-task" data-id="${task.id}">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });

            document.querySelectorAll('.btn-delete-m-task').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if (!confirm('¿Eliminar esta tarea?')) return;
                    try {
                        await TaskRepository.delete(e.target.dataset.id);
                        showToast('Tarea eliminada correctamente.', 'success');
                        await loadTasks();
                    } catch {
                        showToast('Error al eliminar la tarea.', 'error');
                    }
                });
            });
        } catch (error) {
            console.error('Error al cargar tareas:', error);
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red; padding:2rem;">Error al conectar con el servidor.</td></tr>';
        }
    };

    // Modal 
    btnCreateTask.addEventListener('click', async () => {
        await loadUsersIntoGrid();
        btnSelectAll.textContent = 'Seleccionar todos';
        taskModal.classList.remove('hidden');
    });

    btnCancelTask.addEventListener('click', () => {
        taskModal.classList.add('hidden');
        taskForm.reset();
        btnSelectAll.textContent = 'Seleccionar todos';
    });

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const selectedIds = getSelectedUserIds();

        if (selectedIds.length === 0) {
            showToast('Debes seleccionar al menos un usuario.', 'warning');
            return;
        }

        const payload = {
            title:       document.querySelector('#m-task-title').value.trim(),
            description: document.querySelector('#m-task-desc').value.trim(),
            status:      document.querySelector('#m-task-status').value,
        };

        const btnSubmit = taskForm.querySelector('button[type="submit"]');
        btnSubmit.disabled    = true;
        btnSubmit.textContent = 'Publicando...';

        try {
            // Crear una tarea por cada usuario seleccionado
            await Promise.all(
                selectedIds.map(userId =>
                    TaskRepository.create({ ...payload, user_id: userId })
                )
            );
            showToast(
                selectedIds.length > 1
                    ? `Tarea publicada y asignada a ${selectedIds.length} usuarios.`
                    : 'Tarea publicada exitosamente.',
                'success'
            );
            taskModal.classList.add('hidden');
            taskForm.reset();
            btnSelectAll.textContent = 'Seleccionar todos';
            await loadTasks();
        } catch (error) {
            console.error('Error creando tarea:', error);
            showToast('Error al publicar la tarea. Revisa la consola.', 'error');
        } finally {
            btnSubmit.disabled    = false;
            btnSubmit.textContent = 'Publicar Tarea';
        }
    });

    await loadTasks();
};