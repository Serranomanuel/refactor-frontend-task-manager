export const EstudianteTasksView = `
  <div class="module-header">
    <h3>Mis Tareas Asignadas</h3>
    <button id="btn-export-tasks" class="btn-primary" style="width: auto; padding: 0.5rem 1rem;">Exportar JSON</button>
  </div>

  <div class="table-responsive">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Tarea</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Calificación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="student-tasks-table-body"></tbody>
    </table>
  </div>

  <div id="submit-task-modal" class="modal hidden">
    <div class="modal-content auth-card">
      <h2>Entregar Tarea</h2>
      <p id="submit-task-title" style="margin-bottom:1.5rem; font-weight:bold; color:var(--blue-primary);"></p>

      <form id="submit-task-form">
        <div class="input-group">
          <label for="submission-url">Enlace del trabajo (Repositorio, Documento, etc.)</label>
          <input type="url" id="submission-url" placeholder="Ej: https://github.com/..." required>
        </div>
        <div class="modal-actions">
          <button type="button" id="btn-cancel-submit" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Enviar a Revisión</button>
        </div>
      </form>
    </div>
  </div>
`;