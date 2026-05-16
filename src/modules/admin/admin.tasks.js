export const TasksView = `
  <div class="module-header">
    <h3>Gestión de Tareas</h3>
    <button id="btn-create-task" class="btn-primary" style="width: auto; padding: 0.5rem 1rem;">+ Nueva Tarea</button>
  </div>
  
  <div class="table-responsive">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Descripción</th>
          <th>Fecha Límite</th>
          <th>Asignada A</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="tasks-table-body">
        </tbody>
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
        <div class="input-group">
          <label for="task-assignee">Asignar a</label>
          <select id="task-assignee" class="form-select" required>
            <option value="" disabled selected>Seleccione un usuario...</option>
            <option value="Carlos López (Estudiante)">Carlos López (Estudiante)</option>
            <option value="Todos los estudiantes">Todos los estudiantes</option>
          </select>
        </div>
        <div class="modal-actions">
          <button type="button" id="btn-cancel-task" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  </div>
`;