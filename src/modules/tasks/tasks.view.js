export const TasksView = `
  <div class="module-header">
    <h3 id="tasks-title">Tareas</h3>
    <button id="btn-create-task" class="btn-primary" style="width: auto; padding: 0.5rem 1rem; display: none;">+ Nueva Tarea</button>
  </div>
  
  <div class="table-responsive">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Descripción</th>
          <th>Fecha Límite</th>
          <th>Asignada A</th>
          <th>Estado</th>
          <th>Calificación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="tasks-table-body"></tbody>
    </table>
  </div>

  <div id="task-modal" class="modal hidden">
    <div class="modal-content auth-card">
      <h2 id="task-modal-title">Crear Tarea</h2>
      <form id="task-form">
        <div class="input-group">
          <label for="task-title">Título</label>
          <input type="text" id="task-title" required>
        </div>
        <div class="input-group">
          <label for="task-desc">Descripción</label>
          <input type="text" id="task-desc" required>
        </div>
        <div class="input-group">
          <label for="task-date">Fecha Límite</label>
          <input type="date" id="task-date" required>
        </div>
        <div class="input-group" id="assignee-group">
          <label for="task-assignee">Asignar a</label>
          <select id="task-assignee" class="form-select" required>
            <option value="" disabled selected>Cargando usuarios...</option>
          </select>
        </div>
        <div class="modal-actions">
          <button type="button" id="btn-cancel-task" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <div id="submit-modal" class="modal hidden">
    <div class="modal-content auth-card">
      <h2>Entregar Tarea</h2>
      <p id="submit-task-title" style="margin-bottom: 1.5rem; font-weight: bold; color: var(--blue-primary);"></p>
      <form id="submit-form">
        <div class="input-group">
          <label for="submission-url">Enlace del trabajo</label>
          <input type="url" id="submission-url" placeholder="https://github.com/..." required>
        </div>
        <div class="input-group">
          <label for="submission-comments">Comentarios</label>
          <input type="text" id="submission-comments" placeholder="Hola profe, aquí está...">
        </div>
        <div class="modal-actions">
          <button type="button" id="btn-cancel-submit" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Enviar a Revisión</button>
        </div>
      </form>
    </div>
  </div>

  <div id="grade-modal" class="modal hidden">
    <div class="modal-content auth-card">
      <h2>Calificar Tarea</h2>
      <div style="text-align: left; margin-bottom: 1.5rem;">
        <p><strong>Estudiante:</strong> <span id="grade-student-name"></span></p>
        <p><strong>Tarea:</strong> <span id="grade-task-title"></span></p>
      </div>
      <form id="grade-form">
        <div class="input-group">
          <label for="grade-value">Calificación (0 - 100)</label>
          <input type="number" id="grade-value" min="0" max="100" required>
        </div>
        <div class="input-group">
          <label for="grade-feedback">Comentarios</label>
          <input type="text" id="grade-feedback" placeholder="Buen trabajo...">
        </div>
        <div class="modal-actions">
          <button type="button" id="btn-cancel-grade" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar Nota</button>
        </div>
      </form>
    </div>
  </div>
`;