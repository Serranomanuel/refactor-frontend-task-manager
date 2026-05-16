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
          <th>Estado</th>
          <th>Asignada a</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="tasks-table-body"></tbody>
    </table>
  </div>

  <div id="task-modal" class="modal hidden">
    <div class="modal-content auth-card" style="max-width: 520px;">
      <h2 id="task-modal-title">Crear Tarea</h2>
      <form id="task-form">
        <div class="input-group">
          <label for="task-title">Título</label>
          <input type="text" id="task-title" required minlength="5" maxlength="150">
        </div>
        <div class="input-group">
          <label for="task-desc">Descripción</label>
          <textarea id="task-desc" required minlength="5" maxlength="2000" rows="3" style="resize: vertical; font-family: inherit;"></textarea>
        </div>
        <div class="input-group">
          <label for="task-status">Estado</label>
          <select id="task-status" class="form-select">
            <option value="pendiente">Pendiente</option>
            <option value="en-progreso">En progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>
        <div class="input-group">
          <label>
            Asignar a 
            <span style="color:#888; font-size:0.8rem;">(selecciona uno o varios)</span>
          </label>
          <button type="button" id="btn-select-all-users" class="btn-select-all">Seleccionar todos</button>
          <div id="task-assignees-container" class="checkbox-grid" style="max-height: 220px;">
            Cargando usuarios...
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" id="btn-cancel-task" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  </div>
`;