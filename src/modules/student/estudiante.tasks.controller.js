import { EstudianteTasksView } from './estudiante.tasks.js';
import { showToast, showConfirm } from '../../utils/toast.js';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
});

export const initEstudianteTasksModule = async (container) => {
    container.innerHTML = EstudianteTasksView;

    const tableBody = document.querySelector('#student-tasks-table-body');
    const modal     = document.querySelector('#submit-task-modal');
    const form      = document.querySelector('#submit-task-form');
    const btnCancel = document.querySelector('#btn-cancel-submit');
    const titleSpan = document.querySelector('#submit-task-title');
    const btnExport = document.querySelector('#btn-export-tasks');

    const currentUser = JSON.parse(sessionStorage.getItem('user') ?? '{}');
    const userId = currentUser.id;

    let currentTaskId = null;
    let myTasksCache  = []; // guardamos las tareas para poder exportarlas

    // Renderizar tabla 
    const loadTasks = async () => {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Cargando tareas...</td></tr>';
        try {
            const res  = await fetch(`${API_URL}/api/tasks`, { headers: getHeaders() });
            const json = await res.json();
            const allTasks = json.data ?? [];

            myTasksCache = allTasks.filter(t => t.user_id === userId);

            if (myTasksCache.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No tienes tareas asignadas.</td></tr>';
                btnExport.disabled = true;
                return;
            }

            btnExport.disabled = false;
            tableBody.innerHTML = '';

            myTasksCache.forEach(task => {
                const tr = document.createElement('tr');
                const hasSent = task.submission_url != null;

                const estadoBadge = hasSent
                    ? '<span class="badge badge-maestro">Enviado</span>'
                    : '<span class="badge badge-estudiante" style="background:#f8d7da;color:#721c24;">Pendiente</span>';

                const notaHtml = task.grade != null
                    ? `<strong>${task.grade} / 100</strong>`
                    : '<span style="color:#999;font-size:0.9rem;">Sin calificar</span>';

                const btnText  = hasSent ? 'Entregado ✓' : 'Enviar Tarea';
                const btnState = hasSent ? 'disabled style="opacity:0.5;cursor:default;"' : '';

                tr.innerHTML = `
                    <td><strong>${task.title}</strong></td>
                    <td>${task.description}</td>
                    <td>${estadoBadge}</td>
                    <td>${notaHtml}</td>
                    <td>
                        <button
                            class="btn-action edit btn-submit-task"
                            data-id="${task.id}"
                            data-title="${task.title}"
                            ${btnState}
                        >${btnText}</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });

            document.querySelectorAll('.btn-submit-task').forEach(btn => {
                if (!btn.hasAttribute('disabled')) {
                    btn.addEventListener('click', (e) => {
                        const t = e.currentTarget;
                        openSubmitModal(Number(t.dataset.id), t.dataset.title);
                    });
                }
            });

        } catch (err) {
            console.error('Error al cargar tareas del estudiante:', err);
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:red;">Error al conectar con el servidor.</td></tr>';
        }
    };

    // Exportar JSON 
    btnExport.addEventListener('click', () => {
        if (!myTasksCache.length) {
            showToast('No hay tareas para exportar.', 'warning');
            return;
        }

        // Construir objeto limpio para el archivo
        const exportData = myTasksCache.map(t => ({
            id:             t.id,
            titulo:         t.title,
            descripcion:    t.description,
            estado:         t.status,
            calificacion:   t.grade ?? 'Sin calificar',
            entrega_url:    t.submission_url ?? 'No entregado',
            fecha_creacion: t.created_at,
        }));

        const blob     = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url      = URL.createObjectURL(blob);
        const link     = document.createElement('a');
        const fecha    = new Date().toISOString().slice(0, 10);
        link.href      = url;
        link.download  = `mis-tareas-${fecha}.json`;
        link.click();
        URL.revokeObjectURL(url);

        showToast('Tareas exportadas correctamente.', 'success');
    });

    // Modal de entrega
    const openSubmitModal = (taskId, taskTitle) => {
        currentTaskId         = taskId;
        titleSpan.textContent = taskTitle;
        modal.classList.remove('hidden');
    };

    btnCancel.addEventListener('click', () => {
        modal.classList.add('hidden');
        form.reset();
        currentTaskId = null;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentTaskId) return;

        const submissionUrl = document.querySelector('#submission-url').value.trim();

        const btnSubmit = form.querySelector('button[type="submit"]');
        btnSubmit.disabled    = true;
        btnSubmit.textContent = 'Enviando...';

        try {
            const res = await fetch(`${API_URL}/api/tasks/${currentTaskId}`, {
                method:  'PATCH',
                headers: getHeaders(),
                body:    JSON.stringify({
                    submission_url: submissionUrl,
                    status: 'en-progreso',
                }),
            });
            if (!res.ok) throw new Error();

            showToast('¡Tarea entregada exitosamente!', 'success');
            modal.classList.add('hidden');
            form.reset();
            currentTaskId = null;
            await loadTasks();
        } catch {
            showToast('Error al enviar la tarea. Intenta de nuevo.', 'error');
        } finally {
            btnSubmit.disabled    = false;
            btnSubmit.textContent = 'Enviar a Revisión';
        }
    });

    await loadTasks();
};