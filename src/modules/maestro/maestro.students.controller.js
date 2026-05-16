import { MaestroStudentsView } from './maestro.students.js';
import { TaskRepository }       from '../../repositories/taskRepository.js';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
});

export const initMaestroStudentsModule = async (container) => {
    container.innerHTML = MaestroStudentsView;

    const tableBody        = document.querySelector('#maestro-students-table-body');
    const gradeModal       = document.querySelector('#grade-modal');
    const gradeForm        = document.querySelector('#grade-form');
    const btnCancelGrade   = document.querySelector('#btn-cancel-grade');
    const studentNameSpan  = document.querySelector('#grade-student-name');
    const taskTitleSpan    = document.querySelector('#grade-task-title');
    const gradeValueInput  = document.querySelector('#grade-value');

    let currentTaskId = null;

    // Renderizar tabla de entregas 
    const loadSubmissions = async () => {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando entregas...</td></tr>';
        try {
            // Traemos todas las tareas; cada una tiene user_name, submission_url y grade
            const tasks = await TaskRepository.getAll();

            if (!tasks || tasks.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay tareas registradas.</td></tr>';
                return;
            }

            tableBody.innerHTML = '';
            tasks.forEach(task => {
                const tr = document.createElement('tr');

                const hasSent    = task.submission_url != null;
                const estadoBadge = hasSent
                    ? '<span class="badge badge-maestro">Enviado</span>'
                    : '<span class="badge badge-estudiante" style="background:#f8d7da; color:#721c24;">Pendiente</span>';

                const notaHtml = task.grade != null
                    ? `<strong>${task.grade} / 100</strong>`
                    : '<span style="color:#999; font-size:0.9rem;">Sin calificar</span>';

                // Solo puede calificar si el estudiante ya envió
                const btnDisabled = !hasSent ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : '';
                const btnText     = task.grade != null ? 'Modificar Nota' : 'Calificar';

                tr.innerHTML = `
                    <td>${task.user_document ?? '—'}</td>
                    <td>${task.user_name ?? '—'}</td>
                    <td><strong>${task.title}</strong></td>
                    <td>${estadoBadge}</td>
                    <td>${notaHtml}</td>
                    <td>
                        <button
                            class="btn-action edit btn-grade"
                            data-id="${task.id}"
                            data-student="${task.user_name ?? ''}"
                            data-title="${task.title}"
                            data-grade="${task.grade ?? ''}"
                            ${btnDisabled}
                        >${btnText}</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });

            document.querySelectorAll('.btn-grade').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const t = e.currentTarget;
                    openGradeModal(
                        Number(t.dataset.id),
                        t.dataset.student,
                        t.dataset.title,
                        t.dataset.grade
                    );
                });
            });
        } catch (error) {
            console.error('Error al cargar entregas:', error);
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Error al conectar con el servidor.</td></tr>';
        }
    };

    //  Modal de calificación 
    const openGradeModal = (taskId, studentName, taskTitle, currentGrade) => {
        currentTaskId              = taskId;
        studentNameSpan.textContent = studentName;
        taskTitleSpan.textContent   = taskTitle;
        gradeValueInput.value       = currentGrade ?? '';
        gradeModal.classList.remove('hidden');
    };

    btnCancelGrade.addEventListener('click', () => {
        gradeModal.classList.add('hidden');
        gradeForm.reset();
        currentTaskId = null;
    });

    gradeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentTaskId) return;

        const grade     = Number(gradeValueInput.value);
        const btnSubmit = gradeForm.querySelector('button[type="submit"]');
        btnSubmit.disabled    = true;
        btnSubmit.textContent = 'Guardando...';

        try {
            // PATCH /api/tasks/:id — solo enviamos el campo grade
            const res = await fetch(`${API_URL}/api/tasks/${currentTaskId}`, {
                method:  'PATCH',
                headers: getHeaders(),
                body:    JSON.stringify({ grade }),
            });
            if (!res.ok) throw new Error();

            alert('Calificación guardada exitosamente.');
            gradeModal.classList.add('hidden');
            gradeForm.reset();
            currentTaskId = null;
            await loadSubmissions();
        } catch {
            alert('Error al guardar la calificación.');
        } finally {
            btnSubmit.disabled    = false;
            btnSubmit.textContent = 'Guardar Nota';
        }
    });

    await loadSubmissions();
};