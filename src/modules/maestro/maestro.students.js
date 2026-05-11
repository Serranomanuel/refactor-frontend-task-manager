export const MaestroStudentsView = `
  <div class="module-header">
    <h3>Estudiantes y Calificaciones</h3>
  </div>
  
  <div class="table-responsive">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Documento</th>
          <th>Estudiante</th>
          <th>Tarea Asignada</th>
          <th>Estado</th>
          <th>Calificación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="maestro-students-table-body">
        </tbody>
    </table>
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
          <label for="grade-feedback">Comentarios (Opcional)</label>
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