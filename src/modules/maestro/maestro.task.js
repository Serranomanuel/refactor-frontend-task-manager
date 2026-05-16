export const MaestroTasksView = `
  <div class="module-header">
    <h3>Mis Tareas Asignadas</h3>
    <button id="btn-create-maestro-task" class="btn-primary" style="width: auto; padding: 0.5rem 1rem;">+ Nueva Tarea</button>
  </div>

  <div class="table-responsive">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Título de la Tarea</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Asignada a</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="maestro-tasks-table-body"></tbody>
    </table>
  </div>

  <div id="maestro-task-modal" class="modal hidden">
    <div class="modal-content auth-card" style="max-width: 520px;">
      <h2>Crear y Asignar Tarea</h2>
      <form id="maestro-task-form">
        <div class="input-group">
          <label for="m-task-title">Título</label>
          <input type="text" id="m-task-title" required minlength="5" maxlength="150">
        </div>
        <div class="input-group">
          <label for="m-task-desc">Descripción</label>
          <textarea id="m-task-desc" required minlength="5" maxlength="2000" rows="3" style="resize: vertical; font-family: inherit;"></textarea>
        </div>
        <div class="input-group">
          <label for="m-task-status">Estado</label>
          <select id="m-task-status" class="form-select">
            <option value="pendiente" selected>Pendiente</option>
            <option value="en-progreso">En progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>
        <div class="input-group">
          <label>
            Asignar a 
            <span style="color:#888; font-size:0.8rem;">(selecciona uno o varios)</span>
          </label>
          <button type="button" id="btn-m-select-all" class="btn-select-all">Seleccionar todos</button>
          <div id="m-task-assignees-container" class="checkbox-grid" style="max-height: 220px;">
            Cargando estudiantes...
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" id="btn-cancel-m-task" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Publicar Tarea</button>
        </div>
      </form>
    </div>
  </div>
`;