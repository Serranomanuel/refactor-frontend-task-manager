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
          <th>Fecha Límite</th>
          <th>Asignada A</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="maestro-tasks-table-body">
        </tbody>
    </table>
  </div>

  <div id="maestro-task-modal" class="modal hidden">
    <div class="modal-content auth-card">
      <h2>Crear y Asignar Tarea</h2>
      <form id="maestro-task-form">
        <div class="input-group">
          <label for="m-task-title">Título</label>
          <input type="text" id="m-task-title" required>
        </div>
        <div class="input-group">
          <label for="m-task-desc">Descripción</label>
          <input type="text" id="m-task-desc" required>
        </div>
        <div class="input-group">
          <label for="m-task-date">Fecha de Entrega</label>
          <input type="date" id="m-task-date" required>
        </div>
        <div class="input-group">
          <label for="m-task-assignee">Asignar a</label>
          <select id="m-task-assignee" class="form-select" required>
            <option value="" disabled selected>Seleccione un estudiante o grupo...</option>
            <option value="Todos mis estudiantes">Todos mis estudiantes</option>
            <option value="Carlos López">Carlos López</option>
            <option value="Ana Martínez">Ana Martínez</option>
          </select>
        </div>
        <div class="modal-actions">
          <button type="button" id="btn-cancel-m-task" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Publicar Tarea</button>
        </div>
      </form>
    </div>
  </div>
`;